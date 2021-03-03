# Element.prototype.*

## Attributes & Data

### .attr()

> GET/SET attributes
* @syntax : 
  * _.attr(k, v)_ : set element attribute 'k' to 'v'
  * _.attr(object)_ : set all key-values of object to element
  * _.attr(k)_ : get value by key
* @return : **Element**

```
//set attributes
$div({class:"my-class", html:"contents....."})

//same with
$div().attr({class:"my-class", html:"contents....."})

//get attribute
let d = $div({class:"my-class", html:"contents.....", contentId:3})
let id = d.attr("contentId")
```

### .data()
> set data as attribute with prefix of ("data-")
* syntax : 
  * _.data(key, value)_ : set data-$key = $value, @return **Element**
  * _.data(key, undefined)_ : delete data-$key, @return **Element**
  * _.data(key)_ : get data-$key, @return mixed value
  * _.data()_ : get all {...dataset}, @return Object

```
let n = $div().data('name', "john");
let nm = n.data('name')

```


----

## Events

### .bind()
> handle an event with function
* syntax : 
  * _.bind(eventName, func)_
* return : **Element**

```
let fn = function({target}){
    alert("click", target.textContent)
}
$dl({class:'tabmenu'},[
    $dd({html:'item 1',class:'item'}).bind('click',fn),
    $dd({html:'item 2',class:'item'}).bind('click',fn),
    $dd({html:'item 3',class:'item'}).bind('click',fn),
],document.body)
```

### .on()
> when events triggered send a msg to viewController instead
* syntax : 
  * _.on(eventName, messageNameToSend)_
* return : **Element**

```
$button({html:'button1'}).bind('click','item-click')
//this will send a message to current ViewController 
```

### .fire()
> fire an event without user operation
* syntax : 
  * _.fire(eventName)_
* return : false

```
$a({href:'google.com',target:'_blank'},document.body).fire("click")
```

### .onloaded(func)
> triggers when loaded

### .onremoved(func)
> triggers when removed

----

## Insert before/after

### .left() / .right()
> Insert before or after element
* syntax : 
  * _.left(targetElement)_ : insert before
  * _.right(targetElement)_ : insert after
* return : **Element**

```Javascript
//insert before 1st element
$div({html:"ooo"}).left(document.body.firstElement)

//insert after 1st element
$div({html:"ooo"}).right(document.body.firstElement)
```

----

## Remove

### .remove()
* syntax : 
  * _.remove()_ : remove from parent
* return : none

```Javascript
let element = $div({}, document.body)
element.remove() //remove 
$.remove(element) //a more safety way, to avoid null error
```

----

## CSS & styles

### .css()
> GET/SET css style inline
* syntax : 
  * _.css(key, value)_ : set css key, value
  * _.css(obj)_ : set multi prop. with object
* return : **Element**

```Javascript
$div().css({height:'20rem',width:'100%'}).css('color','red')
```

### .addClass()
* syntax : 
  * _.addClass(classname)_ : add a classname
* return : **Element**

```Javascript
$div().addClass('my-name').attr('name',"id")
```

### .removeClass()
* syntax : 
  * _.removeClass(className)_ : remove a classname from classlist
* return : **Element**

```Javascript
$div().removeClass('my-name').attr('name',"id")
```

### .hasClass()
* syntax : 
  * _.hasClass(className)_ : 
* return : boolean

```Javascript
$div({class:'my-class'}).hasClass('my')
> false
```

### .index()
> get the child numerical index in its parent node.
* @return {int} 0-N

### .rect()
> get coordinate with size of current element

```
document.body.rect()
> {top: 0, width: 1131, left: 0, height: 731}
```

### .height()
get element real height

### .width()
get element width height

### .hide()
hide element **@deprecated**, use attr() with css style instead

### .show()
show element **@deprecated**, use attr() with css style instead

----

## Dom Query

### .find()
search elements, similar with _document.querySelectorAll()_
* syntax : 
  * _.find(query)_ : dom query return hit items
  * _.find(query, forEachFunction)_ : dom query with each func
* return : **DomList**

```Javascript
//since in any.js there are multi layers<article> in the same page
//if you want to query elements exits in current page you should use this.layer.find()
let lis = this.layer.find("li");

//the 2nd param is a foreach function
let divs = this.layer.find('div',(el, i)=>{
    if(el.hasClass("on")){
        el.innerHTML = 'ON'
    }
})

```

### .find1st()
same with find(), but return 1st hit element only
* syntax : 
  * _.find1st(query)_ : dom query return 1st item
* return : **Element | null**

```Javascript
let div = this.layer.find1st("dd")
```

### .findByText()
find text node only with specified "text",
* syntax : 
  * _.findByText(condition, exludes=[])_
* params:
  * text : [Optional] 
    * =null: means all not empty nodes
    * =others: query condition
  * excludeTags : [optional] exclude these tagnames of lowercase
* return : **DomList**

```Javascript
//find all but <options>/<body>
dom.findByText(null, ["option","body"])

//find all contains "mytext"
dom.findByText("mytext")
```

----

## as variable

1. declare

```Javascript
var my_view={
    drawContent(w){
        $div({class:'my-dev', html:"contents here"},[
            this.input = $input({name:'name',value:"aaa"})
        ])
        this.input.value="bbb"
    }
}
```

2. use 'ref' property

```Javascript
var my_view={
    drawContent(w){
        $div({class:'my-dev', html:"contents here", ref:'mydiv'})
        //to reference 
        //this: current view
        //this.refs: an object contains all ref definations
        this.refs.mydiv.innerHTML = "new text";
    }
}
```

----

## Other methods

### .clone()
clone an element

### .isSvg()
check if its a svg tag