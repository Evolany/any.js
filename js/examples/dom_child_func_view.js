
var $component = function(o){
    return $div(o.title)
}

var child_func_view = new function(){    
    this.name = "child_func_view";
    const API_URL = "/clients/aeon?limit=3&fields=id,title,desc,image";
    this.noHeader = true;

    this.drawContent = function(w, l){
        $h2("test",w);
        $for("{{items as c}}",[
            $component
        ],w);
    }

    this.onRender = function(){
        fetch(API_URL).then(r=>r.json()).then(r=>{
            this.items = r
        });
    }

}



