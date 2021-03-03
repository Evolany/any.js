# Dom operation

## Syntax

> if you are familar with JQuery, it will be easy to learn the syntax.

### 構文 :

* _$TAG_NAME_ : [HTML5](https://www.w3schools.com/tags/default.asp)及び[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)のすべてのタグ名は利用できます。
* params :
  * _attributes_ : {Object|String} [optional] すべてのHTML5タグ及びSVGタグの属性及び自分で定義した属性名を指定できます。
    * _Object_ : 当該要素に指定したい属性一覧
    * _String_ : innerHTMLとして付与される
  * _children_ : {Array} [optional] 下位の要素一覧
  * _parent_ : {Element} [optional] 挿入先Element
* returns : **Element** 

```Javascript:preview
$TAG_NAME(attributes:Object|String, children:Array, parent:Element);
```



### examples 

* childのみを指定

```Javascript:preview
$ul([
    $li('item 1'),
    $li('item 2'),
    $li('item 3'),
], document.body)
```

* 挿入せずに、_変数_ として扱う

```Javascript
let div1 = $div({class:"div1"});
let div2 = $div({class:"div1"},[
    $span("item1"),
    $span("item2"),
]);
```
* _attr()_ & _css()_

```Javascript:preview
$div({class:'my-div'}, [
    $h2("Title").attr({class:'title'}).css({color:'black',fontSize:'2rem'}),
    $p({class:'details', html:'blah blah blah blah ...'})
], document.body)
```

* _Event_ との組み合わせ

```Javascript:preview
let click = ({target})=>{alert(target.innerHTML)}
$div({class:'buttons'},[
    $button({class:'icon cancel',html:'Cancel'}).bind('click',click),
    $button({class:'icon save',html:'Save'}).bind('click',click),
], document.body)
```

----

## Element extentions
see [Element](/#/element)
