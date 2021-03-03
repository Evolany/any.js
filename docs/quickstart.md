## One Minute Guide

After the [Installation Guide](#installation-guide).

### 1. In your HTML.

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
  <script>
    window.onload = function(){
        $app.start("my_view");
    }
  </script>
</body>
</html>

```

### 2. In your views.js

```javascript

var my_view = {
    name : "my_view",
    drawContent(wrapper, layer){ //implement the delegate method
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
        ], wrapper);
    }
};

```

### 3. Check the result on your browser


<br><br>

----


## Five Minutes Guide

* Read [#OneMinuteGuide this] first.
* To create common header

```Javascript
$app.drawHeader = (header)=>{
    //draw a H1 tag with innerHTML of 'MY WEB SERVICE', and append to header
    //all pages will be affected by this setting
    $h1("MY WEB SERVICE", header);
}
```

* To create common footer

```Javascript
$app.drawFooter = (footer)=>{
    //draw an <A> tag with href='the url',and innerHTML of 'Copyright' and append to footer
    //all pages will be affected by this setting
    $a({html:"Copyright",href:'https://my-great-company.com'}, footer);
};
```

* To customize header of the current view

```Javascript
var my_view = {
    name : "my_view",
    drawHeader(header){
        //draw a H1 tag with innerHTML of 'MY VIEW', and append to header
        $h1("MY VIEW", header);
    },
    drawContent(wrapper, layer){ //implement the delegate method
        //...
    }
};
```

* To customize footer of the current view

```Javascript
var my_view = {
    name : "my_view",
    drawHeader(header){
        //...
    },
    drawContent(wrapper, layer){ //implement the delegate method
        //...
    },
    drawFooter(footer){
        //draw an <A> tag with href='the url',and innerHTML of 'Copyright' and append to footer
        $a({html:"Copyright",href:'https://my-great-company.com'}, footer);
    },
};
```


----