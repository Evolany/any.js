# TOP

[Welcome to anybot UI library](http://anybot.me)


# what does it do
* __1.__ DOM operation
* __2.__ Build a WEB App
  * structure : _$app_ -> _$controller_ -> _$view_ or DOM Element
  * Draw a page with _$controller_
    * life cycle events
  * Handle UI events
  * View transition
    * $app.openView
  * Data binding and Template
  * Play with API data
  * Make your own UI modules with _$view_
  * Tools & utilities
  * anybot Miniapp customization


# DOM

```html
<!DOCTYPE html>
<html>
<head>
  <script src="YOUR_JS_PATH/any.js"></script>
</head>
<body>
  <script>
    window.onload = function(){
        $table({class:'my-list'},[
            $tr([
                $th("ColHeader1"),
                $th("ColHeader2"),
                $th("ColHeader3")
            ]),
            $tr([
                $td("ColValue1"),
                $td({html:"ColValue2",class:'col-2'}),
                $td("ColValue3").bind('click',(e)=>console.log('click'))
            ]),
        ], wrapper);
    }
  </script>
</body>
</html>
```

## the concept
* every _html/svg_ tag has a _$TAG_NAME_ function

```Javascript
//for html
$div({class:"my-div", html:"content here ...."})

//for svg
$svg({id:'my-svg'},[
  $path({d: "M2.63574 0.817688L17.1819 15.3639L15.3637 17.1822L0.817468 2.63596L2.63574 0.817688Z", fill:"#666"}),
  $path({d: "M17.1826 2.63574L2.63642 17.1819L0.818146 15.3637L15.3643 0.817468L17.1826 2.63574Z", fill="#666"})
])

```

* every function follows the syntax of 

```Javascript

// 1. full arguments
// $TAG_NAME(attrs:object, children:array, parent:Element)
$div({class:'box'},[
  $span("item1"),
  $span("item2"),
],document.body)

// 2. attr only
// $TAG_NAME(attrs:object)
$div({class:'box'},document.body)

// 3. child only
// $TAG_NAME(children:array, parent:Element)
$ul([
  $li("item1"),
  $li("item2"),
],document.body)

```

* _attrs_ can be string or object
  * _string_ : means _innerHTML_ or src of <_img_> tag
  * _object_ : means attributes, it could be
    * all available ones of HTML element. such like name, class, id ... 
    * your custom attributes such as my-prop

```Javascript
$div("my contents") // save with $div({html:"my contents"})

$div({"data-id":'my-id', specialKey:"some key", class:"my-class"})

```


* _children_ is an array of child elements or string or function...
  * _$DOM()_ : such as $div() means element
  * _string_ : means $div( { html: $thisString } )
  * _array_ : means $ul( [ $li() ... ] )
  * _function_ : means insert the return value of the function
  * _$view(name)_ : means append your custom UI components

```Javascript

const draw_row = function(o){
  return $div(o.title)
}

$div({class:'my-div'},[
  $span("my-span"),
  //will be translated to $div("line-1"),
  "line-1",
  //will be converted to $ul([ $li("item1"), $li("item2") ])
  [
    'item1',
    'item2',
  ],
  $for("{{items}}",[
    draw_row //use function as child
  ]),
  $view('view_name', {})//append UI component as subview
])


```


* every dom function returns an _Element_ instance, and supports these methods and all these methods return _Element_ by default
  * _attr()_ : set/get attributes
  * _css()_ : set/get inline css properties
  * _bind()_ : attach events functions
  * _on()_ : attach an event and send message to parent view or controller.
  * _data()_ : set/get data-VAR properties

```Javascript
let div = $div({html:"Hello", class:'my-div'})
.attr({content:'my-content'})
.css({backgroundColor:'blue', color:'white'})
.bind('mousedown,mouseup', (e)=>{console.log('mouse event')})//bind a function
.on('click', 'my-div-click')//let it send my-div-click event to controller
.data('value', 'my-value')//set data-value=my-value


let c = div.attr('content'); //my-content
let v = div.data('value'); //my-value
let vs = div.data();//get all values:{value:'my-value'}

```


----
# Build an app


----
## structure

  * _$app_ : contains many pages
    * Multiple _$controller_ : each page has 1 $controller
      * Many _HTML DOM elements_
      * Multiple _$view components_
      * Multiple _delegate methods_ : event handlers
    * _App level event handlers_
    * _$conf_ : settings
  
<img src='/images/structure.jpg'/>

----

## draw a page with $controller


----

### _controller_ life cycle events

#### loading events
* _onLoad_ 		: a page is on initilization process. call this.loaded() to finish loading process
* _drawHeader_ 	: draw page's <header> tag
* _drawContent_ 	: draw page's body <section> tag
* _drawFooter_ 	: draw page's <footer> tag
* _onRender_ 		: after called this.render, bind data for this controller

#### transition events
* _onTransition_ 	: a page is going to transit to another view, return false to block transition.
* _onClose_ 		: a popup page is closing itself

#### subview events
* _onActive_ 		: a page is going to forground, by closing a child page
* _onInactive_ 	: a page is going to background, by openning a child page

### example

```Javascript
const my_view = {
  name : 'my_view',

  /* controller delegates */
  onLoad(p){
    this.id = p.id
    this.loaded();
  },
  drawHeader(h){
    $h1("Page title", h)
  },
  drawContent(w){
    $section({class:'body'},[
      $h2("{{!userName}}"),
      $p("blah blah blah ..."),
      $button("bye bye").on('click','bye')
    ])
  },
  drawFooter(f){
    $p('Copyright : my great company')
  },
  onRender(d){
    this.userName = 'your name';//set value of $h2({{!userName}})
  },

  /* event handlers */
  onBye(e){
    error.log("Button clicked", e.target)
  }

}

```


----
## handle UI events

### UI events from current page

> there are mainly 2 ways to handle your mouse/keyboard events from UI
1. _.bind(EventNames, function)_
2. _.on(EventName, MessageName)_

```Javascript
const my_view = {
  drawContent(w){
    $div("click me 1",w).bind('click,doubleclick', this.click)
    $div("click me 2",w).on('click', 'click')//this will call this.onClick, which replace the message name to *Camel Caption*
  },
  click(e, view){
    //this means current target element , view is my_view
    elog("click 1:red", e, this, view)
  },
  onClick(e){
    //this means current view of my_view, to get target element using e.target
    elog("click 2:blue", e, this)
  },
}

```

### Events from other pages

> to send messages cross pages or between $app and controllers, use _$.send()_ function

```Javascript

/*
* $.send will find Camel Case function in target object first.
* if there is, it will be called.
* or it will try to exec onMessage function with arguments of onMessage(messagName, ...yourdata)
*/
$app.onMessage = function(m, view, event){
    elog("msg:red", m, view, event)
}

const my_view_1 = {
    drawContent(w){
        $div("click me",w).on('click', 'click')
    },
    onClick(e){
        $.send($app, "click-me", this, e);// -> $app.onClickMe or $app.onMessage
        $.send('my_view_2', "click-me", this, e)// -> my_view_2.onClickMe or my_view_2.onMessage
    },
}

const my_view_2 = {
    drawContent(w){
        ...
    },
    onClickMe(view, e){//event handler for msg from my_view_1
        elog("msg:blue", view, e)
    },
}

```


----
## view transition

> there are 2 ways to do view transaction

1. use _$app.openView_ to do view transition with history changes
2. use _$app.openPopup_ to show other views as popup without history changes

```Javascript
const list_view = {
  data : [
    {title:'apple', id:1},
    {title:'banana', id:2},
    {title:'cherry', id:3},
  ],
  drawContent(w){
    $ul(
      this.data.map(i=>$li({html:i.title}).data('id',i.id).on('click','click'))
    ,w)
  },
  onTrans({target}){
    let data = this.data.find(e=>e.id==target.data('id'));
    $app.openView('detail_view', data) // view transaction
    //to show as popup:
    //$app.openPopup('detail_view', data)
  },
}

const detail_view = {
  drawContent(w){
    $div([
      $span('ID:'+this.params.id)
      $h4(this.params.title)
    ],w)
  },
}
```

----
## Play with API

> to get api data and render them, you can use both official _fetch_ function or use _$http_ modules

* _$http.get(url, params, callback)_ : send get request
* _$http.post(url, data, callback)_ : send post request
* _$http.postJSON(url, data, callback)_ : send post-json request
* _$http.put(url, data, callback)_ : send put request
* _$http.del(url, data, callback)_ : send delete request
* @return : promise
  
```Javascript
const my_view = {
  apiUrl : '/clients/aeon?limit=20&fields=id,title,desc,image',
  async drawContent(w){
    $ul([
      (await $http.get(this.apiUrl, {page:1})).map(e=>
        $li({html:e.title})
      )
    ],w)
  },
}

```

----
## data binding & templates

> to make your code clean and seperate data from html doms, we provide a data binding sisutem.

```Javascript
const my_view = {
  name : 'my_view',
  title : 'product list',
  drawContent(w){
    //draw view template here
    w.append(
      $h2('{{title}}'), //will be replaced with this.title in the rendering phase
      $ul({class:'data-list'},[
        $for('{{items as e}}',[ //will be rendered in onRender function
          $li({class:'row'},[
            $div({class:'image'}).css({backgroundImage:'url({{e.image}})'}),
            $div("{{e.title}}"),
            $span("{{e.price}}"),
            $button({html:"edit"}).data({'id':'{{e.id}}'}).on('click','item-click')
          ])
        ])
      ])
    )
  },
  async onRender(p){
    //bind data here
    this.items = await $http.get(URL);
  }
}

```
----
## make a UI module

> to make some _reusable_ UI components for yourself. your can define then with _$view_
* to declare : const my_view = { draw(w){...} }
* to use them : _$view(view_name, data={}, options={})_

```Javascript
const row = {
  draw(w){
    w.append(
      $div(this.params.title||''),
      $div(`{{${this.name||'row'}.item}}`).on('click','click')
    );
  },
  onClick(e){
    elog("click", this)
  }
}

const my_view = {
  drawContent(w){
    $view('row', {name:'item1', title:'item1 title'},w);
    $view('row', {name:'item2', title:'item2 title'},w);
  }
}
```

----
## other tools

* Element.* : Dom extensions [document](/#/element)
* $.* : general tools [document](/#/any)
* String.* : string tools [document](/#/string)
* Array.* : array tools [document](/#/array)
* Date.* : date tools [document](/#/date)


----
# anybot miniapp UI custom
> see [document](./#/ma_settings)






