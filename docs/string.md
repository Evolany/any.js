String.prototype.*

### .ucfirst()

> Capitalize string、頭文字を大文字に変える

```
"name".ucfirst()
> "Name"
```

### .camelCase() 

> normal case to camel case

```
"my-button-click".camelCase()
> "MyButtonClick"
```

### .toHex() / .fromHex()

> string to 16 bit hex code

```
"mypassword".toHex()
> "6d7970617373776f7264"

"6d7970617373776f7264".fromHex()
> "mypassword"
```

### .toHexUTF8() / .fromHexUTF8()
```
"日本語".toHexUTF8()
> "65e5672c8a9e"

"65e5672c8a9e".fromHex()
> "eåg,"

"65e5672c8a9e".fromHexUTF8()
> "日本語"
```

### .CJKLength() 
> get CJK(漢字 | 日本語 | 韓国語) string length

### .halfWidth()
> 半角数字・かな変換

### .validate(type)
> validate string format. 文字列のフォマット判定

* available formats
  * _kanji_ : 漢字
  * _katakana_ : カナカナ
  * _hirakana_ : 平仮名
  * _japanese-name_ : 日本人氏名
  * _number_ : 数字
  * _email_ : email
  * _phone-jp_ : 日本の電話番号
  * _zipcode-jp_ : 日本の郵便番号
  * _url_ : URL
  * _len_ : 長さの判定 "len:1:10"=>長さ1~10 / "len:1:10"=>一文字以上
  * _Ymd_ : YYYYMMDD / YYYY-MM-DD
  * _Ym_ : YYYYMM / YYYY-MM
  * _Ymdhi_ : YYYYMMDDHHII / YYYY-MM-DD HH:II
  * _hi_ : HH:II
  * _name_ : 名前
  * _line_ : LINE ID
  * _age_ : 年齢
  * _price_ : 値段
  * _az09_ : 英数字

```
"sss".validate("email")
> false
"sss@gmail.com".validate("gmail")
> true
```

### .timediff()

> time diff between Y-m-d H:i:s date string and now time
> 日付フォマット(Y-m-d H:i:s)の文字列から現在時刻までの時間差 

```
"2021-01-25 00:00:00".timediff()
> "1months.ago"
"2021-02-25 00:00:00".timediff()
> "4days.ago"
"2021-03-01 17:00:00".timediff()
> "35minutes.ago"
```