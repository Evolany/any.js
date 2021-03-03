
/**
 * tabmenu element
 * @param  Object opt :
 *         items : [required][array] form item list,
 *         		tab item defination {
 *         			name : [required][string] : property name
 *         		    title : [optional][string] the title of this item
 *         		}
 *         cursor : [optional][int] a index number, specify the tab idx to be focused on.
 *         onSwitch : [required][function] a callback function when tab switched
 *         delegate : [optional] delegate object responses to these methods
 *         		delegate.onTabSwitch: alternative to opt.onSwitch,
 *         className : [optional][string] add class name (same level of 'tab-menu' class)
 *
 * @param  Element target : element object to append to
 * @return DetailView instance
 *         public function dom() : return an ul element
 *         public function draw() : draw the form
 */

function $tab_menu(opt, target){
	var tabs = new TabMenu(opt,target);
	tabs.draw.call(tabs);
	return tabs;
}

function TabMenu(opt, target){
	/*======== init ========*/
	var me = this;
	var delegate = opt.delegate||{};
	var onSwitch = opt.onSwitch||delegate.onTabSwitch;
	if(!onSwitch){
	}

	/*======== private properties ========*/
	var v_tabs;
	var cursor = opt.cursor||-1;

	/*======== public methods ========*/
	this.dom = function(){return v_tabs}

	//this.tab = function(){return cursor;}

	this.draw = function(){
		if(v_tabs)v_tabs.remove();
		v_tabs = $dl({class:"ui-tab-menu"},target);
		if (opt.style) v_tabs.addClass(opt.style);

		for(var i=0,o;o=opt.items[i];i++){
			if(typeof(o)!="object" || !o.name){
				continue;
			}
			var v_tab = $dd({name:o.name,html:o.title||o.name,"class":"tab-menu-item-"+o.name,i:i},v_tabs);
			if(o.class)v_tab.addClass(o.class);
			if(i==cursor){
				v_tab.addClass("on");
			}
			v_tab.bind("click",function(e){
	//			cursor = parseInt(this.attr("i"));
				if(onSwitch) {
					try{
						var res=onSwitch.call(me,this.attr("name"),this.attr("i"));
						if(res===false) {
							return;
						}
					}catch(e){console.error(e);}
				}
				v_tabs.find("dd").removeClass("on");
				this.addClass("on");
			});
		}

		if(cursor>=0)
		setTimeout(function(){
			me.switch(cursor);
		},100);
		return me;
	};

	this.switch = function(i){
		if(i>=0&&i!=cursor)
		for(var j=0,d;d=v_tabs.childNodes[j];j++){
			if(j==i){
				return d.fire("click");
			}
		}
	}

	/**
	 * add tab to tabmenu
	 * @param {[type]} i : [int] tab index 0~N,N<=tab length
	 * @param {[type]} o : [string | function(dom)]
	 *   [o=string] : view name , an instance of $tab_view (or derived from $tab_view)
	 *   [o=function] : function(i) use 'this' to access this Tabmenu instance.
	 *   o.name : 
	 *   o.title : 
	 *
	 */
	this.addTab = function(i,o){
		i = Math.min(i,v_tabs.childNodes.length);

		var v_tab = $dd({name:o.name,html:o.title||o.name,"class":"tab-menu-item-"+o.name,i:i})
		.bind("click",function(e){
			v_tabs.childNodes.removeClass("on");
			this.addClass("on");
			if(onSwitch) onSwitch.call(me,this.attr("name"),this.attr("i"));
		});

		//add cross btn
		$b({i:i},v_tab).bind('click',function(e){
			e = e || window.event;
			e.stopPropagation();
			me.removeTab(parseInt(this.attr("i")));
		})

		//do insert | append
		if(i>=v_tabs.childNodes.length){
			v_tabs.appendChild(v_tab);
		}else{
			v_tab.left(v_tabs.childNodes[i]);
		}

		//reset i
		v_tabs.find('dd',function(el,ii){
			el.attr({i:ii}); //adjust the indexes
		});

		//notice the delegate
		v_tab.fire('click');
	}

	this.removeTab = function(i){
		if(i<v_tabs.childNodes.length) {
			$.remove(v_tabs.childNodes[i]);
			v_tabs.find('dd',function(el,ii){
				el.attr({i:ii});
				var b = el.find1st('b');
				if(b)b.attr({i:ii});
			});
			var t = v_tabs.childNodes[0];
			if(t) t.fire('click');
		}
	}
}

var $alert=function(title, desc, btnLabel, onclose){
    var p = $popup([
        $header($h2(title)),
        $p(desc||""),
        $footer([
            $button(btnLabel||'OK').bind('click',function(){
				p.close()
				if(onclose)onclose();
			}),
        ])
	]);
	p.dom().addClass("popup-confirm")
	p.dom().parentNode.addClass("center-layout");
}

var $confirm=function(callback, title, body, btnLabel1, btnLabel2){
	document.body.find(".popup-confirm").remove();
	var popup = $popup([
		$header($h2(title)),
		$p(body||""),
		$footer([
			$button({html:btnLabel1||'OK',class:'red'}).bind('click', function(e) {
				if (callback) callback(true);
				popup.close();
			}),
			$button({html:btnLabel2||'Cancel',class:'light'}).bind('click', function(e) {
				if (callback) callback(false);
				popup.close();
			}),
		])
	]);
	popup.dom().addClass("popup-confirm");
	popup.dom().parentNode.addClass("center-layout");
}

/**
 * @param opts: array of list items
 * @param attrs: Element attrs
 * 		.maxWidth : disable auto calc width
 * 		.multiple: multiple selection
 * 		.default : default value
 * 		.value : value
 * 		.onSelect: function (e, i),
 * 		.drawItem : function (el, o)
 * @method setLabel(label) : set txt inside selectbox
 */
