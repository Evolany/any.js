# miniapp css guideline

### 1. 必ず 各viewのclassNameをつけてください
* anybotの編集画面
* => App編集
* => ミニアプリ
* => 画面の横にある設定ボタンを押下
* => popup画面でclassnameを指定
* => 保存

### 2. 必ず 編集対象の部品にclass名をつけてください
* anybotの編集画面
* => App編集
* => ミニアプリ
* => 部品をクリック
* => 右側のpopup画面でclassnameを指定
* => 保存

### 3. 必ず 各viewのclassNameと同じファイル名のfile内で編集してください
* path : scss/my_view.scss
```
.my_view{
    /* ここで画面全体の定義 */
    .my_component_cls{
        /* ここで部品を定義してください */
    }
}
```

### 4. 表示非表示の切替
```
li[name=$somekey]{
    display:none;
}
[data-$somekey=$someValue] li[name=$somekey]{
    display:flex;
}

```


----

* 公開する方法 [こちら](/#/ma_command)
* 最新版をサーバから取得する方法 [こちら](/#/ma_command)
