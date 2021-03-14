/**
 * @param {string} 	opt.url		: [required] the api url
 *                           IMPORTANT !!! : the response data must be sth like this
 *                           {
 *                           	total:number
 *                           	data:[{},{},...]
 *                           }
 * @param {array} 	opt.items 	: [optional] instead of using url, you can specify the item list directly
 * @param {int} 	opt.perpage	: [optional]
 * @param {str|obj} opt.query 	: [optional]
 * @param {array} 	opt.fields 	: [optional] columns to show for each item.
 *                             A) [{name:fieldname1, title:title1, sortable:true}, {name:fieldname2, title:title2},...]
 *                             OR B) [fieldname1, fieldname2 ...]
 *                             with A): name=db field name, title=th innerHTML, sortable:default false where this column is sortable
 * @param {array}	opt.tags : [optional]HTML tags, default ['table','tr','th','td']
 * @param {bool} 	opt.append 	: [optional][default=false] whether the items of the next page should append to the end of this one.
 * @param {bool} 	opt.renderHTML : [optional] default:true, if its false, then ListView won't draw tr-td before it calls drawItem delegate function.
 * @param {string} 	opt.pageType : [optional] navi|number|none, default=number, navi=prev/next, number=1...N, none=no page btns
 * @param {array} 	opt.pageLabels :[optional] for pageType=navi only, default = ["< previous", "next >"];
 * @param {int} 	opt.pageSize :[optional] an odd number, page button numbers 1...N default=13
 * @param {string} 	opt.sortKey : [required]
 * @param {string} 	opt.sortOrder : [optional] asc|desc
 * @param {func} 	opt.drawItem : [optional] function(rowElement, item, i){}, custom item rendering, once its declared, the default drawing process will NOT exec
 * @param {func} 	opt.drawCell : [optional] function(rowElement, data, cellItemDef){}, custom item rendering, once its declared, the default drawing process will NOT exec
 * @param {func} 	opt.onLoading : [optional] function(params){}, show loading indicator, params=this.query, also you can modify params by @return params
 * @param {func} 	opt.onLoaded : [optional] function(res){}, fired when ajax load successed, you can modify the response by @return res
 * @param {func} 	opt.onError	: [optional] function(){}, fired when ajax error
 * @param {func} 	opt.onEmpty	: [optional] function(){}, fired when data from server is empty
 * @param {func} 	opt.onLastPage	: [optional] function(){}, fired when its the last page.
 * @param {func} 	opt.onSelect	: [optional] function(){}, fired when a single row is selected.
 * @param {func} 	opt.onPagesRendered	: [optional] function(){}, after pages drew
 * @param  {object} delegate [optional] delegate which responses to these delegate methods 
 *                  delegate.drawListItem : alternative to opt.drawItem,
 *                  delegate.drawListCell : alternative to opt.drawCell,
 *                  delegate.onListLoading : alternative to opt.onLoading,
 *                  delegate.onListLoaded : alternative to opt.onLoaded,
 *                  delegate.onListError : alternative to opt.onError,
 *                  delegate.onListEmpty : alternative to opt.onEmpty,
 *                  delegate.onListLastPage : alternative to opt.onLastPage,
 *                  delegate.onListSelect : alternative to opt.onSelect
 *                  delegate.onListCheched : for list_item_checkbox only
 *                  delegate.onListPagesRendered : after pages drew
 * @param {element} target : [requied]
 * @return {ListView} a ListView instance
 *          public function update(query)
 *          public function dom() return the table element
 *          public funciton cursor() return current start/end idx
 *          public function data() return table data list (got from api server)
 *          public function data(N) return the Nth data of the tale (got from api server)
 *          public function checked() return all checked item's value list (list_item_checkbox is required)
 *			public function setItems(items) update data manually
 * @example : init
 *          $this.list = $list_view({url:"/api/users", sortKey:"id"}, $this.layer, $this.footer);//result MUST be saved as view's property or global var.
 * @example : search
 *          $this.list.update({keyword:"my keyword"})
 * @example : sort (automatic with header click event)
 * 
 * @example : paginate (automatic with .drawPages -> page click event)
 */
function $list_view(opt, target, pageTarget){
	var list = new ListView(opt,target,pageTarget);
	/*======== main process ========*/
	list.update.call(list);
	return list;
}