var $dropdown = function(opts,attrs,tar){
	var lb,def=attrs.value||attrs.default;
	var onSelect = attrs.onSelect;
	var embed = attrs.embed;
	var disabled = attrs.disabled;
	// elog("opts","v=",opts)
	opts = !empty(opts)? opts.map((e,i)=>{
		if($.isObject(e)){
			if(def==e.value)lb=e.label+"";
			return e;
		}else{
			if(def==i+1)lb=e+"";
			return {label:e,value:i+1}
		}
	}) : [];
	var max=0; 
	var widthKey = attrs.flex||attrs.maxWidth?"width":"minWidth";
	opts.forEach(e=>{max=Math.max(($.isString(e)?e:e.label||'no name').length,max)});
	let init_v = def||'';
	if(init_v&&$.isArray(init_v)) init_v = init_v.join(',');
	var multi=attrs.multiple?1:0,ma,ul,ip,
		dr = $div([
		$label(lb||" "),
		ip = $input({type:'hidden',name:attrs.name,value:init_v,class:attrs.class||''})
	],tar).attr({class:'ui-dropdown'+(lb?' on':'')+(disabled?' disabled':''),max:max})
	dr.style[widthKey]=(max*12)+24+'px';
	if(attrs.maxWidth) dr.style.maxWidth = `${attrs.maxWidth}px`;
	if(attrs.minWidth) dr.style.minWidth = `${attrs.minWidth}px`;
	dr.bind('click',function(e){
		e.stopPropagation();
		if(disabled)return;
		dr.addClass("on");
		$.remove(ma);
		ma=embed?false:$article({id:'mask',class:'transparent ui-dropdown-mask'},document.body).bind('click',function(e){
			this.remove();
		});	
		if(embed && this.parentNode)
			$.remove(this.parentNode.find1st(".ui-dropdown-opts"));
		let r = this.rect();
		if(ma) {// for mask
		    let ma_s =window.getComputedStyle(ma)
		    if(ma_s.position=='fixed') {
				let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
				r.top -= scrollTop;	
		    }
		}
		let lineHeight = $browser.mobile ? 44 : 32;
		let top = window.outerHeight-r.top-r.height <= 190 ? r.top-190 : r.top+r.height; 
		ul = $ul({class:'ui-dropdown-opts'},ma)
			.css(embed?{height:lineHeight*Math.min(5,opts.length)+'px'}:{top:top+'px',left:r.left+'px',height:lineHeight*Math.min(5,opts.length)+'px'})
		if(embed) ul.right(this);
		ul.style[widthKey]=r.width+'px';
		for(var o of opts){
			var li = $li({html:o.label,val:o.value,class:o.class||'',cid:o.id||''},ul).bind('click',sel)
			if(attrs.drawItem) attrs.drawItem(li, o);
		}
	});
	if(attrs.class) dr.addClass(attrs.class);
	var sel = function(e){
		var v = this.attr("val"), lb=[...this.childNodes].find(c=>c.nodeType==Node.TEXT_NODE);
		lb = lb&&lb.textContent||this.textContent;
		if(onSelect && !onSelect.call(this,e))return false;
		if(multi){
			var vs = ip.value.length?ip.value.split(','):[];
			var lbs = ip.labels?ip.labels.split(','):[];
			var i = !v||v==''?-1:vs.indexOf(v+'');
			if(i>=0) {
				vs.splice(i,1);
				lbs.splice(i,1);
				this.removeClass('on')
			}else{
				if(v>0||`${v}`.length){
					vs.push(v)
					lbs.push(this.textContent)	
				}
				this.addClass('on')
			}
			ip.value = vs.join(',');
			ip.fire("change");
			lb = lbs.join(',');
			ip.attr("labels",lb)
		}else{
			ip.value = v;
			ip.fire("change");
			if(embed){
				$.remove(ul);
			}else{
				$.remove(ma);
			}
		}
		dr.firstChild.textContent=lb;
		dr.removeClass('on');
	}
	this.setLabel = function(label){
		if(dr&&dr.firstChild)
			dr.firstChild.innerHTML=label;
	}
	return ip;
}

$dropdown.removeMask = ()=>{
	document.body.find('.ui-dropdown-mask').remove();
}

var $menu = function(opts,attrs,tar,onChange){
	opts = opts? opts.map(e=>$.isObject(e)?e:{label:e}) : [];
	if(!opts.length)return;
	var max=0; 
	opts.forEach(e=>{max=Math.max(e.label.length,max)});
	var i=0;
	if('value' in attrs || 'default' in attrs){
		i = (attrs.value || attrs.default);
		if(i>0)i=i-1;
	}
	var ma,ul,bt=$button(attrs,tar).attr({class:'ui-menu',html:opts[i].label}).bind('click',function(e){
		$.remove(ma);
		ma=$article({id:'mask'},document.body).bind('click',function(e){
			this.remove();
		});	
		let r = this.rect(), w=max*14;
		let height = 32*Math.min(6,opts.length);
		let top = window.outerHeight-r.top-r.height <= 190 ? r.top-height-10 : r.top+r.height+10;
		let left = $.screenWidth()-r.left-w<=16?'auto':r.left+'px';
		let right = left=='auto'?$.screenWidth()-r.left-r.width+'px':'auto';
		ul = $ul({class:'ui-dropdown-opts'},ma).css({top:top+'px',left:left,right:right,width:w+'px',height:height+'px'});
		var i=0;
		for(var o of opts){
			$li({html:o.label,i:i++},ul).bind('click',sel)
		}
	});
	if(attrs.class) bt.addClass(attrs.class);
	var sel = function(e){
		$.remove(ma)
		if(attrs.updateLabel)
			bt.textContent = this.textContent;
		if(onChange) onChange.call(bt,this.i);
	}
	return bt;
}

// var $hint = (dom,rect)=>{
// 	var el = $div(dom,document.body).attr({id:'hint',class:'hint'});
// 	if(rect)
// 	for(var k of ['top','left','width','height']){
// 		if(rect[k]) el.style[k] = `${rect[k]}px`;
// 	}
// 	return el;
// }

var show_indicator = function(cls){
	var p = $popup([
		$div({id:'indicator'})
	],true);
	var fr = p.dom();
	fr.removeClass('popup');
	fr.parentNode.addClass('ui-indicator')
	if(cls)fr.parentNode.addClass(cls)
	//customize p.dom()?
}

var hide_indicator = function(){
	var i = $id("indicator");
	if(i){
		$.remove(i.parentNode.parentNode);
	}
	$.remove(document.body.find1st(".ui-indicator"));
	document.body.attr("popup",0)
	// else
	// 	$.remove($id("mask"));
}

