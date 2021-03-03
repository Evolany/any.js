# State

### $app.setState() & Template

```Javascript
$h1().date('state',"name")
//OR
$h1({'data-state':'name'})

$app.setState({name:"myname"})
//myname will be affect to both

```

### $app.getState()

> support _keypath_

```Javascript
$app.setState("cart.item.title":"my title")
$app.setState("cart.item.price":2300)

let n = $app.getState("cart.item")
> {title:"my title", price:2300}
```

### $app.deleteState()
> remove a state key

### $app.pushState()
> push to a state array
