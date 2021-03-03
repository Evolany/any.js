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
            params : this.query=this.query||{},
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

## column object

## pagination

## init with local Array
```
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

## wrappers

## delegate methods

### onListDrawCell()

### onListDrawItem()

### onListSelect()

### onListLoaded()

### onListEmpty()