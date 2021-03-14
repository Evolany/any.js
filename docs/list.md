# ListView

> ListViewはany.jsの標準のUI部品の一つであり以下の機能を揃えています
> 当該部品は主にPC版の管理画面を想定しています。

* PC用のList表示部品の簡素化
* Columnの自由定義
* Sort機能
* Wrapper機能
* ページ送り
* 絞り込み検索をより簡単に
* Delegate methods
  * _onDrawItem()_
  * _onDrawCell()_
  * _onSelect()_
  * _onLoaded()_
  * _onEmpty()_


## Syntax

```
$list_view(options:Object, target:Element, paginationTarget:Element ) : ListView

```

### options
* _url_ [__*__]: str, API url to fetch data from. @see [API response](#api-server-response-format)
* _query_ : object, parameters to be sent to the api server.
* _items_ [__*__]: array, instead of calling API you can also specify an array of object as data. either _items_ or _url_ is required to tell list_view how to fetch data.
* _perpage_ : how many rows perpage
* _fields_ [__*__] : table column definations. @see [column object](#column-object)
* _delegate_ : view controller or object, we usually use _current view controller_ as delegate to handle list_view events. @see [delegate methods](#delegate-methods)
* _wrapper_ : wrapper function name, @see [wrappers](#wrappers)
* _tags_ : array, specify your own html tag instead of the default settings of table-tr-th-td @see [custom tags](#custom-tags)
* _templates_ : object, to do **custom** your cells contents. @see [use template](#use-template)


### column object
> each object represents a column of the table
* _name_ : column name or property name inside json object
* _type_
  * checkbox : show a checkbox in this cell
* _title_ : title of this column
* _sort_ : sortable or not
* _wrapper_ : wrapper function name

### API server response format
> the response from your server has to follow this format
> * data : list of data object
> * total : total items count for pagination
```
{
    data : [
        {id:1, name:'item1', ...},
        ...
    ],
    total : 213
}
```

### custom tags
> default is ['table', 'tr', 'th', 'td']
```
{
    tags : ['ul', 'li', 'h4', 'span']
}

```


## example 
```JavaScript
var my_view = {
    name : 'my_view',
    
    /*---  ViewController delegate methods  ---*/

    drawContent(w,l){
        $div({class:'search-bar'},[
            $input({type:'search'}).on('input','search')
        ],w)
        this.list = $list_view({
            url : '/api/MY_CTRL',
            query : this.query=this.query||{},
            fields : [
                { name:'id', title:'ID', sort:true, },
                { name:'thumb', sort:false, wrapper:'thumb' },
                { name:'title', title:'Product name', sort:true },
                { name:'price', title:'Price', wrapper:'price' },
            ],
            perpage : 12,
            delegate : this /*ues this view as delegate*/
        },w,$div({class:'pages'},w))
    },

    /*---  UI events delegate methods  ---*/

    onSearch({target}){
        this.query={...this.query, keyword:target.value.trim()}
        this.list.update(this.query)
    }

    /*---  ListView delegate methods  ---*/
    
    onListEmpty(row){
        row.innerHTML = "No contents to display";
    }

}

```


## pagination

## init with local Array
```javascript
const products = [
    {id:1, title:'T-Shirt', price:24150, thumb:''},
    {id:2, title:'Weather jacket', price:84500, thumb:''},
];

$list_view({
    items : products, //init with local array
    fields : [
        { name:'id', title:'ID', sort:true, },
        { name:'thumb', sort:false, wrapper:'thumb' },
        { name:'title', title:'Product name', sort:true },
        { name:'price', title:'Price', wrapper:'price' },
    ],
},w)
```

## custom cells

### 1. use template
> you can custom cell drawings by specify templates
* _format_ : {$field_name:Element}
* _element variable name_ : **e** represents element var name.
* all template events should use **@EVENT_NAME** instead of _.on()/.bind()_. for example _{"@click":"my-event-name"}_. because until they are rendered they are not real dom elements.

```
$list_view({
    ...,
    fields:[
        {name:'thumb'},
        {name:'name'},
        {name:'gender'},
        {name:'start_datetime'},
    ],
    templates:{
        thumb : $div({class:'image'}).css({background:"{{e.thumb}}"}),
        name : $div([
            $span("[ID:{{e.id}}]"),
            $span("{{e.name}}"),
            $i({class:'icon edit', "@click":'edit-user'})
        ])
    }
})
```


### 2. wrappers

> to format some columns, you can use list-item-wrappers

* define a wrapper

```
/**
* @param el : cell element
* @param v : cell value
* @param k : column name
* @return : new value or manipulate el children inline
*/
var $list_item_{{WRAPPER_NAME}} = function(el, v, k){
    //el manipulate
    el.innerHTML = "$"+v
}

var $list_item_datetime = function(el, v, k){
    //return new value
    return new Date(v).format("YYYY-MM-DD")
}
```

```
$list_view({
    ...,
    fields:[
        {name:'thumb'},
        {name:'name'},
        {name:'start_datetime_timestamp', wrapper:'datetime'},
    ],
})

```

### 3. onDrawListCell()/onDrawListItem()
@see [onListDrawCell()](#onlistdrawcell)



## update contents

> if the data changed, for example user changed query condition or query keyword, you can update the table contents by calling _.update()_

* _format_ : list_instance.update(new_query_condition)

```
var my_view={

    drawContent(w){
        $div([
            $input({type:'search'}).on('input','keyword-input'),    
            this.list = $list_view(...)
        ])
    },

    onKeywordInput({target}){
        //listview will call api url with new query, and update the table
        this.list.update({keyword : target.value})
    }
}


```


----


## delegate methods


### onListDrawCell()

### onListDrawItem()

### onListSelect()

### onListLoaded()

### onListEmpty()