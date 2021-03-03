# $app
> Contains App level functions and delegates

## method

### .start()
> start the app
* syntax : 
  * _.start()_ : start with default view defined in $conf.default_view
  * _.start(view_name)_ : start with specified view

```Javascript
$app.start("top_view");
```

### .openView()
> open a view as view transaction
> if view is not included, $app will include remote file automatically

* syntax : 
  * _$app.openView(view_name, params)_

```Javascript
$app.openView("product_detail_view", {id:3})

```

### ~.openSubView()~ 
> @deprecated

### .openPopup()
> open a view as popup
* syntax : 
  * _$app.openPopup(view_name, params)_

```Javascript
$app.openPopup("product_detail_view", {id:3})
```

### State functions
> @see [State](/#/state)

* _.setState()_
* _.getState()_
* _.pushState()_
* _.updateState()_
* _.deleteState()_

----

## events & delegate method

### .onLoad()

> do app initialization tasks here
> you must call _$app.loaded()_ manually after init

```
$app.onLoad = async ()=>{
    $app.me = await $http.get("/api/me")
    $app.loaded(); //you must call this manually after init
}
```

### .onLoadView(view_name)
> custom view loading process, such as you dont want any.js to load default  view_name file from default view folder. also, you can make view controller object manually in runtime.

```Javascript
$app.onLoadView = (view_name)=>{
    if(!window[view_name]){
        window[view_name] = {
            name : view_name,
            drawContent(w){
                $div(view_name)
            }
        }
    }
}
```

### .onLoadProgress(progress)
> for showing progress bar

### .onMessage(msg, data)
> default event handler function, be called when someone calls _$.send($app,"msg")_

### .onError()
> default error handling function

```Javascript
$app.onError=(e,d)=>{
    elog("ERR:red", e, d)
}
```