var video_thumb = function(vod,w,h){
	var canvas = $canvas({width:200,height:200},document.body).css({top:0,left:0,position:'fixed',zIndex:1000,backgroundColor:'white'});
	vod.play();
    canvas.getContext('2d').drawImage(vod, 0, 0, w||268, h||180);
	return canvas.toDataURL('image/jpeg');
}

/**
 * calendar function
 * @param  {object} opts :
 *          x : calendar.left (float) [optional]
 *          y : calendar.top (float) [optional]
 *          style : date|datetime|time
 *          year : 2016, [optional]
 *          month : 9 [optional]
 * 			start : 2020-01-11, start date, 1st available date [optional]
 * 			end : 2020-01-11, end date, last available date [optional]
 * 			delegate : delegate obj to receive error
 *          dayHandler: function(y,m,d){ //day selected handler [required]
 *          	//y : 2016
 *          	//m : 10 (date.getMonth()+1)
 *          	//d : 12
 *          },
 *			monthHandler: function(y,m,monthDiff){ //month changed handler [optional]
 *          	//y : 2016
 *          	//m : 10 (date.getMonth()+1)
 *          	//monthDiff : -1 last month, 1 next month
 *          },
 * 			embed : false, if its embeded then no mask, and there could be more than 1 in this screen
 * 
 * @param  {element} target : target element to append to
 * @return {element} this calendar article object
 *
 * TO hide calendar
 * $calendar().hide();
 */
