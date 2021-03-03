# Array.prototype.*


### .last()
return last element

### .hash()
array to hash
* syntax : 
  * _.hash(key)_ : convert to {element[key]:element}
  * _.hash(key,value)_ : convert to {element[key]:element[value]}
* return : **Object**

```Javascript
let arr = [{id:1,name:'taro'},{id:2,name:'hanako'}];

arr.hash('id')
> {1:{id:1,name:'taro'},2:{id:2,name:'hanako'}}

arr.hash('id','name')
> {1:'taro',2:'hanako'}
```

### .unique()
same with php _array_unique()_
* syntax:
  * _.unique()_ : return a new arr without duplicated
* return: a new **Array**

```Javascript
[1,3,3,5].unique()
> [1,3,5]
```
