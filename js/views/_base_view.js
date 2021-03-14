var _base_view = new function(p){
    this.name = '_base_view';
    this.noFooter = true;
    this.drawContent = function(w){
        w.append(
            $aside(//sidemenu
                $conf.menus.map(m=>
                    $details({open:1},[
                        $summary(m.title),
                        $ul(m.items.map(t=>
                            $li({html:t.title, view:t.view}).on('click','switch-menu')
                        ))
                    ])
                )
            ),
            $section({class:'content-pane',ref:'content'},[
                $section({class:'code-pane',ref:'code'},[
                    $div({class:'markdown',html:'{{doc}}',parse:true})
                ]),
                $section({class:'preview-pane',ref:'preview'}),
            ])
        )
    }

    this.onRender = async function(){
        const vname = this.docname || this.name.replace(/_view$/,'');
        let code = await fetch(`docs/${vname}.md?ver=${$.rand(0,100)}`).then(response => response.text())

        // highlight code
        const renderer = new marked.Renderer();
        renderer.code = (code, lang) => {
            let [ln, cls] =(lang || 'JavaScript').split(":")
            const valid = !!(ln && hljs.getLanguage(ln));
            const highlighted = valid ? hljs.highlight(ln, code).value : code;
            return `<pre><code class="hljs ${ln} ${cls||''}">${highlighted}</code></pre>`;
        };
        marked.setOptions({ renderer });

        this.doc = marked(code)
        this.refs.code.find("code",(c)=>{
            // if(!c.hasClass('preview')) return;//TODO:copy
            $button({html:'Preview'},c).on("click", 'preview')
        })
    }

    /**
     * triggers when code run button be clicked
     * show simulator on the right side
     */
    this.onPreview = function(e){
        let code = e.target.parentNode.innerHTML;
        code = code.replace(/<button>Preview<\/button>/,'')
        code = code.replace(/\s*,\s*document\.body/,'')
        $pop("preview");
        try{
            $pop('preview',eval(code))
        }catch(e){
            alert("Failed to render code", e)
        }
    }

    /**
     * 
     * @param {*} e 
     */
    this.onSwitchMenu = function(e){
        let vn = `${e.target.view}_view`;
        $app.openView(vn);
    }
}
