# Controllers


### View & Layers
> Each viewController possesses a _layer_, which is an HTML5 _\<ARTICLE\>_ tag with the following structure

```HTML
<article class='${VIEW_NAME}' view='${VIEW_NAME}'> 
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

> Once a view's layer be presented, the other views will go to backward and be unvisible.<BR>
	
![Layers](https://s3-ap-northeast-1.amazonaws.com/evolany/frameworks/layers.png)

### Structure & delegate methods

> basic features of ViewControler instance
* it represents a view or screen in UI
* it implements ViewController **delegate** methods
* it is an **Observable** object (any changes will trigger a UI update)
* it can **extends** from **super** view
* it can has some default behaviours defined in **$app**

```Javascript
var my_view = {
    name : 'my_view', //[Required], as same as the variable
    extend : 'parent_view', //[Optional], parent view name
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
     * [Optional] a delegate for html template
     * if you are using html template in drawContent()
     * then you can use this delegate method to evaluate vars
     * @see HtmlTemplate
     */ 
    onRender : function(){},

    /**
     * [Optional] a delegate method to response event-driven messages from the framework or the other views.
     * you can update contents, redraw view parts after receiving the indications.
     * 
     * alternately, you can use 
     *  on${CamelStyleEventName} : function(data){},
     * 
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

> To show a view. or transit to another view you can just call

```javascript
  // this will be changed in the future.
  $app.openView("YOUR_VIEW_NAME"); 
  
  // or @deprecated
  $div({url:"YOUR_VIEW_NAME?param1=b&param2=b"});

```

### ~~Open a Subview~~ **@deprecated**

```Javascript
  $app.openSubview("YOUR_VIEW_NAME",{id:'my-data-id'});

  //NOTICE : in a subview, $this represents the parent view
  //To access properties or methods of current view, use my_view.propertyName instead.
```

### Open a view as Popup

```Javascript
  $app.openPopup("YOUR_VIEW_NAME",{...yourParameters});

  //this view will be presented as a popup
```

### **$this** keyword

> if you want to access current view from outside librarys
> you can use **$this**.
* In case of a view  : **$this** represents current view
* In case of a subview  : **$this** represents parent view
* In case of a subview  : **$child** represents current subview

## member functions

### .loaded()

> only works inside onLoad() method
> to tell $app to render this view contents.

```
var my_view = {
    // ...
    onLoad = async function(p){
        // ...
        this.data = await $http.get('/api/...');
        this.loaded();
    }
    // ...
}

```


### .reload()
> redraw this view

```
var my_view = {
    // ...
    onSomeButtonClick(p){
        // ...
        this.reload();
    }
    // ...
}
```

