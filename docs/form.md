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


```javascript
/**
 * @param {object} opt : @see FormView Options
 * @param {element} target : [requied], the Dom Element to draw form
 * @return {FormView} a FormView instance
 */
$form_view(opt, target);
```


## FormView Options

| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| url | string | YES | | submit url (relative path) |
| items | array | YES | | form item list, @see FormViewItem |
| data | object | | | form data | 
| method | string | | "POST" | http method |
| withForm | bool | | true | if create \<form\> element |
| htmlTag | array | | "ul-li" | could be tr-td |


### FormViewItem (opt._items_[N])
| Option name | Type | Required | Default | Description | 
| --- | --- | --- | --- | --- |
| name | string | YES | | form item name |
| type | enum | YES | | normal types :<br> (text,password,radio,checkbox,select,textarea,html,hidden)<br>extend types : <br>(image,file,autocomplete,list,tree,switch,calendar,period) |
| title | string | | | the title of this form item,<br>will be displayed as a \<H4\> tag |
| required | bool | | false | if this item is required |
| default | mixed | | | default value of this form item |
| validate | enum | | | available values : <br>email,zipcode_jp,phone_jp,url,len:N,len:N1:N2 |
| placeholder | enum | | | available values : <br> text,password,textarea |
| options | array | | | for type=radio,checkbox,select only <br>e.g. :<br>[{label1:value1},{label2:value2},{label3:value3}] <br>OR<br>[value1, value2, value3...](labelN will = valueN) |
| ${other_keys} | mixed | | | the key name can be any string. the value can be any type the value will be set as attributes of this form item tag. |


----

## FormView Delegate methods

_opt._ can be replaced with a _delegate._ object.

### .drawItem()
```Javascript
/**
 * [Optional] custom item rendering
 * @param rowElement : HTML Element of <TR>
 * @param item : 1 object data of API response.data[N]/items[N]
 * @param i : row index
 */
opt.drawItem = delegate.drawFormItem = function(rowElement, item, i){}
```
### .onChange()
```Javascript
/**
 * [Optional] a function triggers when form item's value changes
 * @param k : key
 * @param v : value
 * @param change : an object contains all changes so far
 * @return 
 */
opt.onChange = delegate.onFormChange = function(k,v,changes){}
```
### .onSubmit()
```Javascript
/**
 * [Optional] you can use this to show loading indicator. or return false to stop submit.
 * @param data : all user inputs / form data
 * @return : false=stop submit, others=sumit
 */
opt.onSubmit = delegate.onFormSubmit =function(data){}, 
```
### .onSubmited()
```Javascript
/**
 * [Optional] do jobs after form submited, such like update view
 * @param res : server response data in JSON format
 */
opt.onSubmited = delegate.onFormSubmited =function(res){}, 
```
### .onError()
```Javascript
/**
 * [Optional] fires when validation error occurs
 * @param name: err name
 * @param err: err detail
 */
opt.onError = delegate.onFormError =function(name,err){}
```
### .onStep()
```Javascript
/**
 * [Optional] execute after drawItem to tell if FormView should continue drawing the next item.
 * @param o: the form item object, passed by opt.items[N]
 * @param stepIndex : int
 * @return : true=continue drawing, false=stop drawing
 */
opt.onStep = delegate.onFormStep =function(o,stepIndex){}
```

----

## FormView methods

 ### .dom()
 ```Javascript
 /** return form element */
 public function dom()
 ```
 ### .remove()
 ```Javascript
 /** remove this form */
 public function remove()
 ```
 ### .submit()
 ```Javascript
 /** submit the form */
 public function submit()
 ```
 ### .reset()
 ```Javascript
 /**
  * clear all data and redraw the form, if clearData, the form data will be cleared too
  * @param clearData : true=clear all inputed data
  */
 public function reset(clearData)

 ```
 ### .changes()
 ```Javascript
 /**
  * set or get or delete changes
  */
public function changes(){}

var fm = $form_view(opt, target);

//get changes
var changes = fm.changes();

//set changes 
fm.changes("myname","myvalue");

/** delete changes */
fm.changes("myname",undefined);
```

### .throwError()
```Javascript
/** throw an error, and call delegate.onError befor submit */
public function throwError(e)
```
### .addItem()
```Javascript
public function addItem(o,i) : add an item after form rendered
```
### .removeItem()
```Javascript
public function removeItem(i) : remove an item by index
```

----

## Examples

### Draw a form with data
```Javascript
var userdata = {...};
var form = $form_view({
    url : '/api/',
    method : 'POST',
    data : userdata,
    items : [
        {name:'email',title:'Your Email',type:'text',validate:'email',placeHolder:'Your Email'},
        {name:'pass',title:'Your Password',type:'password',validate:'len:6',placeHolder:'Your Pass',required:true},
        {name:'gender',title:'Your gender',type:'radio',options:[{label:'Male',value:1},{label:'Female',value:2}],validate:'len:1'},
        {name:'birth',title:'Birth Year',type:'datetime',format:'yymmdd',labelStyle:'cjk',fromYear:1970,toYear:1990},
        {name:'degree',title:'Your Degree',type:'select',options:['Bachelor','Master','PHD']},
        {name:'school',title:'Your School',type:'autocomplete',multiple:false,url:'/api/master/schools',},
        {name:'salary',title:'Your salary',type:'range',min:300,max:1500,step:50,from:300,to:450,unit:'万円'},
        {name:'resume',title:'Your Resume',type:'file',size:1,amount:2},
        {name:'desc',title:'Self introduction',type:'textarea'},
        {name:'mail_magazine_f',title:'Mail Managzine',type:'switch'}
    ],
    delegate : $this,
},target);
```


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