function ListView(opt,target,pageTarget){
	/*======== init ========*/
	var me = this;

	/*======== private properties ========*/
	var tags = opt.tags||['table','tr','th','td'];
	var v_table = $e(tags[0],{class:"list-view"},target);
	var v_pages = $dl({class:"list-view-pages"},pageTarget);
	var items = opt.items||[]; //item list from api server.
	var perpage = opt.perpage||10;
	var cursors = [0,perpage]; //start/end item index.
	var url = this.url = opt.url;
	var append = ('append' in opt)?opt.append:false;
	var query = opt.query||{};
	var sortKey = opt.sortKey;
	var sortOrder = opt.sortOrder||"asc";
	var fields = opt.fields;
	var total = 0;
	var pageStyle = opt.pageStyle||"number";
	var pageSize = opt.pageSize||13;
	var pageLabels = opt.pageLabels||["< previous", "next >"];
	var delegate = opt.delegate||{};
	var renderHTML = 'renderHTML' in opt? opt.renderHTML : true;
	var drawItem = opt.drawItem ||delegate.drawListItem;
	var drawCell = opt.drawCell ||delegate.drawListCell;
	var onLoading = opt.onLoading||delegate.onListLoading;
	var onLoaded = opt.onLoaded||delegate.onListLoaded;
	var onFinishDrawing = opt.onFinishDrawing||delegate.onListDrawed;
	var onError = opt.onError||delegate.onListError;
	var onEmpty = opt.onEmpty||delegate.onListEmpty;
	var onLastPage = opt.onLastPage||delegate.onListLastPage;
	var onSelectFunc = opt.onSelect||delegate.onListSelect;
	var onSelect;
	var onPagesRendered = opt.onPagesRendered||delegate.onListPagesRendered;
	var wrappers = [];//cell rendering wrapper function list
	var wrapperArgs = [];//cell rendering parameters (array)
	this.page = 1;
	this.perpage = perpage;
	this.delegate = delegate;
	for(var i=0,f;f=fields[i];i++){
		wrappers[i] = ($.isObject(f)&&f.wrapper&&$.isFunc(window["$list_item_"+f.wrapper]))?window["$list_item_"+f.wrapper]:false;
		wrapperArgs[i] = $.isArray(f.args)?f.args:(f.args?[f.args]:[]);
	}
	if(!query.limit)query.limit=perpage;
	if(sortKey)query.order = sortKey+(sortOrder=="desc"?" desc":"");
	if(onSelectFunc)
		onSelect = function(e){
			onSelectFunc.call(this,e,this.attr("i"));
		}

	/*======== public methods ========*/

	/**
	 * update table contents, such as search, refresh, pagination, sort
	 * @param  {bool} clearBeforeDrawing : whether listview should clear contents before drawing items, default=true
	 * @return null
	 */
	this.update = function(queryObj){
		if(queryObj){//update query
			query={};
			for(var k in queryObj){
				var v = queryObj[k];
				if($.isFunc(v))continue;
				if(v===null||v==="") delete query[k];
				else query[k] = v;
			}
			query.limit="0,"+perpage;
			me.page = 1;
		}
		if(onLoading){//user can show loading indicator at this timing.
			var q = onLoading.call($this,query);
			if(q) query = q;
		}
		//clear pagination
		if(pageTarget)
			pageTarget.find(".list-view-pages").attr("innerHTML","");
		
		if(url)
		$http.get(url, query, function(res, err){
			if(!append) v_table.innerHTML="";
			if(err){//error
				if(onError)onError.call($this,err);
			}else if(!res || !res.total || !res.data || res.data.length==0){//empty
				me.subtotal = total = 0;
				items = [];
				var em = drawEmpty();
				if(onEmpty)onEmpty.call($this, em);
				if(onPagesRendered) onPagesRendered.call($this,pageTarget);
			}else{
				v_table.removeClass("empty");
				total = res.total;
				me.total = total||0;
				if(append){
					items.concat(res.data)
				}else
					items = res.data;
				if(onLoaded){//user can custom response at this moment.
					var r = onLoaded.call($this,res);
					if(r) res = r;
				}
				cursors[0] = items&&items.length>0? items[0][sortKey]:0;
				cursors[1] = items&&items.length>1? items.last()[sortKey]:0;
				if(!fields) fields = Object.keys(items[0]);
				v_table.innerHTML="";
				drawHeader();
				drawItems();
				if(onFinishDrawing){//user can custom response at this moment.
					onFinishDrawing.call($this);
				}
				if(onPagesRendered) onPagesRendered.call($this,pageTarget);
			}
		});
		else if(items&&items.length>0){
			if(!fields) fields = Object.keys(items[0]);
			v_table.innerHTML="";
			me.subtotal = total = items.length;
			cursors = this.cursor();
			drawHeader();
			drawItems();
			if(onFinishDrawing){//user can custom response at this moment.
				onFinishDrawing.call($this);
			}
			if(onPagesRendered) onPagesRendered.call($this,pageTarget);
		}
		return me;
	}

	this.dom = function(){return v_table};
	this.target = function(){return target;}
	this.pageTarget = function(){return pageTarget;}
	this.cursor = function(){
		var s=(me.page-1)*perpage;
		return [s, Math.min(total,s+Math.min(perpage,items.length))];
	}
	this.getPage = function(){return me.page;}
	this.data = function(i){return arguments.length==0?items:items[parseInt(i)];}
	this.total = function(){return total;}
	this.setFields = function(fs){fields = fs;}
	this.setItems = function(its){items = its;}

	/*======== private methods ========*/

	var drawHeader = function(){
		//draw header
		var row;
		if(v_table.childNodes.length==0){//draw header
			row = $e(tags[1],{},v_table);
			for(var i=0,f;f=fields[i];i++){
				var k=$.isObject(f)?f.name:f;
				let title = f.title||f.label;
				if(`${title||''}`.includes(".")) title = T(title);
				var hc = $e(tags[2],{html:title, key:k, class:k==sortKey&&'checkbox'!=f.wrapper?sortOrder+" on":(f.sortable===true?"sortable":"none"), order:sortOrder},row);
				if(wrappers[i]){
					var args = wrapperArgs[i].slice();
					args.unshift($.isObject(f)?f.name:"");
					args.unshift(null);
					args.unshift(hc);
					wrappers[i].apply(me,args);
					hc.addClass("list-view-"+f.wrapper);
				}
				if(f.sortable===true)
					hc.bind('click',function(){
						sort.call($this,this.attr('key'),sortKey==this.attr('key')&&this.attr("order")=='asc'?'desc':'asc');
					});
			}
			if(drawItem) //if delegate, use delegate.
				drawItem(row, null, -1);
		}
	}

	var drawItems = function(){
		//draw items
		
		for(var i=(append || !url)?cursors[0]:0,o;o=items[i];i++){
			if((!append&&i>=perpage && url)||((append || !url)&&i>=perpage+cursors[0]))break; //page over
			var row;
			if(renderHTML) row = $e(tags[1],{i:i},v_table);
			for(var j=0,f;f=fields[j];j++){
				var k=$.isObject(f)?(f.name||f.wrapper):f;
				var v=o[k];
				var cell = renderHTML ? $e(tags[3],{i:i,html:v,class:'list-item-'+k},row):false;
				if(wrappers[j]){
					var args = wrapperArgs[j].slice();
					args.unshift($.isObject(f)?f.name:"");
					args.unshift(v==undefined?i:v);
					args.unshift(cell);
					args.push(f);
					var nv = wrappers[j].apply(me,args);
					if(renderHTML)cell.addClass("list-view-"+f.wrapper);
					else o[k] = nv;
				}
				if(templates && f.name && templates[f.name]){
					cell.attr({html:""}).append(...( templates[f.name].render(o,{pref:'e'}) || []) )
				}
				if(drawCell)
					drawCell(cell, o, f)
			}
			if(drawItem) //if delegate, use delegate.
				row = drawItem(row, o, i);
			if(row && onSelect)
				row.bind("click",onSelect);
		}
		//draw pages
		if(pageStyle!="none")
			drawPages(pageTarget||$e(tags[3],{colspan:fields.length},$e(tags[1],{},v_table)));
	}

	var drawEmpty = function(){
		v_table.addClass("empty");
		return $tr($td($h2('@list_view.empty')), v_table);
	}

	/**
	 * draw page indexes
	 * @param  {type} target 
	 * @return {[type]}        [description]
	 */
	var drawPages = function(target){
		if(!target)return;
		var page 	= me.page||1,
			ptotal 	= Math.ceil(total/perpage),
			size 	= Math.min(ptotal, Math.max(7,pageSize)),
			pages 	= [page];
		//pagenation function
		var paginate = function(){
			var page = this.attr("page");//"+1":next page, "-1":previous page, int: page num
			if(page==="+1"||page==="-1"){//next | prev
				var k = sortKey+"@"+(((page==="+1"&&sortKey=="asc")||(page==="-1"&&sortKey=="desc"))?"gt":"lt");
				me.page = me.page||0;
				var v = page==="-1"?me.page-1:me.page+1;
				v = Math.min(ptotal,Math.max(0,v));
				me.page = v;
				query[k] = v;
				query.limit = `${v*perpage},${perpage}`;
				me.update.call($this);
			}else if($.isNumber(page)){//page number
				if(this.className=="on")return;
				query.limit = Math.max(0,page-1)*perpage+","+perpage;
				me.page = page;
				me.update.call($this);
			}
		}

		// var exists = target.find1st(".list-view-pages");
		// if(exists) $.remove(exists);
		v_pages.innerHTML="";

		//navi mode
		if(pageStyle=="navi"){//prev|next
			return $dl([
				$dd({html:pageLabels[0],page:"-1"}).bind('click',paginate),
				$dd({html:pageLabels[1],page:"+1"}).bind('click',paginate),
			],target).attr({class:"list-view-pages"});
		}

		//get page num list
		// var total = 220,perpage=22,pageSize=10,me={page:4};
		
		if(ptotal>size){
			var seg = size%2==0?size+1:size;
			for (var i=1;pages.length<seg;i++){
				if(page-i>=1)pages.unshift(page-i);
				if(page+i<=ptotal)pages.push(page+i);
			}
			if(pages[pages.length-1]<=ptotal-1)
				pages=pages.slice(0,pages.length-2).concat([0,ptotal]);
			if(pages[0]>=2)
				pages=[1,0].concat(pages.slice(2,pages.length));
		}else{
			pages = [];
			for(var i=1;i<=ptotal;i++)
				if(pages.indexOf(i)<0)
					pages.push(i);
		}

		//draw pages
		for(var i=0;i<pages.length;i++){
			var p = pages[i];
			var dd = $dd({page:p,html:p==0?"...":p+"",class:p==page?"on":""},v_pages);
			if(p!=0) dd.bind("click",paginate);
		}

		if(onPagesRendered) onPagesRendered.call($this,target);
	}

	/**
	 * sort functoin
	 * @param  {string} field 
	 * @param  {string} order asc|desc
	 */
	var sort = function(field, order){
		sortKey = field;
		sortOrder = order;
		me.page = 1;
		query.limit = "0,"+perpage;
		query.order = field+" "+order;
		me.update.call($this);
	}

}

