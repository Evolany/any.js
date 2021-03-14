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



----
### Introducing `$app.state`

* To active global state manager, assign this value at the very beginning of your app:

```javascript
$app.useState = true;
```

* After that, you can assign the inital state to your app

```javascript
$app.state = {
	newMessages: 0,
	username: 'Alice'
};
```

* To bind an element to a state, simply add a `data-state` property to the element.
* When the state is changed, the `innerHTML` of that element will be updated to the changed value.
* After this element is appended, the `innerHTML` of this element will be the value from `$app.state`

```javascript
$span({'data-state': 'newMessages'});
```

* If you want to change other values of this element after the stage changes, you can `bind` the `state` event, and change the values accordingly

```javascript
el = $span({'data-state': 'newMessages'}).bind('state', ({detail}) => {
	if(detail > 0) {
		el.innerText = detail;
		el.className = 'on';
	} else {
		el.className = 'off';
	}
});
```

* To set a state, use `$app.setState`

```javascript
$app.setState({ newMessages: 1 });
```

* By passing a function with a parameter, your can change the state according to the previous state:

```javascript
$app.setState(state => ({ newMessages: state.newMessages + 1 }));
```

### Example usage

```javascript

$app.useState = true;

$app.state = {
	newOrders: 0
};

var setting_list_view = {
	name: 'setting_list_view',
	noFooter: true,
	noHeader: true,
	onLoad: function (p) {
		$this.loaded();
	},

	drawContent: function (w, l) {
		// every time when you click it, the numebr will increase
		$h1({'data-state': 'newOrders'}, w).bind('click', () => {
			$app.setState(state => ({newOrders: state.newOrders + 1}));
		});
	}
}

var another_view = {
	name: 'another_view',
	noFooter: true,
	noHeader: true,
	onLoad: function (p) {
		$this.loaded();
	},

	drawContent: function (w, l) {
		// This number always stay the same as the above element
		$h1({'data-state': 'newOrders'});
	}
}

```