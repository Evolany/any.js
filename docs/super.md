# view controllerの継承

> view controller内に _extend_ を指定すると他のcontrollerの継承を実現できます。

## 実行の順番

1. _super.onLoad()_
2. _this.onLoad()_
3. _this.loaded()_
4. _super.drawHeader()_
5. _this.drawHeader()_
6. [if no func] : _$app.drawheader()_
7. _$app.drawContent()_
8. _super.drawContent()_
9. _this.drawContent()_
10. _this.drawFooter()_
11. _super.drawFooter()_
12. [if no func] : _$app.drawFooter()_
13. _super.onRender()_
14. _this.onRender()_

## Override 対象外関数
> 下位の画面が親の以下の関数を _上書きしない_ ようになっています
* _onLoad()_
* _drawHeader()_
* _drawContent()_
* _drawFooter()_
* _onRender()_

## Example

### 親画面

```Javascript

var parent_view = {
    name : 'parent_view',
    drawHeader(h){
        $h1(this.name)
    },
    drawContent(w,l){
        //this will be called ealier then child view
        w.append(
            $aside([//draw a common side bar
                $nav([
                    $a({html:"About us",href:'/'}),
                    $a({html:"Product",href:'/product'}),
                    $a({html:"Price",href:'/price'}),
                    $a({html:"Team",href:'/team'}),
                    $a({html:"Contact us",href:'/contact'}),
                ])
            ]),
            $section({class:'content-pane', ref:'frame'})
        )
    },
    onRender(){
        //this will be called ealier then child view
    },
    drawFooter(f){
        $span("Copyright my-great-company 2021", f)
    }
}

```

### 下位の画面
> _extend_ で親を指定

```Javascript
var child_view = {
    name : 'child_view', //nameは必須、変数名と一致
    extend : 'parent_view', //親画面を指定
    drawContent(w,l){
        //ここだけをカスタマイズする
        $table([
            $tr([
                $th("ID"),
                $th("Title"),
                $th("Price"),
                $th("instock"),
            ]),
            $for("{{items}}",[
                $tr([
                    $th("{{e.id}}"),
                    $th("{{e.title}}"),
                    $th("${{e.price:number}}"),
                    $th("{{e.instock}}"),
                ])
            ])
        ], this.refs.frame) //親で指定した $section({ref:'frame'})
    },
    onRender : async ()=>{
        this.items = await $http.get("/api/MY-PRODUCT");
    }
}
```