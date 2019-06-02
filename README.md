# perfect-gui
Nice and simple GUI for JavaScript.

Demo : https://thibka.github.io/perfect-gui/public/

## Installing

```bash
npm i perfect-gui
```

```javascript
import perfectGUI from 'perfect-gui';

const gui = new perfectGUI();
```

## Usage

```javascript
const gui = new perfectGUI({
    name: 'My GUI', // optional
    width: 250      // optional, default is 290
});
```

```javascript
gui.addButton({
    text: "Click me!",
    onclick: () => {
        // do something cool
    }
});

gui.addImage({
    image: "path/to/image",
    text: "Click this",
    onclick: () => {                                
        // do something sweet
    }
});

gui.addSlider({
    text: "Slide this",
    min: 0,
    max: 10,
    value: 5,
    step: .1,
    oninput: (value) => {
        // do something nice
    }
});

```