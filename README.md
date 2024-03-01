# Perfect GUI
A nice, simple and (probably not) perfect GUI for JavaScript.

## API
[Documentation](https://thibka.github.io/perfect-gui/public/)


## Features
- image buttons 
- multiple panels
- easy positioning
- draggable panels
- two-dimensional vector visualization

<img src="https://raw.githubusercontent.com/thibka/thibka.github.io/master/perfect-gui/_data/capture.3.gif" width="700"/>  

## Install

### With NPM

```bash
npm i perfect-gui
```

### Import from a CDN

```javascript
<script type="importmap">
  {
    "imports": {
      "perfect-gui": "https://unpkg.com/perfect-gui@latest/dist/perfect-gui.mjs",
    }
  }
</script>
```

## Hello world

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

    onUpdate: () => {
      // Callback function triggered each time this GUI instance is updated.    
    }
});
```

## [Methods](https://thibka.github.io/perfect-gui/public/)

* [button](https://thibka.github.io/perfect-gui/public/#button)
* [slider](https://thibka.github.io/perfect-gui/public/#slider)
* [toggle](https://thibka.github.io/perfect-gui/public/#toggle)
* [list](https://thibka.github.io/perfect-gui/public/#list)
* [image](https://thibka.github.io/perfect-gui/public/#image)
* [color](https://thibka.github.io/perfect-gui/public/#color)
* [vector2](https://thibka.github.io/perfect-gui/public/#vector2)
* [folder](https://thibka.github.io/perfect-gui/public/#folder)
* [toggleClose](https://thibka.github.io/perfect-gui/public)