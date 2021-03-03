# Message-driven & delegate model

> _any.js_ では画面(controller)と画面の間、または$appとの間でeventを通して通信を行います。

## Message-driven

### 従来のアプローチ

> 仮に下記のような _Manager_ と _Staff_ の2つの _class_ が存在するとして、
> 従来のやり方 : 

```Javascript
const staffs=[];
class Manager{
    hire(condition){
        let s = new Staff(condition)
        staffs.push(s)
    }
    work(task){
        let staff = staffs.filter(s=>s.canDo())[0]
        if(task.stat=='trouble')
            staff.solveTrouble(task)
        else if(task.stat=='emergency'){
            staff.stopAll()
            staff.solveEmergency(task)
            staff.resume()
        }else{
            this.do()
        }
    }
    do(){}
}
class Staff {
    solveTrouble(task){}
    solveEmergency(){}
    stopAll(){}
    resume(){}
    canDo(task){}
}
```

### 課題:
> 上記は単純なケースですが、
* _ManagerがStaffに細かい作業指示を出さない限りは、Staffが動きません_
* _現実社会ではタスクの量が多いとManagerがボトルネックになりがち_
* _このようなClass間の関数レベル参照によって、スパゲッティ構造になりがち_

### 解決策:
> managerが細かい指示を出すよりは、情報共有と指示に専念
* Staff業務のプロセスを定める
* Staffに自ら行動してもらう


### 改善後の構造

> 以下のように _Manager_ と _Staff_ のそれぞれのやるべきことを明確し、
> MangerがStaffの解決できない問題に集中し、Staffは自ら行動できる構造を実現できます。
* _$.send()_ はmessageまたはeventを相手に共有
* _onTask()_ はDelegate method

```Javascript

class Manager{
    hire(condition){
        let s = new Staff(condition)
        staffs.push(s)
    }
    async work(task){
        Promise.race(
            staffs.map(staff=>$.send(staff, 'task', task)//お知らせするだけ
        ).catch(e=>{
            this.do(task)
        })
    }
    do(){}
}

class Staff{
    onTask(task){//delegate method
        if(this.canDo(task)) return this.do(task)
        else return false
    }
    async do(task){
        if(task.stat=='trouble')
            this.solveTrouble(task)
        else if(task.stat=='emergency'){
            this.stopAll()
            this.solveEmergency(task)
            this.resume()
        }else{
            throw Error()
        }
    }    
    solveTrouble(task){}
    solveEmergency(){}
    stopAll(){}
    resume(){}
    canDo(task){}
}

```

----

## Message送信

### $.send()
* syntax : 
  * _$.send(TARGET, MSG_NAME, DATA)_ : TARGETにMSG_NAMEのメッセージとDATAを送信
* params : 
  * _TARGET_ : {String|Object} 送信相手
    * _String_ : window直下の変数名、例他のviewController名
    * _Object_ : 送信相手のObject
  * _MSG_NAME_ : {String} [Optional] messageの名称、例JSのonclick, ondragstart ...
  * _DATA_ : {Object} [Optional] 相手に共有するデータ

```Javascript

$.send("parent_view", "update", new_data)

```

----

## Message受信(Delegate)

> 受信側のobjectは以下のいずれのメソッドを持たないと$.sendから受信できません。
> 実行の順番
1. _on$EventName(data)_ : あればここで終了、引数にMSG_NAMEが入っていません！
2. _onMessage(msg, data)_ : on$EventNameのmethodが存在なし、onMessageがあればここに入る

### .on$EventName()
> _重要_ : MSG_NAME名はハイフンで繋いだ場合はcamel形式でdelegate関数を定義する必要があります。
* syntax : 
  * _on$EventName(DATA)_ : 
  
```Javascript
var parent_view={
    onUpdate(data){
        ...
    }
}
```


### .onMessage()

> on$MessageNameの関数がない場合はここにはいります。

* syntax : 
  * _onMessage(MSG_NAME, DATA)_
  
```Javascript
var parent_view={
    onMessage(msg, data){
        if(msg == 'update'){
            ...
        }
    }
}
```

