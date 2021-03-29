# Template

> inlineの画面描画の他にany.jsでテンプレート形式のレンダリングをサポートしています


## Text

> templateを利用時に
> _{{変数名}}_ でhtml tag 関数に挿入
> _parse:true_ を必ず指定、でないとテキストとして処理される

```Javascript
var my_view = {
    drawContent(w){
        w.append(
            $h1({parse:true, html:"{{app.title}} > {{title}}"})
            //parse:true > parse contents with {{xx}}
        )
    },
    onRender(){
        this.title = "examples";
        $app.title = "my app"
    }
}
```

## Escape

> to avoid compiling, you can simply add a ! inside {{!}}
> for example

```Javascript

$code("{{!!dont_compile_me}}")

```

----
## Form

```Javascript
var my_view = {
    drawContent(w){
        w.append(
            $h1({parse:true, html:"{{app.title}} > {{title}}"}),

            $form ([
                $div({class:'colors-row'},[
                    $images({ name : 'form.colors', multiple : true, editable : true, imageKey:'image', titleKey:'title' }),
                ]),
                $div({class:'name-row'},[
                    $vbox({class:'', title:'name'},[
                        $h4('Product name'),
                        $ipt({type:'text',name:'form.name',placeHolder:'Your product name'}),
                        $small({html:'205 TIGHT STRAIGHT e.g.'}),
                        $em({html:'{{error.name}}', if:'{{error.name}}'})
                    ])
                ]),
                $hbox({class:'price-row'},[
                    $vbox({class:'cell', title:'price'},[
                        $h4('price'),
                        $hbox({class:'price-wrapper'},[
                            $ipt({name:'form.price', type:'number', placeHolder:'your price'}),
                            $label("JPY")
                        ]),
                        $small({html:'5,800 JPY e.g.'}),
                        $em({html:'{{error.price}}', if:'{{error.price}}'})
                    ]),
                    $vbox({class:'cell', title:'discount'},[
                        $h4('discount'),
                        $hbox({class:'price-wrapper'},[
                            $ipt({name:'form.discount', type:'number', placeHolder:'0'}), 
                            $pick({name:'form.discount_type', type:'tabmenu'})
                        ]),
                        $small({html:'5% e.g.'}),
                        $em({html:'{{error.discount}}', if:'{{error.discount}}'})
                    ]),
                ]),
                $div({class:'sizes-row'},[
                    $h4('size'),
                    $pick({name:'form.sizes', type:'checkbox', outline:'true'}),
                ]),
                $div({class:'zipcode-row'},[
                    $h4('zipcode'),
                    $autocomp({name:'zipcode',url:'/api/master/zipcode',queryKey:'c'}),
                ]),
                $div({class:'type-row'},[
                    $h4('type'),
                    $pick({name:'form.type', type:'radio', layout:'vertical'}),
                ]),
                $div({class:'gender-row'},[
                    $h4('gender'),
                    $pick({name:'form.gender', type:'tabmenu'}),
                ]),
                $div({class:'features-row'},[
                    $h4('features'),
                    $pick({name:'form.features', type:'tags'}),
                ]),
                $div({class:'stores-row'},[
                    $h4('stores'),
                    $pick({name:'form.stores', type:'pulldown',editable:true, placeHolder:'Pick up a store'}),
                ]),
                $div({class:'switch-row'},[
                    $h4('available'),
                    $pick({type:'switch', name:'form.available'}), 
                ])
                
            ])
        )
    },

    onRender(){
        this.form = {
            name : 'my name',
            colors : [
                {image:'https://lee-japan.jp/fp/special/american_riders2/images/lineup_color_1.jpg',title:"DARK BLUE INDIGO",desc:"現代の主流となっている、より深みのあるインディゴブルーへと染め上げたワンウォッシュタイプ。"},
                {image:'https://lee-japan.jp/fp/special/american_riders2/images/lineup_color_2.jpg',title:"DARK BLUE INDIGO［USED WASH］",desc:"「ダークブルー インディゴ」のユーズド加工タイプは、コントラストの効いた迫力ある色落ちが持ち味。"},
                {image:'https://lee-japan.jp/fp/special/american_riders2/images/lineup_color_3.jpg',title:"CLASSIC BLUE INDIGO",desc:"1960年代に見られた、Lee 本来のクリアで鮮やかなインディゴブルーを再現したワンウォッシュタイプ。"},
                {image:'https://lee-japan.jp/fp/special/american_riders2/images/lineup_color_4.jpg',title:"CLASSIC BLUE INDIGO［USED WASH］",desc:"「クラシックブルー インディゴ」のユーズド加工タイプ。爽やかでクリーンな色落ちの表情を楽しめる。"},
            ],

            sizes_options : ['small','medium','large','xlarge'].map(k=>{return {label:k, value:k}}),
            type_options   : ['REGULAR STRAIGHT','BOOT CUT','TAPERED','TIGHT STRAIGHT'].map(k=>{return {label:k, value:k}}),
            gender_options : ['mens','womens','kids'].map(k=>{return {label:k, value:k}}),
            features_options  : ['DENIM FABRIC','SEWING & RIVET','ZIPPER','BELT LOOP'].map(k=>{return {label:k, value:k}}),
            stores_options  : ['Online Shop','Shinjuku','Shibuya','Yokohama'].map(k=>{return {label:k, value:k}}),
            discount_type_options : ['%','¥'].map(k=>{return {label:k, value:k}}),

            sizes  : ['small','medium'],
            type    : ['TAPERED'],
            gender  : ['mens'],
            features   : ['ZIPPER'],
            stores   : ['Online Shop'],
            discount_type : ['%'],
            available : true
            
        }
    },
    
    /* event delegate */
    onFormInput(e){
        elog("CLICK:red", e.target);
    }
    
    onFormChange(k, v){
        elog("CHANGE:",k,v);
    }
}

```

