# $http module

### $http.get()
send request with GET method
* return : Promise
```Javascript
let store = await $http.get("/api/store",{id:1},(res,err)=>{})
```

### $http.post()
send request with POST method
* return : Promise
```Javascript
$http.post("/api/store",{id:1,name:"john"},(res,err)=>{})
```


### $http.upload()
send request with post and multi-part files data
* return : Promise
```Javascript
$http.upload("/api/store",{id:1,files:myfile},(res,err)=>{})
```

in php
```PHP
<?php
$fs = $_FILES['files'];

```

### $http.postJSON()
send request with post JSON
* return : Promise
```Javascript
$http.post("/api/store",{id:1,name:'john'},(res,err)=>{})
```

in php
```PHP
<?php
$req = json_decode(file_get_contents("php://input"), true);

```

### $http.del()
send request with DELETE method
* return : Promise
```Javascript
$http.del("/api/store",{id:1},(res,err)=>{})
```

### $http.put()
set request with PUT method
* return : Promise
```Javascript
$http.put("/api/store",{id:1},(res,err)=>{})
```