var $calendar = function(opts,target,cal){

	if(arguments.length==0)
		return {hide:function(){$.remove(`#${opts.id||'calendar'}`);}};

	//init
	var yyyy = opts.year||new Date().getFullYear(),
		mm = opts.month||new Date().getMonth()+1,
		style = opts.style||"date",
		target = target||document.body,
		start_t = opts.start ? Date.parse(opts.start) : 0,
		end_t = opts.end ? Date.parse(opts.end) : Number.MAX_SAFE_INTEGER,
		start_month = 0,
		delegate = opts.delegate || false;
	opts.date = opts.date || {};

	//set start month, to prevent back before start month
	if($.isString(opts.start)) {
		let [sy,sm] = opts.start.split("-");
		start_month = new Date(parseInt(sy), parseInt(sm)-1, 1).getTime();
	}

	if(!opts.embed)
		$.remove(`#${opts.id||'calendar'}`);
	
	$.remove("#calendar-mask");

	var mask;
	if(!opts.embed)
		mask = $article({id:"calendar-mask"},target);
	
	cal = cal || $article({id:opts.id||"calendar",class:"ui-calendar calendar-"+style,calendar_style:style},target);
	cal.attr({html:"",y:yyyy,m:mm}); //reuse
	if(opts.x)cal.css("left",opts.x+"px").attr("left",opts.x);
	if(opts.y)cal.css("top",opts.y+"px").attr("top",opts.y);

	//generate days list
	var days 	= new Date(yyyy,mm,0).getDate(),//days of this month
		w1 		= new Date(yyyy,mm-1,1).getDay(), //weekday of the 1st day of this month
		w$ 		= new Date(yyyy,mm-1,days).getDay(), //weekday of the last day of this month
		i 		= 1,
		dates 	= [];//arr of date

	//fill dates with days of this month
	while(i<=days)
		dates.push({year:yyyy, month:mm, day:i++, ts:Date.parse(`${yyyy}-${mm<10?'0'+mm:mm}-${i-1<10?''+(i-1):i-1}`)});

	//fill dates with last month if 1st is not monday
	days = new Date(yyyy,mm-1,0).getDate();//days of last month
	w1 = w1==0?7:w1;
	while(1<(w1--))
		dates.unshift({year:yyyy, month:mm-1, day:days--, ts:Date.parse(`${yyyy}-${mm-1<10?'0'+(mm-1):mm-1}-${days<10?'0'+days:days}`)});

	//fill dates with next month if last is not sunday
	i = 1; 
	while(w$++%7!=0)
		dates.push({year:yyyy, month:mm+1,day:i++, ts:Date.parse(`${yyyy}-${mm+1<10?'0'+(mm+1):mm+1}-${i<10?'0'+i:i}`)});

	//declare elements and handlers
	const titles = "月火水木金土日";
	
	var tbl = $table({},cal),
		btn_ok, btn_l, btn_r,
		col_y, col_m, col_h, col_i,
		v_y = yyyy,
		v_m = mm,
		v_d = opts.date.day||1,
		v_h = opts.date.hour||0,
		v_i = opts.date.minute||0,
		v_wd = new Date(v_y,v_m-1,v_d).getDay();
		v_wd = v_wd==0?6:v_wd-1;
	var datelabel,timelabel,v_time; //time selecting row
	//declare time selection items
	
	var cbp_month = opts.monthHandler;
	var cbp_day = opts.dayHandler;
	var f_close = function(){
		mask.remove();
		cal.remove();
		window.onwheel = window.onmousewheel = document.onmousewheel = window.ontouchmove = document.onkeydown =null;
	}
	var f_month_changed = function(e){//month change handler, calendar view
		e = e||window.event;
		e.stopPropagation();
		var el = e.target||e.srcElement;
		var mdiff = el.className=='left'?-1:1;
		f_change_month(cal.attr("y"),cal.attr("m")+mdiff)
		cal.title.className="highlight";
	}
	var f_change_month = function(y,m){
		var d = new Date(y,m-1,1);
		if(d.getTime()<start_month) return false;
		var opt = {year:d.getFullYear(),month:d.getMonth()+1,day:v_d||1,
			monthHandler:cbp_month,dayHandler:cbp_day,style:cal.attr("calendar_style"),
			hour:parseInt(v_h), minute:parseInt(v_i), embed : opts.embed, start:opts.start, end:opts.end};
		if(cal.attr("left"))opt.x = cal.attr("left");
		if(cal.attr("top"))opt.y = cal.attr("top");
		$calendar(opt,target,cal);
		if(cbp_month) cbp_month(d.getFullYear(),d.getMonth()+1);
	}
	var f_day_handler = function(e){ //date selection handler, calendar view
		e.stopPropagation();
		if(['start','end'].includes(this.error))
			return delegate ? $.send(delegate, 'calendar-error', this.error) : alert(T(`calendar.err.${this.error}`));
		if(cbp_day){
			v_y = this.attr('yy');
			v_m = this.attr('mm');
			v_d = this.attr('dd');
			v_wd = this.attr('wd');
			cal.find("td",function(el){
				el.removeClass("on");
			})
			this.addClass("on");
			if(timelabel){
				var vs = timelabel.textContent.split(":");
				v_h = vs[0], v_i = vs[1];
			}
			if(datelabel){
				datelabel.innerHTML=`${v_y}-${v_m}-${v_d}<sub>(${v_wd})</sub>`;
			}
			cbp_day(v_y, v_m, v_d, v_h, v_i);
		}
		//f_close();
	};

	var f_drum = function(el){ // set y/m/d highlight for date picker drum view
		var sh = el.attr("sh")*36;
		var lastY = parseInt(el.attr("lastY"));
		var top = Math.min(sh-180,el.scrollTop);
		var r0 = top>lastY ? Math.floor(top/36):Math.ceil(top/36);
		el.attr("lastY",top);
		el.scrollTop=r0*36;
		var lis = el.find('li');
		for(var i=1;i<=lis.length;i++){
			var r = i>=r0+4?3-(i-r0-3):i-r0;
			var cls = r<=0? "":"scale"+r;
			lis[i-1].className = cls;
		}
	}

	var f_ok = function(){
		v_y = col_y?parseInt(col_y.find1st(".scale3").textContent):v_y;
		v_m = col_m?parseInt(col_m.find1st(".scale3").textContent):v_m;

		v_h = col_h?parseInt(col_h.find1st(".scale3").textContent):v_h;
		v_i = col_i?parseInt(col_i.find1st(".scale3").textContent):v_i;

		// if(col_y && timelabel){
		// 	var vs = timelabel.textContent.split(":");
		// 	v_h = vs[0], v_i = vs[1];
		// }
		if(cbp_day)
			cbp_day(v_y, v_m, v_d, v_h, v_i);
		// f_close();
		f_change_month(v_y,v_m);

	}

	if(mask){
		//disable scroll
		window.onwheel = window.onmousewheel = document.onmousewheel = window.ontouchmove = document.onkeydown = function(e){
			var c = $id(opts.id||"calendar");
			if(!c) return f_close();
			if(!c.attr("scroolY"))
				c.attr("scrollY", document.body.scrollTop);
			else{
				if(c && "scroll"!=c.attr("status")) 
					setTimeout(function(){
						if(document.body.scrollTop-c.attr("scroolY")>20)
							f_close();
						c.removeAttribute("scroolY")
						delete c["scroolY"];
					},200,c)
			}
		};

		mask.bind("click",f_close);
	}

	var clear_drum_content = function(){
		cal.attr("status","scroll");
		btn_l.hide();
		btn_r.hide();
		btn_ok.show();
		var i = tbl.childNodes.length;
		while(1<i--){
			tbl.childNodes[tbl.childNodes.length-1].remove();
		}
		col_y=col_m=col_h=col_i=false;
	}

	var on_drum_scroll = function(e){
		f_drum(this);
	}
	var on_drum_click = function(e){
		// if(this.className=="space")return;
		var cls = this.parentNode.className;
		var i = parseInt(this.textContent);
		this.parentNode.scrollTop = cls=="years" ? (i-1970)*36: (i-1)*36;
	}

	var draw_date_drum = function(e){//show year|month selection
		clear_drum_content();
		var ny = new Date().getFullYear(); //FIXME, let user set start/end
		$tr([
			// $td({class:"space"}),
			$td([
				$div([
					$div([
						col_y=$ul([$li({class:"space"}),$li({class:"space"})]),
					]).attr({sh:(ny-1970)+6,class:"years"}).bind('scroll',on_drum_scroll),
					$div([
						col_m=$ul([$li({class:"space"}),$li({class:"space"})]),
					]).attr({sh:12+4,class:"months"}).bind('scroll',on_drum_scroll)
				]).addClass('scroll-frame')
			]).attr({colspan:7,class:"drum"}),
			// $td({class:"space"}),
		],tbl);

		//year drum
		for(var i=1970;i<=ny+1;i++)
			$li(i+"年",col_y).bind('click',on_drum_click);
		$li({class:"space"},col_y);$li({class:"space"},col_y);
		col_y.parentNode.scrollTop = (yyyy-1970)*36;

		//month drum
		for(var i=1;i<=12;i++)
			$li(i+"月",col_m).bind('click',on_drum_click);
		$li({class:"space"},col_m);$li({class:"space"},col_m);
		col_m.parentNode.scrollTop = (mm-1)*36;

		f_drum(col_y.parentNode);
		f_drum(col_m.parentNode);
	}

	var draw_time_drum = function(e){//show year|month selection
		clear_drum_content();
		$tr([
			// $td({class:"space"}),
			$td([
				$div([
					$div([
						col_h=$ul([$li({class:"space"}),$li({class:"space"})]),
					]).attr({sh:30,class:"hours"}).bind('scroll',on_drum_scroll),
					$div([
						col_i=$ul([$li({class:"space"}),$li({class:"space"})]),
					]).attr({sh:12+4,class:"minutes"}).bind('scroll',on_drum_scroll)
				]).addClass('scroll-frame')
			]).attr({colspan:7,class:"drum"}),
			// $td({class:"space"}),
		],tbl);

		//year drum
		for(var i=0;i<=23;i++)
			$li(i+"時",col_h).bind('click',on_drum_click);
		$li({class:"space"},col_h);$li({class:"space"},col_h);
		col_h.parentNode.scrollTop = v_h*36;

		//month drum
		for(var i=0;i<12;i++)
			$li((i*5)+"分",col_i).bind('click',on_drum_click);
		$li({class:"space"},col_i);$li({class:"space"},col_i);
		col_i.parentNode.scrollTop = parseInt(v_i/5)*36;

		f_drum(col_h.parentNode);
		f_drum(col_i.parentNode);
	}
	
	//draw title line
	var draw_calendar = function(){
		var title_line = $tr({},$thead({},tbl));
		$th([
			cal.title = $u(yyyy+'年 '+mm+'月 ').bind('click',draw_date_drum),
			btn_ok = $b({class:'check',html:"OK"}).bind("click",f_ok),//save btn
			$b({class:'cross'}).bind("click",f_close),//close button
			btn_r = $b({class:'right'}).bind("click",f_month_changed),//prev month
			btn_l = $b({class:'left'}).bind("click",f_month_changed),//next month
		],title_line).attr({colspan:7});

		//draw time picker
		if(style.indexOf("time")>=0){
			v_time = $tr([
				$td([
					datelabel = $label({class:'date-selected',html:`${v_y}-${v_m}-${v_d||1} (${titles[v_wd]})`}).bind('click',draw_date_drum),
					timelabel = $label({class:'time-selected',html:v_h?`${v_h<10?'0'+v_h:v_h}:${v_i<10?'0'+v_i:v_i}`:"10:00"}).bind('click',draw_time_drum),//`${v_h}:${v_i}`
				]).attr({colspan:7})
			],tbl).addClass('time-row');
		}

		var grids = $tr({class:'week-row'},tbl);
		for(var i=0;i<7;i++)
			$th(titles.charAt(i)+"",grids);

		//draw days
		$tr($td({colspan:9,class:"space-s"}),tbl).attr({class:"space-s"});
		var tar = $tr({},tbl);
		for(var i=0;i<dates.length;i++){
			var tar = i>0&&i%7==0 ? $tr({},tbl) : tar;
			var td = $td({html:""+dates[i].day,class:dates[i].month!=mm ?"gray":'','yy':dates[i].year,'mm':dates[i].month,'dd':dates[i].day, 'wd':titles[i%7]}, tar).bind("click",f_day_handler);
			let err = dates[i].ts<start_t ?'start':(dates[i].ts>end_t?'end':false);
			if(err) td.attr("error", err);
			if(dates[i].month==mm && dates[i].day==v_d && !err)
				td.addClass("on");
		}
		btn_ok.hide();
	}

	draw_calendar();

	return cal;
}

