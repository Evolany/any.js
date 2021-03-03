# popup


### show popup
```
$pop('popup_id', [
    $header("welcome"),
    $section([
        $p("hi there")
    ]),
    $footer([
        $button("ok")
    ])
])

```

### close popup
```
$pop("popup_id")
```