const component_1= {
    draw(w,l){
        $div("component_1 component",[
            $p(this.params.text),
            "{{lang}}",
            $ul([
                $for(`{{${this.params.name||'target_view'}.items as e}}`,[
                    $li("item1 : {{e}}")
                ]),
            ]),
            $button({html:"Show lang"}).bind('click',this.onClick),
            $button({html:"test event"}).on('click','event'),
            $hr(),
        ],w);
    },
    onClick(e, view){
        view.lang = 'LANG='+view.params.lang;
    },
    onEvent(e){
        elog("view click", this, e.target)
    }
}


const component_2= {
    name : 'component_2',
    draw(w, l){
        $div("component_2 component",[
            $p(this.params.text),
            "{{lang}}",
            $ul([
                $li({loop:"{{items2}}", html:'ITEM2 : {{e}}'})
            ]),
            $button("Show lang && change data").bind("click",this.click),
            $hr(),
        ],w);
    },
    click(e, view){
        view.lang = 'LANG='+view.params.lang;
        view.items2 = ['Beaf', 'Pork', 'Chicken', 'Fish']
    }
}

const my_controller= {
    name : 'my_controller',
    drawContent(w, l){
        $div("test",[
            $view("component_1",{text:"こんにちは", lang:'Japanese', name:'target1'}),
            $view("component_1",{text:"你好", lang:'Chinese', name:'target2'}),
            $view("component_2",{text:"Hello", lang:'English'}),
            $button("change contents").on("click","change-content"),
            $button({html:"test event"}).on('click','event'),
        ],w);
    },
    onRender(){
        this.items = ["1","2","3","4","5"];
        this.target1 = {items : ["11","22","33","44","55"]};
        this.target2 = {items : ["111","222","333","444","555"]};
        this.items2 = ["1000","2000","3000","4000","5000"];
    },

    onChangeContent(e){
        this.items = ["A","B","C","D","E"];
        this.items2 = ["apple","banana","cherry","dragon fruits"];
    },

    onEvent(e){
        elog("ctrl click")
    }
    
}