/**
 * tutorial indicator
 * @param {*} tar : target Element
 * @param {*} tips : text (html)
 * @param {*} onclick : onclick event (optional)
 * @param {*} data : onclick event (optional)
 */
const $indicate = function(tar,tips,onclick,data){
	if($.isString(tar)) tar = document.body.find1st(tar);
	if(!tar) return;
	var isInput = (tar.tagName=='INPUT'||tar.tagName=='TEXTAREA') && tar.type!='checkbox' && tar.type!='radio';
	$(".indicator-mask").remove();
	$.remove($id("form-item-autocomplete"));
	$.remove(window.indicator_mask_instance);
	if(data && data.step && data.step.btn_label === '自動入力'){
		tar.setAttribute('readonly', 'readonly');
	}
	var sw = $.screenWidth(), sh = $.screenHeight(), bw = Math.max(sw,sh),
		r = $.rect(tar),
		//TODO : solve vertical scrolling 
		margin = (r.top==0||r.left==0||r.top+r.height==sh||r.left+r.width==sw)?0:8,
		dom, tip;
	if(tips&&tips.charAt(0)=='@') tips = T(tips);
	var click = function(e){ 
		if(isInput) {
			if(data && data.step && data.step.btn_label === '自動入力'){
				return data.step.btn && data.step.btn(tar);
			}else{
				return tar.focus();
			}
		}
		let x=e.clientX,y=e.clientY;
		var hit = x>=r.left&&x<=r.left+r.width&&y>=r.top&&y<=r.top+r.height;
		if(!hit){
			var rt = tip.rect();
			hit = x>=rt.left&&x<=rt.left+rt.width&&y>=rt.top&&y<=rt.top+rt.height;
		}
		if(!hit)return;
		$.remove(indicator_mask_instance);
		tar.fire('click'); //click through
		if(onclick) onclick.call(this,data);
	}
	window.indicator_mask_instance = 
	$article([
		dom = $section() // draw highlight
			.bind('click',click)//set click event
			.css({borderWidth:bw+'px',transform:`translate(${-bw+'px'},${-bw+'px'})`}),//set pos
		tip = $div([
			$p(tips||'') //draw tips
		]).addClass('tips')
	],document.body).attr({class:'indicator-mask'});
	setTimeout(()=>{//set highlight position
		if(isInput) {
			tar.onEnterKey((e)=>{
				$.remove(indicator_mask_instance);
				if(onclick) onclick.call(this,data);
			}).select();//auto focus
		}	
		dom.css(tips&&tips.length?{
			transform:`translate(${parseInt(-bw+r.left-margin)+'px'},${parseInt(-bw+r.top-margin)+'px'})`,
			width:parseInt(r.width+2*margin)+'px',
			height:parseInt(r.height+2*margin)+'px'}:{display:"none"})
	},100)
	setTimeout(()=>{//set tips position
		var sideH = r.left+r.width/2<sw/2?-1:1,
			sideV = r.top+r.height/2<sh/2?-1:1,
			tr = tip.rect();
		tip.css({
			left:parseInt(sideH<0?r.left-margin:r.left+r.width-tr.width+margin)+'px',
			top :parseInt(sideV<0?r.top+r.height+margin+16:r.top-tr.height-margin-16)+'px',
		})
	},500)
	return [dom,tip];
}
$indicate.remove = function(e){
	$(".indicator-mask").remove();
	$.remove(window.indicator_mask_instance);
};

/**
 * @param opts.pageStyle : outer[default] | inner
 * @param opts.height : image height
 */
