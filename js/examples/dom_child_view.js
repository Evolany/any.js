var dom_child_view = new function(){    
    this.name = "dom_child_view";
    this.drawContent = function(w, l){
        $div([
            "text1",//string means $div(text), you can change tag by setting $conf.defaultTag
            {class:'red', html:'red-text'}, //obj means $div(obj)
            $h3("h3"),
            $dl({class:'horizontal'},[
                $dd("dd1"),
                $dd("dd2"),
                $dd("dd3"),
            ]),
            [//array means list of element, default is <ul> <li>
                'li1',
                'li2',
                'li3',
            ],
            {html:"clickable", "@click":"click"} //@click to specify click event name
        ],w)
    }
    this.onClick = function(e){
        elog("onclick")
    }
}