----
## List

### pattern A : $for()
> @see [$for](/#/for)

```Javascript
var my_view{
    drawContent(w){
        $section({},[
            $for("{{comps as c}}",[
                $e("{{c.tag}}", "{{c.opts}}")
            ])
        ],w)
    },
    onRender(){
        this.comps = [
            {tag:'input',opts:{name:'myname'}},
            {tag:'textarea',opts:{name:'mydesc'}},
            {tag:'p',opts:{html:"this is the description"}}
        ];
    }
}
```


### pattern B : _loop_ with array

* syntax:
  * _loop:"{{変数 as 要素}}"_ : default 要素名=_e_
  * loop内で "{{要素.属性名}}" で記述
* event:
  * _@$eventName : "event-name"_ で記述 : 例) "@click":"on-click"
  * 現在のviewControllerへon-clickのメッセージとして送信

```Javascript
var recipy_list_view = {
    drawContent(w){
        $ul({class:'recipy-list'},[
            $li({class:'head'},[
                $dl({class:'tabs'},[
                    $dt("thumb"),
                    $dt("title"),
                    $dt("desc."),
                ])
            ]),
            $li({class:'item', loop:"{{items as item}}", cid:"{{item.id}}",
                "@click":'click-recipy'
                },[
                $div({class:'thumb'}).css({"background":"url({{item.image}})"}),
                $div({class:'info'},[
                    $h4({html:"{{item.title}}"}),
                    $p({html:"{{item.desc}}",class:'desc'}),
                    $pick({name:'item.stat', type:'tags'}),
                ]),
            ]),
        ],w)
    },
    onRender(){
        this.title = "examples";
        $app.title = "my app"
    },

    /* event handler */
    onClickRecipy({target}){
        let cid = target.attr('cid');
        let o = items.find(i=>i.id==cid);  
        $app.openPopup('recipy_view', o);   
    }
}

var liber_detail_view = {
    name: 'liber_detail_view',
    noHeader : true,
    noFooter : true,
    drawContent(w,l){
        $section({class:"recipy", var:"{{item}}"},[
            $ul([
                $li({class:"image"},[
                    $div({}).css({"background":"url({{item.image}})"}),
                ]),
                $li([
                    $h5("Title"),
                    $h4("{{item.title}}"),
                ]),
                $li([
                    $h5("Detail"),
                    $p("{{item.desc}}"),
                ]),
                $li([
                    $h5("Steps"),
                    $p("{{item.steps}}"),
                ]),
            ])
        ],w)
    },
    onRender(p){
        elog("render",p)
        this.item = p;
    }

}
```

### pattern C : _loop_ with index/step/as

```Javascript
$dl({class:"pages"},[
    $dd({html:"{{i}}", loop:'{{0..5}}', as:'idx',step:1})
])
```


### pattern D : _loop_ with index / max
```Javascript
$dl({class:"pages"},[
    $dd({html:"{{i}}", loop:'{{0..max}}'})
])
```

----

## Display control

```Javascript
var my_view={
    drawContent(w){
        $section([
            $h2("Display on/off"),

            $h3("filter:"),
            $p("text under this paragraph is filtered by attributes of 'schema' & 'admin'"),
            $p("Try this cases"),
            $pre({html:'$this.schema="facility"',on:{'click':'copy-text'} }),
            $p("and this"),
            $pre({html:'$this.role="admin"',on:{'click':'copy-text'} }),
            $ul({ filter:"{{schema && role}}" }, [
                $li({html:'common contents'}),
                $li({schema:"catalog", html:'content2 for schema=catalog'}),
                $li({schema:"stores", html:'content for schema=stores'}),
                $li({schema:"facility", html:'content for schema=facility'}),
                $li({role:"admin member", html:'content for role=admin only'}),
                $li({role:"admin", schema:"facility", html:'content for role=admin & schema=facility only'}),
            ]),

            $h3("if:"),
            $p("Try with var name"),
            $pre({html:'$this.msg="your message"',on:{'click':'copy-text'} }),
            $p({html:"This msg is from this.msg: {{msg}}", if:'{{msg}}'}),

            $p("You can also use arrow function to do the same thing, only this.count>3 will show the following line"),
            $pre({html:'$this.count=5',on:{'click':'copy-text'} }),
            $p({html:"This msg is checked by arrow function of this.count>3", if:(k,v,el)=>k=='count'&&v>3 }),
        ],w)
    },
}


