# FormView

> FormViewはany.jsの標準のUI部品の一つであり以下の機能を揃えています
* Form定義をの簡単化
* Nested構造のサポート
* 自動入力チェック
* Delegate method
  * _onFormDrawItem()_
  * _onFormChange()_
  * _onFormSubmit()_
  * _onFormSubmited()_

```JavaScript
var my_view = {
    name : 'my_view',
    
    /*---  ViewController delegate methods  ---*/

    drawContent(w,l){
        $section([
            $h2("form title"),
            this.form = $form_view({
                url : '/api/MY_CTRL',
                method : 'POST',
                items : [
                    { name:'id', type:'hidden' },
                    { name:'name', type:'text', title:'Name' },
                    { name:'gender', type:'radio', title:'Gender', options:[ 
                        {label:'Male',value:'male'},
                        {label:'Female',value:'female'}
                    ] },
                    {
                        items : [//put multiple items in one line
                            //specify validation method
                            { name:'email', type:'text', title:'Email', placeholder:'000-0000',validate:'email' },
                            { name:'phone', type:'text',title:'Phone number',validate:'phone-jp' }
                        ],
                        class : 'email-row',//custom classname
                    },
                    //use html tag func along with settings
                    $p("Tell us something about yourself"),   
                    { name:'intro', type:'textarea',placeHolder:'self introduction' },
                ],
                delegate : this /*ues this view as delegate*/
            }),
            $div({class:'buttons'},[
                $button('Submit').on('click','button-click')
            ])
        ],w)
    },

    /*---  event delegate methods  ---*/

    onButtonClick(e){
        e.preventDefault();
        this.form.submit();
    },

    /*---  FormView delegate methods  ---*/

    /**
    * FormView delegate 
    * triggers when form items changed
    * triggers only if $this is delegate of $form_view
    */
    onFormChange(k, v, changes){
        this.changes = changes
    },

    onFormSubmit(d){
        d.appId = 231; //add additional params before send to the server
        return d; //return false or nothing to stop submition
    },

    onFormSubmited(res, err){
        //tell the updated info to others views
        $.send('other_view', 'my-form-updated', res)
    }
}

```



