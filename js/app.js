$app.onLoad = function(){
    // elog("apponload:red")
    hljs.configure({tabReplace: '<span class="indent">\t</span>'});
    hljs.initHighlightingOnLoad();
    $app.loaded();
}

$app.drawHeader = function(h){
    h.attr({html:''}).append(
        $a({href:'/',html:"TOP>"}),
        $h1(T("view."+this.name))
    )
}

$app.onLoadView = function(vn){
    if($.isString(vn) && !window[vn])
        window[vn] = { name : vn, extend : '_base_view' }
}


$app.onError = function(e, d){
    if(e=='view_not_exists_error'){
        window[d.name] = {
            name : d.name,
            extend : '_base_view',
            drawContent(){},
            onRender(){}
        }
        $app.openView(d.name)
    }else{
        elog("ERR:red", e, d)
    }
}