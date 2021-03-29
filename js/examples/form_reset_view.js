var form_reset_view = {    
    name : 'form_reset_view',
    drawContent(w, l){
        $div([
            this.form = $form_view({
                url : '/api/',
                method : 'POST',
                data : {},
                items : [
                    {name:"id",title:"id"},
                    {name:"name",title:"name"},
                ],
                delegate : this,
            }),
            $hbox([
                $button("rand").on("click", "switch-form")
            ])
        ],w)
    },
    onSwitchForm(e){
        const fms = [
            [{name:"id",title:"id1"},{name:"name",title:"name1"}],
            [{name:"id",title:"id2"},{name:"name",title:"name2"}],
            [{name:"id",title:"id3"},{name:"name",title:"name3"}]
        ]
        const datas = [
            {id:1,name:"name1"},{id:2,name:"name2"},{id:3,name:"name3"},
        ]
        this.form.setItems(fms[$.rand(0,2)]);
        this.form.setData(datas[$.rand(0,2)]);
        this.form.reset();
    }

}

