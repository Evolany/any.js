var $conf={
    default_view : "top_view",
    modules : ['any.ui','any.formview','any.listview'],
    mode : 'test',
    apiver : 2,
    encrypt_url : false,
    image_path : "/images/",
    view_path : "/js/views/",
    lib_path : "/js/modules/",
    server_host : 'https://demo.bonp.me',
};

$conf.menus = [
    {
        title : 'Basic concept',
        items : [
            // {title:'php',view:'php'},
            {title:'@item.quickstart', view:'quickstart'},
            {title:'@item.dom', view:'dom'},
            {title:'@item.events', view:'events'},
            {title:'@item.app', view:'app'},
            {title:'@item.ctrl', view:'ctrl'},
            {title:'@item.super', view:'super'},
        ]
    },
    {
        title : 'Dom functions',
        items : [
            {title:'@item.element', view:'element'},
            {title:'@item.nodelist', view:'nodelist'},
        ]
    },
    {
        title : 'Template & State',
        items : [
            {title:'@item.template', view:'template'},
            {title:'@item.state', view:'state'},
            {title:'@item.for', view:'for'},
            {title:'@item.if', view:'if'},
            {title:'@item.visibility', view:'visibility'},
            {title:'@item.practice', view:'practice'},
        ]
    },
    {
        title : 'UI components',
        items : [
            {title:'@item.list', view:'list'},
            {title:'@item.form', view:'form'},
            // {title:'@item.autocomplete', view:'autocomplete', hidden:1},//TODO
            // {title:'@item.popup', view:'popup', hidden:1},//TODO
            // {title:'@item.slider', view:'slider', hidden:1},//TODO
            // {title:'@item.selection', view:'selection', hidden:1},//TODO
            // {title:'@item.tabmenu', view:'tabmenu', hidden:1},//TODO
        ]
    },
    {
        title : 'Other tools',
        items : [
            {title:'@item.$', view:'any'},
            {title:'@item.string', view:'string'},
            {title:'@item.array', view:'array'},
            {title:'@item.date', view:'date'},
            {title:'@item.http', view:'http'},
        ]
    },
    {
        title : 'Miniapp SDK',
        items : [
            {title:'@item.ma_settings', view:'ma_settings'},
            {title:'@item.ma_ctrl', view:'ma_ctrl'},
            {title:'@item.ma_css', view:'ma_css'},
            {title:'@item.ma_command', view:'ma_command'},
        ]
    },
];