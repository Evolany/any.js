


const item_view_template = (w)=>{
    $for('{{items as e}}',[
        $div({index:'{{i}}'},[
            $h5("{{e.title}}"),
            $span("{{e.price}}")
        ])
    ],w)
}

//pattern A : specify data as attribute
var data_render_view = {    
    name : "data_render_view",
    items : [
        {title:"product 1", price:3000},
        {title:"product 2", price:3300},
        {title:"product 3", price:3500},
    ],
    drawContent : item_view_template
}

//pattern B : set data in onRender()
var data_render_view = {    
    name : "data_render_view",
    drawContent : item_view_template,
    onRender(p){
        this.items = [
            {title:"product 1", price:3000},
            {title:"product 2", price:3300},
            {title:"product 3", price:3500},
        ]
    }
}

//pattern C : set data during onLoad()
//notice : until data be fetched, user can only see a white screen
var data_render_view = {    
    name : "data_render_view",
    async onLoad(p){
        this.items = await(MY_API)
        this.loaded();
    },
    drawContent : item_view_template
}





