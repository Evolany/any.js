any.js
=======


A pure javascript web framework

# Goals
* Liberated the server from view rendering.
* Save your much time from making pages UI.
* Make the view transition under controll by independent logic
* Provide better UX by reducing the delay on screen transition.

# Main features
* Written in pure JS
* Message driven architecture, all view controllers only need to implement required delegate methods .
* Libraries can be included automatically.
* Render HTML with js functions named as same as HTML Tags, with nested layout support.
* Various utils, such as http, sockets, storage ...
* Various UI Components, such as List, Form, Spreadsheets, Auto complete...
* Reusable DomElement
* History control.
* Works on IE8+ , Webkit(Chrome, Safari, Opera), Firefox.

# About The Framework

* [Installation Guide](#installation-guide)


----

* [One Minute Guide](#one-minute-guide)
* [Five Minutes Guide](#five-minutes-guide)

----

* [Architecture](#architecture)
* [View Controllers & Delegate](#view-controllers--delegate)
* [Selectors](#selectors)
* [Draw HTML Tags](#draw-html-tags)
* [Animations](#animations)
* [HTTP Request](#http-request)
* [Socket Request](#socket-request)
* [Garbage Collection](#garbage-collection)
* [History](#history)
* [Source Code Compression](#source-code-compression)


----

* [Class Reference](#class-reference)



## Installation Guide

* download or checkout all js files from here 

* put them in your WEBROOT/JS_DIR


----

## One Minute Guide
After the [Installation Guide](#installation-guide).

1) In your HTML.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
  <title>Test page of any.js</title>
  <script src="YOUR_JS_PATH/any.js"></script>
  <script src="YOUR_JS_PATH/views.js"></script>     
</head>
<body>
</body>
</html>

```

2) In your views.js

```javascript

var my_view = {
    name : "my_view",
    drawContent : function(wrapper, layer){ //implement the delegate method
        $table([
            $tr([
                $th("ColHeader1"),
                $th("ColHeader2"),
                $th("ColHeader3")
            ]),
            $tr([
                $td("ColValue1"),
                $td("ColValue2"),
                $td("ColValue3")
            ]),
        ], document.body);
    }
};

window.onload = function(){
  $app.start("my_view");
}

```

3) Check the result on your browser


----


## Five Minutes Guide
* Read [#OneMinuteGuide this] first.
* To create common header
```Javascript
$app.drawHeader = function(header){
    //draw a H1 tag with innerHTML of 'MY WEB SERVICE', and append to header
    //all pages will be affected by this setting
    $h1("MY WEB SERVICE", header);
}
```

* To create common footer
```Javascript
$app.drawFooter : function(footer){
    //draw an <A> tag with href='the url',and innerHTML of 'Copyright' and append to footer
    //all pages will be affected by this setting
    $a({html:"Copyright",href:'https://my-great-company.com'}, footer);
};
```

* To customize header of the current view
```Javascript
var my_view = {
    name : "my_view",
    drawHeader : function(header){
        //draw a H1 tag with innerHTML of 'MY VIEW', and append to header
        $h1("MY VIEW", header);
    },
    drawContent : function(wrapper, layer){ //implement the delegate method
        //...
    }
};
```

* To customize footer of the current view
```Javascript
var my_view = {
    name : "my_view",
    drawHeader : function(header){
        //...
    },
    drawContent : function(wrapper, layer){ //implement the delegate method
        //...
    },
    drawFooter : function(footer){
        //draw an <A> tag with href='the url',and innerHTML of 'Copyright' and append to footer
        $a({html:"Copyright",href:'https://my-great-company.com'}, footer);
    },
};
```

* What's next?
    Read from [#Architecture Architecture] please.

----


## Architecture ##
| File | Module | Description |
| --- | --- | --- |
| any.js | | Core modules & functions |
| | Element.prototype | Let normal DOMElement works like jQuery, which can '''bind''', '''css''', '''attr''', '''animate'''  themselves [[BR]] without create new big objects into the memory like jQuery/ExtJS/dojo does  ... |
| | Date.prototype | |
| | String.prototype | |
| | $app.* | The application (singleton) |
| | $http.* | Ajax tool kits |
| | $.* | common utilities |
| any.ui.js | | Extensions like FormView, ListView, Calendar ... |
| any.net.js | | Core modules & functions |
| | SocketKits($socket.*) | Web socket tool kits (TODO) |
| any.oauth.js | | common Oauth Library |
| any.db.js | | Local Storage Database Library |


## Draw HTML Tags

### Normal Tags

```Javascript
/**
 * @param OPTIONS : 
 *      can be String, Object, Array 
 *      String : be trait as src for <img> and innerHTML of the other tags
 *      Object : attribuites of this tag
 *          - any official attribute.
 *          - any custom key name.
 *          - "html" = shortcut of innerHTML
 *          - "class" = shortcut of className
 *      Array : an array of children nodes.
 * @param TARGET : [optional], target Dom Element to append to 
 * @return : A DOM Element Object (with extension methods)
 *      
 */
TAG_NAME_UPPERCASE(OPTIONS, TARGET);//uppercased tagname
//OR
$TAG_NAME_LOWERCASE(OPTIONS, TARGET);//lowercased tagname with a prefix of $
//OR
$e(TAGNAME, OPTIONS, TARGET);//TAGNAME can be upper or lower case, and you can combine with ID or class name, such as li.classname, ul#myId
```

 * Most of the html tags can be written with the same name js functions
 * table,tr,th,td,div,img,ul,lo,li,p,a,b,strong,textarea,br,hr,form,input,span,label,h1,h2,h3...
 * The following shortcut functions are not predefined, to use them, please use $e function instead.
```
html,script,link,iframe,head,body,meta,
(Deprecated) : acronym,applet,basefont,big,center,dir,font,frame,frameset,noframes,strike,tt
(uncommon) : dialog,bdi,command,track
(Others) : noscript,del,blockquote,ins
```

### Attribuites

#### Set attributes
* .attr(key, value);
```javascript
//Syntax 
/**
 * @param key : key name String or Object
 * @param value : value
 * @return : this Element Object.
 */
Element.attr(key, value);

//Example
var el = $div({html:'My DIV', class:'my-div-cls'});
el.attr('data-id',1234).attr({'data-key':'myKey','data-value':'myVal'});//.attr method returns Element Object.
document.body.appendChild(el) // can be used as same as Element Object

//these code are exactly same with 
var el = $div({html:'My DIV', class:'my-div-cls',
    'data-id':1234,'data-key':'myKey','data-value':'myVal'}, document.body);

```

#### Get attributes
* .attr(key);
```javascript
//Syntax 
/**
 * @param key : [String] key name String
 * @return : value [Mixed]
 */
Element.attr(key);

//Example
var el = $div({html:'My DIV', 'data-id':'myId'});
var id = el.attr('data-id'); // id='myId'
```

### Styles
#### Set Styles
* .css(key, value)
```javascript
//Syntax 
/**
 * @param key : key name String or Object
 * @param value : value
 * @return : this Element Object.
 */
Element.css(key, value);

//Example
$div('my div').css({color:'red',fontSize:'11pt'});
```

#### Get Style
* .css(key)
```javascript
//Syntax 
/**
 * @param key : style key name
 * @return : this Element Object.
 */
Element.css(key);

//Example
var cl = $div('my div').css('color'); //cl='red'
```

### Bind Events handlers
* .bind(eventname, func)
```javascript
//Syntax 
/**
 * @param eventname : JS event name
 * @param func : JS Function instance
 * @return : this Element Object.
 */
Element.bind(eventname,func);

//Example
var cl = $div('my div')
    .attr({class:'my-class-name'})
    .bind('click',function(e){
        console.log('Clicked : '+this.innerHTML);
    })
    .bind('doubleclick',function(e){
        console.log('DoubleClicked : '+this.innerHTML);
    })
```


* Example : Draw single Element.

```javascript

//These are basically same.
$div() === DIV() 

//Create a link with href=http://google.com and append to #myDiv
$a("http://google.com/", $id("myDiv"));

//Draw img tag with src=...
$img("http://google.com/images/xxxx.png");

//Create a <label> with innerHTML=Hey!..... and set color=red, id=myLabel
$label("Hey! How are you doing.")
    .css({"color":"red"})
    .attr({id:"myLabel"}); 

//create a element like this: <div id="myDiv">the content of this div</div>
$div({id:"myDiv", html:"the content of this div"}); 

```

* Example : Draw Nested Elements

```javascript
$table([
    $tr([
        $th("ColHeader1"),
        $th("ColHeader2"),
        $th("ColHeader3")
    ]),
    $tr([
        $td("ColValue1"),
        $td("ColValue2"),
        $td("ColValue3")
    ]),
], document.body);

```

Result
| ColHeader1 | ColHeader2 | ColHeadler3 |
| --- | --- | --- |
| ColValue1 | ColValue2 | ColValue3 |


### Special Form Tags

#### checkbox / radiobox
* $sel(options, attrs, target)
```Javascript
/**
 * checkbox / radiobox
 * 
 * @param options : Array, 
 *      [{label:"label1",value:"value1"},{label:"label2",value:"value2"}}...]
 * @param attrs : {
 * 		name : [required] name of form item
 * 		type : [required] checkbox|radio .
 * 		drawOption : function(el, i, attrs ){} //custom drawing,
 * 			             // el=<label>-<input> element, i=index, 
 * 		onclick : function(){},... //other events are also supported
 * }
 * @param target : which dom to append to
 * @return : Element
 * */
$sel(options,attrs,target);

//Example
$sel(
    [{label:'Male',value:'male'},{label:'Female',value:'female'}],
    {name:'gender',type:'radio'},
    document.body
)
```

### Dropdown

```Javascript
/**
 * @param opts: array of list items, @see $sel
 * @param attrs: Element attrs
 * 		.multiple: multiple selection
 * 		.default : default value
 * 		.value : value
 * 		.onSelect: function (e, i)
 * @method setLabel(label) : set txt inside selectbox
 */
$dropdown(opts,attrs,tar)
```



## View Controllers & Delegate

### View & Layers
Each VIEW possesses a `layer`, which is an HTML5 \<ARTICLE\> tag contains

```HTML
<article class='new ${VIEW_NAME}' view='${VIEW_NAME}'> 
    <header>
        <!-- view header -->
    </header>

    <main>
        <!-- view content -->
    </main>
    <footer>
        <!-- view footer -->
    </footer>
</article>
```
Once a view's layer be presented, the other views will go to backward and be unvisible.<BR>
	
![Layers](https://s3-ap-northeast-1.amazonaws.com/evolany/frameworks/layers.png)

### Structure & delegate methods
```Javascript
var my_view = {
    name : 'my_view', //[Required], as same as the variable
    noHeader : false, //[Optional], whether to draw header
    noFooter : false, //[Optional], whether to draw footer
    
    /**
     * [Optional] a delegate method to initial page or load data from remote API
     * @param p : parameter object from parent view
     */
    onLoad : function(p){
        
        /** YOUR CODE **/

        //you have to call this method manually after initialized.
        //$this means current view = window.my_view
        $this.loaded(); 
    },

    /**
     * [Optional] a delegate method to draw page header
     * @param h : a <header> DOMElement instance
     */
    drawHeader : function(h){
        $h1('My Title', h);//exmaple : draw page title
    },

    /**
     * [Required] a delegate method to draw page body
     * @param w : 
     *  a <main> DOMElement instance, which represents the body of this view.
     * @param l : 
     *  a <article> DOMElement instance, which represents the whole layer of this view.
     */
    drawContent : function(w, l){
        $p('My body contents', w);//exmaple : draw page contents.
    },
    
    /**
     * [Optional] a delegate method to draw page footer
     * @param f : a <footer> DOMElement instance
     */
    drawFooter : function(f){},

    /**
     * [Optional] a delegate method to response event-driven messages from the framework or the other views.
     * you can update contents, redraw view parts after receiving the indications.
     * @param m : a string contains msg type, can be customized as you wish
     * @param o : a object contains data with this message
     */
    onMessage : function(m, o){},

    /**
     * [Optional] a delegate method which is triggered when a view comes to front.
     * you can do jobs like reset data, redraw part of the view...
     */
    onActive : function(){},

    /**
     * [Optional] a delegate method which is triggered when a view comes backward.
     * you can do jobs like close connections ...
     */
    onInactive : function(){},


    /**
     * [Optional] a delegate method which is triggered when a view is closing
     */
    onClose : function(){}

}
```

### View Transition
To show a view. or transit to another view you can just call

```javascript
  // this will be changed in the future.
  $app.openView("YOUR_VIEW_NAME"); 
  
  // or 
  $div({url:"YOUR_VIEW_NAME?param1=b&param2=b"});

```

### Open a Subview
```Javascript
  $app.openSubview("YOUR_VIEW_NAME",{id:'my-data-id'});

  //NOTICE : in a subview, $this represents the parent view
  //To access properties or methods of current view, use my_view.propertyName instead.
```

### `$this` keyword

* In case of a view  : $this represents current view
* In case of a subview  : $this represents parent view


## Selectors
* $(query, thisLayer) selector : XPath selector, similar with jQuery selector. but you can specify if select from all layer or just current one. and the return value is Element but not jQuery Object
```javascript
$("#id"); //return Element 
$(".className"); //return Element list
$("#myId .className", function(el, idx){ ... }); //do foreach on selected elements;
$id("my-id") //= document.getElementById("my-id")
```

## HTTP Request
* .get : $http.get(URL,PARAMS, CALLBACK, FORMAT)
```javascript
$http.get("/api/test", {page:1}, function(res){console.log(res)}, "json");
```

* .post : $http.get(URL,PARAMS, CALLBACK, FORMAT)
```javascript
$http.get("/api/test", {user:U, pass:P}, function(res){console.log(res)}, "html");
```

* .put : $http.get(URL,PARAMS, CALLBACK, FORMAT)
    send request with method = PUT
```javascript
$http.put("/api/test/1", {pass:P}, function(res){console.log(res)}, "text");
```

* .del : $http.get(URL,PARAMS, CALLBACK, FORMAT)
    send request with method = DELETE
```javascript
$http.put("/api/test/1", {}, function(res){console.log(res)}, "json");
```


## Socket Request
```javascript
Coming soon ...
```

## Garbage Collection
TODO : remove inactive layers


----

# UI Toolkiks

## ListView
```javascript
/**
 * @param {object} opt : @see ListView Options
 * @param {element} target : [requied] the Dom Element to draw list view.
 * @param {element} pageTarget : [requied] the Dom Element to insert pagination elements.
 * @return {ListView} a ListView instance
 */
$list_view(opt, target, pageTarget);
```

### ListView Options

| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| opt.url | string | YES* | |  the api url |
| opt.items | array | NO* | | instead of using url, you can specify the item listdirectly | 
| opt.perpage | int | | | how many items to display in one page |
| opt.query | object | | | API query conditions |
| opt.fields | array | YES | | columns to show for each item. |
| opt.tags | array | | ['table','tr','th','td'] | HTML tags |
| opt.append | bool | | false | whether the items of the nextpage should append to the end of this one. |
| opt.renderHTML | bool | | true | if its false, then ListViewwon't draw tr-td before it calls drawItem delegate function. |
| opt.pageType | navi<br>number<br>none | | number | navi=prev/next<br>number=1...N<br> none=no page btns |
| opt.pageLabels | array | | ["<previous", "next >"] | for pageType=navi only |
| opt.pageSize | int | | 13 | an odd number, page button numbers 1...N | 
| opt.sortKey | string | | | sort key param for API call |
| opt.sortOrder | asc<br>desc | | | sort order param for API call |
| opt.delegate | object<br>ViewController | | | delegate which responses to these delegate methods |


### ListView Delegate methods

`opt.` can be replaced with a `delegate.` object.

#### opt.drawItem 
```Javascript
/**
 * custom item rendering
 * @param rowElement : HTML Element of <TR>
 * @param item : 1 object data of API response.data[N]/items[N]
 * @param i : row index
 */
opt.drawItem = delegate.drawListItem = function(rowElement, item, i){}
```
#### opt.onLoading 
```Javascript
/**
 * show loading indicator
 * @param params : this.query, also you can modify it here
 * @return 
 */
opt.onLoading = delegate.onListLoading = function(params){}
```
#### opt.onLoaded 
```Javascript
/**
 * fired when ajax load successed, you can modify the response by amending `res`
 */
opt.onLoaded = delegate.onListLoaded =function(res){}, 
```
#### opt.onError 
```Javascript
//fires when ajax error occurs
opt.onError = delegate.onListError =function(){}
```
#### opt.onEmpty 
```Javascript
//fires when data from server is empty, you can show some empty msg in this method
opt.onEmpty = delegate.onListEmpty =function(){}
```
#### opt.onLastPage 
```Javascript
//fires when its the last page. you can show some special operations in this method
opt.onLastPage = delegate.onListLastPage =function(){}
```
#### opt.onSelect 
```Javascript
//fires when a single row is selected.
opt.onSelect = delegate.onListSelect =function(){}
```
#### opt.onChecked
```Javascript
//fires when a single row's checkbox is checked
opt.onChecked = delegate.onListChecked = function(){}
```


### ListView API Response data format
the response data must be sth like this
```Json
{
  total:1221,
  data:[
    {id:1, name:"data name 1", ...},
    {id:2, name:"data name 2", ...},
  ...]
}
```
* there is no restrictions for field names inside res.data[i]

### ListView `fields` settings 
| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| name | string | YES | | property name inside res.data[i] |
| title | string | | .name | title label of this column |
| sortable | bool | | false | true:user can sort this column |
| wrapper | function | | | a wrapper function to customize the drawing this column, for example : convert timestamp to datetime |

### ListView methods

#### ListView.update
```Javascript
/**
 * draw/redraw the list view with API query/items settings
 * @param query : a query object
 */
function update(query)
```
#### ListView.dom
```Javascript
/**
 * @return the table element
 */
function dom() 
```
#### ListView.cursor
```Javascript
/**
 * @return current start/end idx
 */
function cursor() 
```
#### ListView.data
```Javascript
/**
 * @return table data list (got from api server)
 */
function data() 
```
#### ListView.data(N)
```Javascript
/**
 * @return the Nth data of the tale (got from api server)
 */
function data(N) 
```
#### ListView.checked
```Javascript
/**
 * @return all checked item's value list (list_item_checkbox isrequired)
 */
function checked() 
```

### Exmaples of ListView

#### Init a list view with wrappers
```Javascript

/**
 * ListView Wrapper Example, change Linux timestamp to YYYY-MM-DD string.
 * @param el : the cell Element <TD>
 * @param v : value 
 * @param k : key name
 */
var time_wrapper = function(el,v,k){
    if(el && v>0){
        return el.textContent = new Date(parseInt(v)*1000).format('YYYY-MM-DD');
    }
}

$this.list = $list_view({
    url:"/api/users", 
    sortKey : "id desc",
	delegate : $this,
    fields : [
        {name:'name',title:'User Name',sortable:true},
        {name:'age',title:'Age',sortable:true},
        {name:'gender',title:'Gender',sortable:true},
        {name:'register_time',title:'Start Date',sortable:true,wrapper:time_wrapper},
    ],
    drawItem : function(el,user,i){
        if(!user) return;
        el.childNodes[0].innerHTML = `${user.firstName}`;//display firstname only
    }
}, $this.layer, $this.footer);
```

#### Search or update the list
```Javascript
$this.list.update({keyword:"my keyword"})
```


## FormView

```javascript
/**
 * @param {object} opt : @see FormView Options
 * @param {element} target : [requied], the Dom Element to draw form
 * @return {FormView} a FormView instance
 */
$form_view(opt, target);
```


### FormView Options

| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| url | string | YES | | submit url (relative path) |
| items | array | YES | | form item list, @see FormViewItem |
| data | object | | | form data | 
| method | string | | "POST" | http method |
| withForm | bool | | true | if create \<form\> element |
| htmlTag | array | | "ul-li" | could be tr-td |


### FormViewItem (opt.`items`[N])
| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| name | string | YES | | form item name |
| type | enum | YES | | normal types :<br> (text,password,radio,checkbox,select,textarea,html,hidden)<br>extend types : <br>(image,file,autocomplete,list,tree,switch,calendar,period) |
| title | string | | | the title of this form item,<br>will be displayed as a \<H4\> tag |
| required | bool | | false | if this item is required |
| default | mixed | | | default value of this form item |
| validate | enum | | | available values : <br>email,zipcode_jp,phone_jp,url,len:N,len:N1:N2 |
| placeholder | enum | | | available values : <br> text,password,textarea |
| options | array | | | for type=radio,checkbox,select only <br>e.g. :<br>[{label1:value1},{label2:value2},{label3:value3}] <br>OR<br>[value1, value2, value3...](labelN will = valueN) |
| chain | string | | | bind other element's value,innerHTML,other properties to this input event.<br>e.g. :<br>when an input changed, another element can change its innerHTML with the newest value of this input.<br>to customize : the target element can specify a attr of 'chain',which can be either function or string. |
| ${other_keys} | mixed | | | the key name can be any string. the value can be any type the value will be set as attributes of this form item tag. |



### FormView Delegate methods

`opt.` can be replaced with a `delegate.` object.

#### opt.drawItem 
```Javascript
/**
 * [Optional] custom item rendering
 * @param rowElement : HTML Element of <TR>
 * @param item : 1 object data of API response.data[N]/items[N]
 * @param i : row index
 */
opt.drawItem = delegate.drawFormItem = function(rowElement, item, i){}
```
#### opt.onChange 
```Javascript
/**
 * [Optional] a function triggers when form item's value changes
 * @param k : key
 * @param v : value
 * @param change : an object contains all changes so far
 * @return 
 */
opt.onChange = delegate.onFormChange = function(k,v,changes){}
```
#### opt.onSubmit 
```Javascript
/**
 * [Optional] you can use this to show loading indicator. or return false to stop submit.
 * @param data : all user inputs / form data
 * @return : false=stop submit, others=sumit
 */
opt.onSubmit = delegate.onFormSubmit =function(data){}, 
```
#### opt.onSubmited
```Javascript
/**
 * [Optional] do jobs after form submited, such like update view
 * @param res : server response data in JSON format
 */
opt.onSubmited = delegate.onFormSubmited =function(res){}, 
```
#### opt.onError 
```Javascript
/**
 * [Optional] fires when validation error occurs
 * @param name: err name
 * @param err: err detail
 */
opt.onError = delegate.onFormError =function(name,err){}
```
#### opt.onStep 
```Javascript
/**
 * [Optional] execute after drawItem to tell if FormView should continue drawing the next item.
 * @param o: the form item object, passed by opt.items[N]
 * @param stepIndex : int
 * @return : true=continue drawing, false=stop drawing
 */
opt.onStep = delegate.onFormStep =function(o,stepIndex){}
```

### FormView methods

 #### FormView.dom
 ```Javascript
 /** return form element */
 public function dom()
 ```
 #### FormView.draw
 ```Javascript
 /** draw the form */
 public function draw()
 ```
 #### FormView.remove
 ```Javascript
 /** remove this form */
 public function remove()
 ```
 #### FormView.submit
 ```Javascript
 /** submit the form */
 public function submit()
 ```
 #### FormView.reset
 ```Javascript
 /**
  * clear all data and redraw the form, if clearData, the form data will be cleared too
  * @param clearData : true=clear all inputed data
  */
 public function reset(clearData)

 ```
 #### FormView.changes
 ```Javascript
 /**
  * set or get or delete changes
  */
public function changes(){}

var fm = $form_view(opt, target);

//get changes
var changes = fm.changes();

//set changes 
fm.changes("myname","myvalue");

/** delete changes */
fm.changes("myname",undefined);
```

#### FormView.throwError
```Javascript
/** throw an error, and call delegate.onError befor submit */
public function throwError(e)
```
#### FormView.addItem
```Javascript
public function addItem(o,i) : add an item after form rendered
```
#### FormView.removeItem
```Javascript
public function removeItem(i) : remove an item by index
```



### FormView Examples

#### Draw a form with data
```Javascript
var userdata = {...};
var form = $form_view({
    url : '/api/',
    method : 'POST',
    data : userdata,
    items : [
        {name:'email',title:'Your Email',type:'text',validate:'email',placeHolder:'Your Email'},
        {name:'pass',title:'Your Password',type:'password',validate:'len:6',placeHolder:'Your Pass',required:true},
        {name:'gender',title:'Your gender',type:'radio',options:[{label:'Male',value:1},{label:'Female',value:2}],validate:'len:1'},
        {name:'birth',title:'Birth Year',type:'datetime',format:'yymmdd',labelStyle:'cjk',fromYear:1970,toYear:1990},
        {name:'degree',title:'Your Degree',type:'select',options:['Bachelor','Master','PHD']},
        {name:'school',title:'Your School',type:'autocomplete',multiple:false,url:'/api/master/schools',},
        {name:'salary',title:'Your salary',type:'range',min:300,max:1500,step:50,from:300,to:450,unit:'万円'},
        {name:'resume',title:'Your Resume',type:'file',size:1,amount:2},
        {name:'desc',title:'Self introduction',type:'textarea'},
        {name:'mail_magazine_f',title:'Mail Managzine',type:'switch'}
    ],
    delegate : $this,
},target);
```

#### Using `chain` (opt.items[N].chain)
* example 1 
```Javascript
//the classname contains $input.chain then once input changes ,h1's innerHTML will be changed too
$input({type:'text',chain:'myclass'});
$h1({class:'myclass'});
```
* example 2 
```Javascript
//the classname contains $input.chain then once input changes ,h2.style.color will be changed too
$input({type:'text',chain:'myclass'});
$h2({class:'myclass',chain:'style.color'})
```
* example 3
```Javascript
//the classname contains $input.chain then once input changes ,h3's chain callback will be called, "this" means h3.
$input({type:'text',chain:'myclass'});
$h3({class:'myclass',chain:(v)=>{
    this.style.width = $.isNumber(v)?`${v}px`:v;
}})
```

## SpreadsheetView
```javascript
$spreadsheet_view();
```

## TabMenu
```javascript
$tab_menu();
```

## SideMenu
```javascript
$sidemenu();
```

## Popup
show a popup
```javascript
/**
 * 
 * @param content : {[HTML string|Element|Array|function]} same with $e()
 * @param manuallyClose :
 * @param additionalClassNames : 
 */
$popup(content,manuallyClose,additionalClassNames);
```

## Popover
```javascript
$popover();
```

## Alert
```javascript
$alert();
```

## Confirm
```javascript
$confirm();
```

## Auto complete
```javascript
$form_item_autocomplete();
```

## Calendar
```javascript
$calendar();
```

----


# Advanced Topics

## Multi-language
```Javascript
T('keyname')

```


## Animations

### Usage
```javascript
Element.animate(OPTIONS);

//Examples:
$id("img").animate({
  delta :"bounce",  
  style : "easeOut",
  step: function(el, delta){
    el.style.marginTop = delta*600;
  }}).animate({
  delta :"quad",
  style :"easeOut",
  step:function(el, delta){
    el.style.marginLeft = delta*600;
    el.style.width = delta*24*10; 
  }});

```

### Parameters (Available OPTIONS)

| Parameter | Type | Required | Default | Descripion |
| --- | --- | --- | --- | --- |
| delay | int | no | 0 | time wait to start |
| frame | int | no | 50 | how many frames per second. (1000ms) |
| duration | int | no | 1000 | The full time the animation should take, in ms |
| delta | easeIn<BR>easeOut<BR>easeInOut | no | easInOut | A function name, which returns the current animation progress. @see deltas |
| step | function(element, delta) | yes | - | a step function which does the real job |


### Deltas
* linear : Average speed.
```
>>>>>>>>>>
```

* quad : Accelerator 
```
o > >> >>> >>>> >>>>>
```

* quad5 : Accelerator faster
```
o > >>> >>>>> >>>>>>> >>>>>>>>>>>
```

* circ : Throwing 
```
o >> > ... > >> >>> >>>>
```

* back : bow - arrow 
```
<< < o > >> >>> >>>>
```

* bounce : 
```
< > < > < > o > >> >>> >>>>
```

* elastic :
```
< > << >> <<< >>> o > >> >>> >>>>
```

### Styles
* easeIn : same with the delta progress.
* easeOut : reverse the delta progress. 
* easeInOut : repeat 0~50% of the time of the delta progress and reverse it on the rest 50%.