var $slider = function(items, opts, tar){
	var v_slider, v_cover, v_images, v_pages,
		s_count    = items.length,
		start_left   = 0,  
		current_left = 0,
		image_w, 
		slider_w,
		can_slide =false, start_x=0, start_y=0; offset_x=0, offset_y=0, direction="";

	let i = 0, j = 0;

	if(tar){
		$.remove(tar.find1st(".ui-slider"));
	}


	v_slider = $div([
		v_images = $ul(
			items.map(o=>$li({i:i++,linkto:o.linkto||false},[
				$img({src:$.isString(o)?o:o.url}).css({'object-fit':opts.fit||'contain', 'width':"100%", "height":opts.height||"auto", opacity:0})
			])
			.css({backgroundImage:`url(${$.isString(o)?o:o.url})`,padding:0})
			.bind('click',function(e){
				if(this.linkto){
					$a({href:this.linkto,target:"_blank"},document.body).hide().fire("click").remove();
				}
			}))
		).addClass('images').css('width',s_count*100+'%'),
		v_pages = $nav(
			items.length<=1?[]:
			items.map(o=>$span({class:j==0?'on':'',seq:j++}).bind('click',function(e){
				e.stopPropagation();
				slide_to(this.seq);
			}))
		).addClass("pages")
	],tar)
	.attr(opts||{})
	.addClass('ui-slider')
	.onloaded(function(){
		image_w = v_images.childNodes[0].rect().width || tar.rect().width;
		slider_w = s_count * image_w;
	})
    .bind("touchstart", function(e){
		if(!e.changedTouches)return;
		// v_images.removeClass("sliding");
        start_x = e.changedTouches[0].pageX;//e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
        start_y = e.changedTouches[0].pageY;
        can_slide = undefined;
        offset_x = 0;
        offset_y = 0;
		start_left = current_left;
	})
	.bind("touchmove", function(e){
		if(!e.changedTouches)return;
        var pageX = e.changedTouches[0].pageX;//e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
        var pageY = e.changedTouches[0].pageY;//e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
        offset_x  = pageX - start_x;
        offset_y  = pageY - start_y;
        can_slide = can_slide==undefined&&Math.abs(offset_x)>Math.abs(offset_y);
        if(!can_slide) return;
        direction =  offset_x > 0 ? "from_left":"from_right";
        // max offset
        var factor = offset_x>0 ? 1 : -1;
        if(Math.abs(offset_x) > image_w) offset_x = image_w/2*factor;
        // left
		var left = start_left + offset_x;
        if(left > 0 ) {
            left = 0;
        } else if (left < -1*slider_w) {
            left = -1*slider_w;
		}
		// v_cover.style.marginLeft=left+"px";
		v_images.style.marginLeft=left+"px";
		current_left = left;
        if(Math.abs(offset_x)>Math.abs(offset_y))
        	e.preventDefault();
	})
	.bind("touchend", function(e){
		if(offset_x==0) return;
		offset_x = 0;
		image_w = v_cover.rect().width;
        var idx = Math.floor(Math.abs(current_left)/image_w);
        if(direction == "from_right") idx++; // fixed
        if(idx<0) idx=0;
		if(idx>s_count-1)idx=s_count-1;
        slide_to(idx);
	});

	v_cover = v_images.firstChild;

	if(opts.pageStyle) v_slider.addClass(opts.pageStyle);
	if(opts.height) v_images.css({height:opts.height});

    function slide_to(idx) {
        select_idx = idx;
        image_w = v_cover.rect().width;
		v_images.style.marginLeft=-1*idx*image_w+"px";
		current_left = -1*idx*image_w;
		v_pages.childNodes.removeClass("on");
        if(v_pages.childNodes[idx]) v_pages.childNodes[idx].addClass("on");
	}
	
	return v_slider;
}

/**
 * form input component
 * features
 * 	- auto update timer
 *  - send msg to $this / delegate
 *  - enter key event for single line input
 *  - multiline : input or textarea(div[editable=true])
 * @param {*} attrs 
	- type : all HTML5 type, textarea
	- name : 
	- multiline : div.contenteditable=true
	
 * @param {*} tar 
 */
const $ipt = (attrs, tar)=>{
	let {name, type, event, multiline, delay, delegate} = attrs;
	if(empty(name)) return elog("ERR:red", "$ipt need name parameter. {name:'my_form_item_name'}");
	// delegate = delegate || window.$this;
	let last, timer;
	let oninput = (e)=>{
		clearTimeout(timer)
		$.send(delegate||$this, 'form-changing', name, multiline && type!='textarea' ?ipt.textContent : ipt.value, ipt);
		timer = setTimeout(()=>{
			if(fn=='input' && ipt.value.endsWith("\n"))
				ipt.value = ipt.value.replace(/.$/,'')
			ipt.attr("count", ipt.value.length).css('--count',ipt.value.length);
			if(last === ipt.value) 
				$.send(delegate||$this, event||'form-change', name, multiline && type!='textarea' ?ipt.textContent : ipt.value, ipt);
			else
				oninput(last = ipt.value)
		}, delay||1000)
	}
	let fn = type=='textarea' ? 'textarea' : multiline ? 'div' : 'input';
	let ev = multiline ? '@keyup' : '@input';
	let kn = name.split(".")[0];
	let asn = name.includes(".") ? name.replace(/^[^\.]+\./,'') : false;
	let opts = {...attrs, class:'ipt', [`var--${kn}`]:'value', [ev]:oninput, '@update':oninput};
	if(type!='textarea' && multiline) opts.contenteditable = true;
	if(type=='textarea' && attrs.rows) opts.rows = attrs.rows;
	let ipt = $e(fn, opts, tar);
	if(asn) ipt.setAttribute('v--keypath', asn);
	return ipt;
}

/**
 * v2 selection/checkbox/radio/pulldown function
 * TODO : udpate value from outside 
 * @param {*} attrs 
	 - name{*} : form item name
	 - type{*} : item type checkbox/radio/pulldown/tabmenu/switch
	 - multiple : permit multiple choice
	 - event : event name to send to delegate(default is $this), default event = "form-change"
	 - value : default value in Enter split format or Array
	 - placeHolder : for pulldown only
	 - editable : for pulldown only
	 - layout : checkbox/radio vertical|horizontal, default is horizontal
	 - outline : checkbox/radio true/false, whether to show selection items outline, default:false
	 - delegate : delegate object, default=$this
	 - items : array of item, give the option list at the begining
 * @param {*} tar 
 * @NOTICE : 
 * 	you have to set "$this.${name}_options" to specify options
 * 	you have to set "$this.${name}" to change values (TODO)
 * @example
 * 	$pick({type:'radio', name:'gender'});
 * 	$this.gender_options = [{label:'Male', value:'male'}, {label:'Female', value:'female'}] 
 *  
 */
