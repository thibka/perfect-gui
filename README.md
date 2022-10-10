# perfect-gui
Nice and simple GUI for JavaScript.

Features:  
- image buttons 
- multiple panels
- easy positioning
- draggable panels

<img src="https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/capture.png" width="464"/>  

## Demo
https://thibka.github.io/perfect-gui/public/

## Install

### NPM
```bash
npm i perfect-gui
```
```javascript
import GUI from 'perfect-gui';
```

## Usage

```javascript
const gui = new GUI();

gui.button('Click me', callback);

```

## Options
```javascript
const gui = new GUI({
    name: 'My GUI',
    // Name of the panel. 
    // Default is null.

    container: '#container',
    // Element containing the GUI
    // Default is document.body
    
    width: 250,
    // Width of the panel (in pixels). 
    // Default is 290.
    
    closed: false, 
    // Defines whether the panel should be open or closed by default. 
    // Default is false (open).

    position: 'bottom right',
    // Defines where to place the panel on screen.
    // Accepted values are 'top', 'bottom', 'left' and 'right' 
    // in no particular order ('bottom right' = 'right bottom').
    // If multiple instances have the same position, they will be stacked horizontally.
    // Default is 'top left'.

    draggable: false,
    // Defines if the panel can be manually moved across the screen.
    // Default is false.

    autoRepositioning: true
    // If set to true, the panel position will be reset when the screen is resized.
    // If a panel has been dragged, it won't be be affected.
    // Default is true.
});
```

## Methods
<table>
<tr><th>Method</th><th>Example</th></tr>
<tr><td>button</td><td>

```javascript
gui.button('Click me!', () => {
    ...
});
```
</td></tr>
<tr><td>image</td><td>

```javascript
gui.image('Click this', 'path/to/image', () => {
    ...
});
```
</td></tr>
<tr><td>slider</td><td>

```javascript
// Simple slider, only returns a value to the callback
gui.slider('Slide this', { value: 5, min: 0, max: 10, step: .1 }, value => {
    console.log('Slider value : ' + value);
});

// Object-based slider, automatically updates the value of the object property.
// Directly updating the property will also update the slider.
gui.slider('Slide this', { object: foo, prop: 'bar', min: 0, max: 10, step: .1 });
```
</td></tr>
<tr><td>toggle</td><td>

```javascript
gui.toggle('Toggle me!', true, state => {
    console.log('Toggle boolean value: ' + state);
});
```
</td></tr>
<tr><td>list</td><td>

```javascript
gui.list('Select one', ['apple', 'lime', 'peach'], function(item) {
    console.log('Selected item: ' + item);
});
```
</td></tr>
<tr><td>vector2</td><td>

```javascript
let folder = gui.vector2('Position', { 
    x: { object: myObject.position, prop: 'x', min: -10, max: 10 },
    y: { object: myObject.position, prop: 'y', min: -10, max: 10 },
});
```
</td></tr>
<tr><td>folder</td><td>

```javascript
let folder = gui.folder('folder name', { 
    closed: false // default is false
});
folder.button('click me!', callback);
```
</td></tr>
<tr><td>toggleClose</td><td>

```javascript
gui.toggleClose();
```
</td></tr>
</table>


## To do
- Adding scrollbars if window is too short
- Adding color palette component