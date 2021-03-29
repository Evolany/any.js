# Miniapp view controller

## 事前定義済みの変数

**$app.bot**
現在のbot(app)の設定を取得

**$app.me**
現在のユーザ情報を取得

**$this**
現在のviewControllerを取得

**$this.view**
現在のminiapp画面の定義を取得

**$this.view.data**
現在の画面上でリモートから取得済みのAPIデータを取得

----

## 利用可能な$app method

### 画面遷移

* syntax : $miniapp.openView(vid|view_classname, data)

```
$miniapp.openView("sorry-page", data)
```

### 画面のpopover表示

* syntax : $miniapp.openPopover(vid|view_classname, height, data)

```
$miniapp.openPopover("notice-window", data)
```

### templateの文字列のにデータを代入

* syntax : $miniapp.evals(text, data, userdata={})

```
$this.layer.find1st("div").innerHTML = $miniapp.evals(`
    <div>
        <!-- data from $app.me.name -->
        <span>name: {{user.name}}</span>

        <!-- data from $this.view.data.title -->
        <span>title: {{title}}</span> 
    </div>
`, $this.view.data, $app.me);
```


----

## $app delegate methods

画面上の読み込みエラーやHTTPエラーが発生時に呼ばれます。
これを利用し、カスタムの**エラーページ**やエラーメッセージを呼び出せます。

```
$app.onError=(msg, err)=>{
    //your code
}
```

----

## View controller delegate methods


### viewの初期化開始

当該viewが初期化が始まった直後に実行される
当該viewのデータ及びパラメータの初期化処理を行えます。

* syntax : 
  * _onInit(ctrl, user, view, bot)_
* params :
  * _ctrl_ : {ViewController} current view controller, same with **this**
  * _user_ : {Object} current user data, same with **$app.me**
  * _view_ : {Object} view settings data, same with **$this.view**
  * _bot_ : {Object} bot settings data, same with **$app.bot**

```
var my_view = {
	onInit : (ctrl, user, view, bot) => {
      view.params = "editing=1"; //change query params
	},
}
```

### viewの初期化完了

当該viewが初期化のタイミングで実行される
UIカスタムはこのタイミングで行います
* **注意** : **document.querySelectorAll()は利用禁止**、複数枚のlayerが存在するので
* **ctrl.layer.find()** を使ってください
* syntax : 
  * _onLoad(ctrl, user, view, bot)_
* params :
  * _ctrl_ : {ViewController} current view controller, same with **this**
  * _user_ : {Object} current user data, same with **$app.me**
  * _view_ : {Object} view settings data, same with **$this.view**
  * _bot_ : {Object} bot settings data, same with **$app.bot**

```
var my_view = {
	onLoad : (ctrl, user, view, bot) => {
        ctrl.layer.find("li").bind("click", (e)=>{
            elog("clicked:purple", e.target)
        })
	},
}
```

### APIからデータ取得後の加工

* syntax : 
  * _onFetched(data)_
* param 
  * _data_ : {mixed} APIのレスポンスデータ, **$this.view.data**の加工前版
* returns : {Object/Array}:加工後のresponse data、他:変更なし

```
var my_view = {
	onFetched(data){
        elog("data:orange",data)
	},
}
```

### formや画面上のonchange処理

form上のデータ変更または、listの数量選択などのタイミングで発火

* syntax : 
  * _onChanges(k,v)_
* param :
  * _k_ : {string} changed key name
  * _v_ : {mixed} new value

```
var my_view = {
	onChanges(k,v){
        elog("changes:orange",k,v)
	},
}
```


### form submit前の処理

form送信される前に実行される。
submitを止めるか、中身を加工することができます。
* syntax : 
  * _onSave(d)_
* param :
  * _d_ : {Object} 送信用data、中身をここで変更できます
* returns : false:送信を取りやめる, その他:通常に送信

```
var my_view = {
    onSave(d){
        //return false means : stop submiting
    }
}
```

### form submit後

form送信後に実行される。結果を持って何かを処理を行えます。
* syntax : 
  * _onSaved(res, err)_
* param :
  * _res_ : {Object} サーバからのresponseデータ
  * _err_ : {Object|null} サーバからのERRORメッセージ

```
var my_view = {
	onSaved(res, err){
        
    }
}
```

### 画面遷移前

画面遷移やchatに送信する前に、遷移を止めたり、カスタマイズの処理を行うことができます。
* syntax : 
  * _onTransition(opt, data)_
* param :
  * _opt_ : {Object} 押されたボタンの定義. opt.transから遷移の種類を取得可能
  * _data_ : {Object} defaultの挙動で次のページに渡すデータ
* returns : false:画面遷移/chat送信を取りやめる, その他:通常に遷移

```
var my_view = {
	onTransition(opt, data){
        
    }
}
```


### List部品内のコンテンツ削除

list/grids部品を使用する場合は、リスト内の部品が削除される時に発火
* syntax : 
  * _onListRemoved(e)_
* param 
  * _e_ : {Object} 削除されたデータ

```
var my_view = {
	  onListRemoved(p){
        //your task ...
    }
}
```

### ECの商品オプション情報選択

ECのオプション選択部品を使用する場合は、オプションが選択される時に発火
* syntax : 
  * _onEcOptions(e)_
* param 
  * _e_ : {Object} 選択されたオプションの在庫情報

```
var my_view = {
	  onEcOptions(p){
        //your task ...
    }
}
```

### video再生終了

ビデオ部品があった場合は、再生終了後に実行される。
* syntax : 
  * _onVideoFinished(p)_
* param 
  * _p_ : {Object} ビデオに関する情報

```
var my_view = {
	onVideoFinished(p){
        //send video visit info to server
        $http.post("/api/my_api", p)
    }
}
```

----
### 関連するトピック

* CSSのガイドライン  [こちら](/#/ma_css)
* 公開する方法 [こちら](/#/ma_command)
* 最新版をサーバから取得する方法 [こちら](/#/ma_command)