const $pick = (attrs, tar)=>{
	let {name, type, event, multiple, value, placeHolder, editable, layout, outline, delegate, emp=true} = attrs;
	if(!name && !type) return elog('ERR:red',"$pick needs to specify {name} & {type}, name is the variable name, and type has to be 1 of ") && false;
	multiple = attrs.multiple || ['checkbox'].includes(type);
	event 	 = event || 'form-change';//`pick-${name}`;
	// delegate = delegate || window.$this;
	let values = $.isString(value) && !empty(value) ? ( value.split("\n").filter(e=>e.trim().length) || [] ) : 
				 $.isArray(value) ? value : [];
	
	let is_cjk = false;
	let dragging = false, dragover = true;		
	let tmpl = false; 
	let pick = (e)=>{
		// elog("pick:pink");
		e.stopPropagation();
		let target = e.target;
		target = target.tagName=='DD' ? target : target.parentNode;
		let v = target.attr('value'), label = target.textContent;
		values = multiple ? 
				( values.includes(v) ? values.filter(vv=>vv!=v) : [...values, v] ) : 
				( values.includes(v)&&emp ? [] : [v] ); 
		// elog("PICK-CLICK:orange", v, values);
		if(!multiple) target.parentElement.find("dd").removeClass("on");
		if(values.includes(v)) {
			if(type!='pulldown') target.addClass('on');
			dt.attr({html:label, value:v, class:'on'});
		}else {
			target.removeClass('on');
			dt.attr({html:placeHolder||'', class:'off'});
		}
		$.send(delegate||$this, event, name, values, dl, e);
	};

	let keydown = (e)=>{
		is_cjk = e.keyCode==229;
		if(e.key === 'Enter')　e.preventDefault();
	}
	let keyup = (e)=>{
		let {target} = e;
		// elog("UP", e.keyCode)
		e.stopPropagation()
		if(e.key === 'Enter'){
			e.preventDefault();
			if(is_cjk) return;
			target.textContent = target.textContent.replace(/\s+/,'');
			if(!empty(target.textContent) && !values.includes(target.textContent)){
				values.push(target.textContent);
				delegate = delegate||$this;
				delegate[`${name}_options`] = [...delegate[`${name}_options`], {label:target.textContent, value:target.textContent, custom:1}];
				$.send(delegate, event, name, values, dl);
			}
			target.blur();
		}else{
			if(empty(target.value)) target.removeClass("on")
		}

	};
	let remove = (e)=>{
		e.stopPropagation();
		let value = e.target.attr('value');
		delegate = delegate||$this
		let nopts = delegate[`${name}_options`].filter(vv=>vv.value!=value);
		delegate[`${name}_options`] = nopts;
		if(delegate.vars) $.set(delegate.vars, name+"_options", nopts);
		values = delegate[`${name}_options`].map(n=>n.value);
		elog("nv:red", value, JSON.stringify(nopts), JSON.stringify(values), JSON.stringify(delegate[`${name}_options`]));
		$.send(delegate, event, name+"_options", delegate[`${name}_options`], dl);//to solve the problem of keyname contains "."
		$.send(delegate, event, name, values, dl);
		
	}
	let ondragstart = (e)=>{
		dragging = e.target;
	};
	let ondragover = (e)=>{
		e.preventDefault();
		dragover = e.target;
		if(dragover.tagName!='DD') dragover=dragover.parentNode;
		dragover.setAttribute("drag-over", true);
		setTimeout(()=>{
			if(dragover) dragover.removeAttribute("drag-over");
		}, 100)
	};
	let ondrop = (e)=>{
		// elog("drop",dragging,dragover);
		if(!dragover || !dragging) return;
		let i1 = dragging.attr("i")||0;
		let i2 = dragover.attr("i")||0;
		delegate = delegate||$this
		let opts = delegate[`${name}_options`];
		let m = opts[i1];
		opts[i1] = opts[i2];
		opts[i2] = m;
		delegate[`${name}_options`] = opts;
		dragover=dragging=false;
		values = delegate[`${name}_options`].map(n=>n.value);
		$.send(delegate, event, name, values, dl);
	};
	let load = ({target, data})=>{
		// elog("ONLOAD")
		if(target.tagName=='DL' && target.attr("value"))
			return values = (target.attr("value")||"").split("\n").filter(v=>!empty(v))
		if(type=='pulldown') {//set default value
			// elog("LOADED", data);
			let count = Math.max(parseInt(dt.attr("count")||0), data.label.length);
			dt.attr({html:values?values[0]:'', class:empty(values)?'off':'on', count:count}).css('--count',count);
			dt.find("dd",(dd)=>{dd.attr("count", count).css('--count',count)})
		}else if(type=='switch'){
			// elog("ONLOAD:green",target, target.find1st("input"), target.parentNode.find1st("input"))
			let ev = new CustomEvent('update', {detail : {key:name.split(".")[0], data:data, target:target}});
			target.parentNode.dispatchEvent(ev)
		}else{
			if(target.tagName=="DL"){//$pick under loop
				setTimeout(()=>update({detail : {key:name.split(".")[0], data:data, target:target}}), 200);
			}else{
				if(empty(values) && delegate){
					values = $.at(delegate, name) || [];
				}
				let v = target.data('value');
				if(values.includes(v)) target.addClass("on");
			}
		}
	};
	let update = (e)=>{
		let {key, data, target} = e.detail;
		let tk = key.split(".")[0]//key.replace(/^[^\.]+./,'');
		if(name.includes(tk+".") && key!=tk && name!=key) return;
		let kn = name==key ? key : name.replace(key+".", "");
		let da = name==key ? data : data[kn];
		// elog("VALUE:red", key, data, attrs.name, e.target, kn, da);
		if(type=='switch'){
			if(da) {
				target.addClass("on");
				target.find1st('input').checked = true;
			} else {
				target.removeClass("on");
				target.find1st('input').checked = false;
			}
		}else if($.isArray(da)){
			// elog("VALUEss:red", kn, da, tmpl);
			values = da;
			// elog("VALUEs:red", kn, da, tmpl, document.body.find(`dd[tmpl--id="${tmpl}"]`), e.target.childNodes);
			target.find(`dd[tmpl--id="${tmpl}"]`,(el)=>{
				elog("el", el, el.attr("value"));
				if(values.includes(el.attr("value")))
					el.addClass("on");
				else
					el.removeClass("on");
			})
		}else if($.isString(da) || $.isNumber(da)){
			target.find(`dd`,(el)=>{
				// elog("VALUE:purple", da);
				if(da == el.attr("value"))
					el.addClass("on");
				else
					el.removeClass("on");
			})
		}
	}

	let dt , domOpts = {...attrs, '@update': update, '@loaded':load, class:`pick ${type}`, parse:true};
	if($.isString(values[0]) && values[0].match(/^\{\{.+\}\}$/)) domOpts.value = value;//its variable
	else if(type=='switch') domOpts.value = `{{${name.split(".")[0]}}}`;
	else domOpts['var'] = {[name]:'value'};
	let dl = $dl(domOpts,[
		dt = $dt({name:`${name}`, type:type, html:'', placeHolder:placeHolder||'', contenteditable:editable, "@keydown":keydown, "@keyup":keyup}),
		type=='pulldown'? 
			$dl({class:"pulldown-container",'var':{[name]:'value'},'@drop':ondrop,'@update':update,editable:editable},[
				$dd({loop:`{{${name}_options}}`, name:`${name}`, type:type, i:"{{i}}", draggable:true, value:"{{e.value}}", custom:"{{e.custom}}", "@click":pick, '@loaded':load, '@dragstart':ondragstart, '@dragover':ondragover},[
					$b({class:'ico knob'}),
					$label({html:"{{e.label}}", value:"{{e.value}}"}),
					$b({class:'ico delete', value:"{{e.value}}", '@click':remove})
				])
			]) : 
		type=='switch'?
			$dd({'@loaded':load,'@update':load},[
				$label([
					$input({type:'checkbox', name:name}), 
					$span({class:'slider'})
				])
			 ]) : 
			$dd({loop:`{{${name}_options}}`, name:`${name}`, type:type, html:"{{e.label}}", value:"{{e.value}}", "@click":pick, '@loaded':load})
	],tar).addClass(`pick ${type} ${layout||'horizontal'} ${outline?'outline':''}`);
	tmpl = dl.attr("tmpl");
	if(attrs.items){
		let tmplEl = dl.find1st("template");
		if(tmplEl){
			let lv = tmplEl.attr('loop--var');
			if(lv){
				let html = tmplEl.outerHTML.split("><")[0].replace(/loop\-\-var\s*=\s*"/,'loop--var="__runtime.')+">"+([...tmplEl.children].map(d=>d.outerHTML).join("\n"))+"</template>";
				dl.append(...$.render(html, {[lv]:attrs.items}, {pref:'__runtime', children:tmplEl.children}))
			}
		}
	}
	return dl;
}

/**
 * image uploader/viewer for forms ...
 * 
 * @param {*} attrs 
	- name [*] : form item name , required
	- editable : permit to add or edit or change sequence
	- multiple : multiple file selection
	- fit : cover|contain, default=cover, equavalent to background-size 
	- event : custom event name be sent to $this, default = 'form-change'
	- imageKey : if data is array of object, specify image data key name
	- titleKey : if data is array of object, specify title data key name, also it will show title under images
	- types : custom available image ext names, @example: ['jpg', 'png', 'jpeg']
 * @param {*} tar 
 */
const $images = (attrs, tar)=>{
	let {name, editable, imageKey, titleKey, event, types, multiple:multi, fit, delegate} = attrs;
	delegate = delegate || window.$this;
	if(empty(name)) return elog("ERR:red", "$images need name parameter. {name:'my_form_item_name'}")
	if(empty(name)) return elog("ERR:red", "$images need name parameter. {name:'my_form_item_name'}")
	types = (types || ['jpg','jpeg','png','apng','gif','webp','pjpeg','pjp','jfif']).map(t=>`image/${t}`).join(",");
	fit = fit || 'cover';
	let values = [], panel;
	let dragging, dragover
	let add = (e)=>{
		e.stopPropagation();
		e.preventDefault();
		$.uploadWindow((fs)=>{
			//fs[i]= {file:FileObject, height: 200, size: 3010, src: "BASE64", type: "image/png", width: 200}
			delegate = delegate||$this
			let es = delegate[name] || [];
			let ns = fs.map(f=>{return imageKey? {...f, [imageKey]:f.src} :f.src});
			delegate[name] = [...es, ...ns];
			$.send(delegate, 'form-change', name, {action:'add', files:fs});
		},multi,types,true);
	}

	//show popup
	let show_image = (e)=>{
		// elog("CLICK")
		e.stopPropagation();
		$pop([
			$img({src:e.target.src})
		])
	}
	
	let remove = (e)=>{
		e.stopPropagation();
		let r = confirm('Do you want to remove this item?');
		if(r){
			let src = e.target.parentNode.find1st("img").src;
			delegate = delegate||$this
			delegate[name] = delegate[name].filter(v=>($.isString(v)&&v!=src) || ($.isObject(v)&&imageKey&&v[imageKey]!=src) );
		}
	}

	let dragcell = (e)=>{
		dragging = e.target;
		if(dragging.tagName!='FIGURE') dragging=dragging.parentNode;
	}

	let ondragover = (e)=>{
		e.preventDefault();
		if(e.target.hasClass('images-panel')){

		}else{
			e.stopPropagation();
			dragover = e.target;
			if(dragover.tagName!='FIGURE') dragover=dragover.parentNode;
		}
	}

	let dropcell = (e)=>{
		if(!dragover || !dragging) return;
		let i1 = dragging.attr("i");
		let i2 = dragover.attr("i");
		delegate = delegate||$this
		let opts = delegate[`${name}`];
		// elog("drop", name, opts)
		let m = opts[i1];
		opts[i1] = opts[i2];
		opts[i2] = m;
		delegate[`${name}`] = opts;
		dragover=dragging=false;
		$.send(delegate, event, name, values, panel);
	};

	let droppanel = (e)=>{

	}

	panel = $div({class:'images-panel', "@dragover":ondragover, "@drop":droppanel, draggable:false},[
		$figure({class:'image', loop:`{{${name}}}`, i:"{{i}}", '@dragstart':dragcell, '@dragover':ondragover, '@drop':dropcell, draggable:editable},[
			$img({src:`{{${imageKey?"e."+imageKey:'e'}}}`, "fit-style":fit, '@click':show_image}),
			$figcaption({html:titleKey?`{{e.${titleKey}}}`:''}),
			$i({class:'ico trash', '@click':remove})
		]),
		$button({class:'add', if:()=>editable, "@click":add, html:'Add new'})
	],tar);
	
	return panel;
}

const $hbox = (attrs, children, tar)=>{
	return $div(attrs||{}, children||[], tar).addClass('hbox')//.css({display:'flex',flexDirection:'row'});
}

const $vbox = (attrs, children, tar)=>{
	return $div(attrs||{}, children||[], tar).addClass('vbox')//.css({display:'flex',flexDirection:'column'});
}