/**
 * listview checkbox item
 * @param  {element} cell : the cell dom element
 * @param  {int/string} id : item (the data of this row) id
 * @return {string} 
 */
function $list_item_checkbox(cell, id){
	var listview = this;
	cell.innerHTML="";
	if(listview) listview.checkedList = listview.checkedList||[];
	var checked = (!listview.checkedAll && listview.checkedList.indexOf(id)>=0)||(listview.checkedAll && listview.checkedList.indexOf(id)<0)?'checked':false;
	$label([
		$input({type:"checkbox",value:(id==null?"all":id),checked:checked})
	],cell).bind("click",function(e){
		e.stopPropagation();
		var el = (this.tagName=="LABEL")?this.childNodes[0]:this;
		if(el.value=="all"){//header clicked
			var tbl = el;
			while (tbl.tagName!="TABLE")
				tbl = tbl.parentNode;
			if(el.checked){
				tbl.find("input[type=checkbox]").attr("checked",true);
			} else {
				tbl.find("input[type=checkbox]").attr("checked",false);
			}
			listview.checkedList = [];
			listview.checkedAll = el.checked?true:false;
		}else{//check one
			var isPush = (el.checked&&!listview.checkedAll)||(!el.checked&&listview.checkedAll); 
			if(isPush){
				listview.checkedList.push(el.value);
			}else{
				listview.checkedList = listview.checkedList.filter(function(n){return n!=el.value});
			}
		}
		if(listview && listview.delegate && listview.delegate.onListChecked){
			//trigger the delegate method
			listview.delegate.onListChecked.call(listview, listview.checkedList, listview.checkedAll);
		}
	});
}

/**
 * listview checkbox item
 * @param  {element} cell : the cell dom element
 * @param  {int/string} id : item (the data of this row) id
 * @return {string} 
 */
function $list_item_time2date(cell, v, field, format){
	if($.isNumber(v))
		cell.innerHTML = new Date(v).format(format);
}

var $list_item_timediff = function(el,v,k){
    if(!k || !$.isString(k))return v;
    if(v===null) return; // header, el is <th>
    var str = `${v}`.timediff();
    if(el) el.textContent = str;
    if(v>0){
        var t = parseInt(v);
        var nv = new Date(t*1000).format('YYYY-MM-DD hhh:mm:ss');
        el.attr('hint',nv).addClass("tooltip");
    }
    return str;
}

var $list_item_price = function(el,v,k){
    if(el.tagName=="TH")return;
    el.textContent = `¥${v||0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var $list_item_number = function(el,v,k){
    if(el.tagName=="TH")return;
    el.textContent = `${v||0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var $list_item_thumb = function(el,v,k){
    if(el.tagName=="TH")return;
    el.innerHTML="";
    $div({class:"thumb"},el).css({backgroundImage:`url(${v})`})
}