# perfect-gui
Nice and simple GUI for JavaScript including:  
- image buttons 
- multiple panels
- draggable panels

<img src="https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/capture.png" width="464"/>  

## Demo
[Demo 1](https://projects.thibautfoussard.com/square_noise/)
[Demo 2](https://thibka.github.io/perfect-gui/public/)

## Install

### NPM
```bash
npm i perfect-gui
```
```javascript
import perfectGUI from 'perfect-gui';
```

## Usage

```javascript
const gui = new perfectGUI();

gui.addButton('Click me', doSomething);

function doSomething() {
    alert('button clicked');
}
```

## Options
```javascript
const gui = new perfectGUI({
    name: 'My GUI',
    // Name of the panel. 
    // Default is null.
    
    width: 250,
    // Width of the panel (in pixels). 
    // Default is 290.
    
    closed: false, 
    // Defines whether the panel should be open or closed on load. 
    // Default is false (open).

    position: 'bottom right',
    // Defines where to position the panel on screen.
    // Accepted values are 'top', 'bottom', 'left' and 'right' in no particular order ('bottom right' = 'right bottom').
    // If multiple instances have the same position, they will stack horizontally.
    // Default is 'top left'.
});
```

## Methods
<table>
<tr><th>Method</th><th>Example</th></tr>
<tr><td>addButton</td><td>

```javascript
gui.addButton('Click me!', function() {
    ...
});
```
</td></tr>
<tr><td>addImage</td><td>

```javascript
gui.addImage('Click this', 'path/to/image', function {
    ...
});
```
</td></tr>
<tr><td>addSlider</td><td>

```javascript
gui.addSlider('Slide this', { min: 0, max: 10, value: 5, step: .1 }, function(value) {
    console.log('Slider value : ' + value);
});
```
</td></tr>
<tr><td>addSwitch</td><td>

```javascript
gui.addSwitch('Switch me!', true, function(state) {
    console.log('Switched boolean value: ' + state);
});
```
</td></tr>
<tr><td>addList</td><td>

```javascript
gui.addList('Select one', ['apple', 'lime', 'peach'], function(item) {
    console.log('Selected item: ' + item);
});
```
</td></tr>
<tr><td>toggleClose</td><td>

```javascript
gui.toggleClose();
```
</td></tr>
</table>
