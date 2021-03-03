
# 1. template

```
var my_view = {
    name : 'my_view',
    
    drawContent(w,l){
        $ul([
            $for('{{items}}',[ 
                /* default iterator is 'e' */
                $li([
                    $h4({html:"{{e.title}}"}),
                    $if((e)=>e.price>1000,[ 
                        $span("1000円~"),
                    ],(e)=>e.price>800,[
                        $span("800円~"),
                    ],(e)=>e.price<=800,[
                        $span("~799円"),
                    ])
                ])
            ])
        ],w)
    },

    onRender(){
        $this.items = [
            {title:"product 2000",price:2000},
            {title:"product 900",price:900},
            {title:"product 600",price:600},
        ] 
    }
}

```