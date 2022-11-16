# perfect-gui
Nice and simple GUI for JavaScript.

Features:  
- image buttons 
- multiple panels
- easy positioning
- draggable panels

<img src="https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/capture.png" width="580"/>  

## Demo
https://thibka.github.io/perfect-gui/public/

## Install

```bash
npm i perfect-gui
```

## Usage

```javascript
import GUI from 'perfect-gui';

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

    maxHeight: 500,
    // Maximum height beyond which scrolling is necessary. 
    // Default is the smallest value between the height of the window and the height of the container.
    
    closed: false, 
    // Defines whether the panel should be closed by default. 
    // Default is false.

    position: 'bottom right',
    // Defines where to place the panel on screen.
    // Accepted values are 'top', 'bottom', 'left' and 'right' in no particular order ('bottom right' = 'right bottom').
    // If multiple instances have the same position, they will be stacked horizontally.
    // Default is 'top right'.

    draggable: false,
    // Defines if the panel can be manually moved across the screen.
    // Default is false.

    autoRepositioning: true,
    // If set to true, the panel position will be reset when the screen is resized.
    // If a panel has been dragged, it won't be be affected.
    // Default is true.

    color: '#bada55',
    // Default is #2e2e2e
});
```

## Methods
<table>
<tr><th>Method</th><th>Example</th></tr>
<tr><td>button</td><td>

```javascript
gui.button('Click me!', callback);
```
</td></tr>
<tr><td>image</td><td>

```javascript
gui.image('Click this', 'path/to/image', (path) => {
    ...
});
```
</td></tr>
<tr><td>slider</td><td>

```javascript
// Simple slider, only returns a value to the callback
// min and max parameters are optional, default is 0 (min) and 1 (max)
// step parameter is optional, default is (max - min) * 0.01
gui.slider({ 
    name: 'Slide this', 
    value: 5, 
    min: 0,     // default is 0
    max: 10,    // default is 1
    step: .1    // default is (max - min) * 0.01
}, value => {   // optional callback
    console.log('Slider value : ' + value);
});

// Object-based slider, automatically updates the value of the object property.
// Directly updating the property will also update the slider.
// callback is optional
gui.slider({ 
    name 'Slide this', 
    object: foo, 
    prop: 'bar', 
    min: 0, 
    max: 10, 
    step: .1 
});
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
// min and max parameters are optional, default is 0 (min) and 1 (max)
gui.vector2('Position', { 
    x: { object: myObject.position, prop: 'x', min: -10, max: 10 },
    y: { object: myObject.position, prop: 'y', min: -10, max: 10 },
});
```
</td></tr>
<tr><td>color</td><td>

```javascript
gui.color('Color', '#ff0000', color => {
    console.log('Selected color:', color);
});
```
</td></tr>
<tr><td>folder</td><td>

```javascript
let folder = gui.folder({ 
    name: 'folder name',
    closed: false, // default is false,
    color: '#226666' // default is #434343
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
- Vector2 drag & drop
- Style list component
- Image button selection outline