# 1. 型の判定
* _$.isArray(v)_
* _$.isFunc(f)_
* _$.isFile(v)_
* _$.isBool(va)_
* _$.isElement(obj)_
* _$.isNumber(n)_
* _$.isString(o)_
* _$.isObject(o)_
* _$.isHTML(str)_
* _$.isGenerator(fn)_ : yield typeの判定

----

# Object 操作用ツール

### $.set()/$.at()

_keypath_ でobject内のpropertyの値を指定
* _SET_: $.set(obj, keypath, value)
* _GET_: $.at(obj, keypath)

```
let obj = {}
$.set(obj, 'info.name', "jean");
$.set(obj, 'info.age', 18);
$.set(obj, 'address.zipcode', '222-0033');
let info = $.at(obj, 'info');
> {name:'jean', age:18}
let name = $.at(obj, 'info.name');
> 'jean'
```

### $.clone(o)
copy object to another one


----

# Form & Query
### $.unserialize(paramStr,rowSpliter,kvSpliter)

> Query string to Object

```Javascript
let r = $.unserialize("a=1&b=2",'&','=')
> {a:1, b:2}
```

### $.serialize(params,rowSpliter,kvSpliter)
> Object to query string

```Javascript
const params = {a:1, b:2}
let r = $.serialize(params,'&','=')
> a=1&b=2
```

----

# Event driven

### $.send(target,msg,data)
> send messages between view controllers and apps and modules

```
$.send(this, "btn-click", {id:1}) 
//send a click msg to current viewController

$.send($app, "product-page-updated", {id:1}) 
//send a updated msg to $app

```


----

# Includes files/libraries from outside    

### $.includes(files, opts)
> includes js/css files on runtime

```
await $.includes([
    'my_cool_lib.js',
    'my_cool_css.css',
])
```

----

# Encrypt & Math

### $.rand(min, max)
> Generate random number

```
$.rand(1,100)
> 73
```

### $.keygen(len,chars)
> Generate random secret key or password from char list your provided
> default chars: _abcdefghijklmnopqrstuvwxyz0123456789_.;,-$%()!@_

```
//generate random 4 bit number
$.keygen(4, "1234567890")
> 3411
```

### $.uuid()
> Generate UUID 

```
$.uuid()
> "cb20a46a-d1f4-4c9b-afe1-0ffa45d76b4a"
```

### $.md5(str)
>generate md5 encoded string 

```
$.md5("mypassword")
> 34819d7beeabb9260a5c854bc85b3e44
```

----
    
# DOM用ツール

### $.rect(element)
> get the element rect and coordinate from left-top corner of the window

```
let r = $.rect(this.layer);

> {left:0, top:60, width:1280, height:720}
```
### $.inRect(point, rect)
> pointがrectと被るかどうかの判定
### $.overlay(r1, r2)
> 2つのrectがoverlayするかどうかの判定
### $.cursor(e,target)
> 現在のmouse event eが、上位elementのtarget内の相対座標を求める
### $.screenWidth()
> 現在のscreenの幅を取得
### $.screenHeight()
> 現在のscreenの高さを取得
### $.uploadWindow(callback,multiple,types,withsize)
> file/image のアップロード用画面が立ち上がる

    
    
    