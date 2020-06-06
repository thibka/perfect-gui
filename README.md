# perfect-gui
Nice and simple GUI for JavaScript including:  
- image buttons 
- multiple panels
- draggable panels

<img src="https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/capture.png" width="464"/>  

## Demo
[Demo 1](https://projects.thibautfoussard.com/square_noise/)
[Demo 2](https://thibka.github.io/perfect-gui/public/)

## Installing

### NPM
```bash
npm i perfect-gui
```
### CDN (ES6)
```html
<script src="https://cdn.jsdelivr.net/npm/perfect-gui@2.2.5/src/es6/index.min.js"></script>
```
### CDN (ES5)
```html
<script src="https://cdn.jsdelivr.net/npm/perfect-gui@2.2.6/src/es5/perfect-gui-es5.min.js"></script>
```


## Usage

```javascript
import perfectGUI from 'perfect-gui';

const gui = new perfectGUI({
    name: 'My GUI', // optional
    width: 250,     // optional, default is 290
    closed: false   // optional, default is false
});
```
<table>
<tr><th>Method</th><th>Arguments</th><th>Example</th></tr>
<tr><td>addButton</td><td>text: string,<br>callback: function</td><td>

```javascript
gui.addButton('Click me!', function() {
    ...
});
```
</td></tr>
<tr><td>addImage</td><td>text: string,<br>path: string,<br>callback: function</td><td>

```javascript
gui.addImage('Click this', 'path/to/image', function {
    ...
});
```
</td></tr>
<tr><td>addSlider</td><td>text: string,<br>sliderParams: object<br>callback: function</td><td>

```javascript
gui.addSlider('Slide this', { min: 0, max: 10, value: 5, step: .1 }, function(value) {
    console.log('Slider value : ' + value);
});
```
</td></tr>
<tr><td>addSwitch</td><td>text: string,<br>defaultVal: boolean<br>callback: function</td><td>

```javascript
gui.addSwitch('Switch me!', true, function(state) {
    console.log('Switched boolean value: ' + state);
});
```
</td></tr>
<tr><td>addList</td><td>text: string,<br>list: array,<br>callback: function</td><td>

```javascript
gui.addList('Select one', ['apple', 'lime', 'peach'], function(item) {
    console.log('Selected item: ' + item);
});
```
</td></tr>
<tr><td>toggleClose</td><td></td><td>

```javascript
gui.toggleClose();
```
</td></tr>
</table>

## Example

```javascript
const gui = new perfectGUI();

gui.addButton('Click me', doSomething);

function doSomething() {
    alert('button clicked');
}
```