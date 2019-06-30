# perfect-gui
Nice and simple GUI for JavaScript.

[Demo](https://thibka.github.io/perfect-gui/public/)

## Installing

### ES5
```html
<script src="https://cdn.jsdelivr.net/npm/perfect-gui@2.1.1/src/es5/perfect-gui-es5.min.js"></script>
```

### ES6
```bash
npm i perfect-gui
```

```javascript
import perfectGUI from 'perfect-gui';
```

## Usage

```javascript
const gui = new perfectGUI({
    name: 'My GUI', // optional
    width: 250,     // optional, default is 290,
    closed: true    // optional, default is false
});
```

```javascript
gui.addButton('Click me!', callback);

gui.addImage('Click this', 'path/to/image', callback);

gui.addSlider('Slide this', { min: 0, max: 10, value: 5, step: .1 }, function(value) {
    console.log('Slider value : ' + value);
});

gui.addSwitch('Switch me!', true, function(state) {
    console.log('Switch boolean value: ' + state);
});

gui.addList('Select one', ['apple', 'banana', 'peach'], function(item) {
    console.log('Selected item: ' + item);
});

gui.toggleClose();
```
