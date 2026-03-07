<div align="center">
  <h1>Perfect GUI</h1>
  <p>A nice, simple and (probably not so) perfect GUI for JavaScript.</p>
  
  <p>
    <a href="https://thibka.github.io/perfect-gui/"><b>Documentation & Live Examples</b></a>
  </p>
</div>

## Features

- **Simplicity first**: Extremely easy to setup and use, inspired by timeless classics like `dat.gui` and `lil.gui`.
- **Modern UI**: Clean, customizable, and polished design right out of the box.
- **Rich Inputs**: Support for sliders, buttons, color pickers, vectors, images, lists, and toggles.
- **Folders**: Easily group and organize your controls in collapsible sections.
- **Draggable & Auto-positioned**: Snap it to screen edges or let the user drag it anywhere.
- **Data Binding**: Automatically sync your controls with object properties.
- **Zero Dependencies**: Lightweight and built with vanilla JavaScript.

## Installation

**With NPM:**

```bash
npm i perfect-gui
```

**From a CDN (ES Modules):**

For a quick setup without build tools, use an import map:

```html
<script type="importmap">
    {
        "imports": {
            "perfect-gui": "https://unpkg.com/perfect-gui@latest/dist/perfect-gui.js"
        }
    }
</script>

<script type="module">
    import GUI from 'perfect-gui';

    const gui = new GUI();
    gui.button('Click me!', () => alert('Hello world!'));
</script>
```

## Quick Start

Creating a control panel is as simple as instantiating the GUI and adding some components:

```javascript
import GUI from 'perfect-gui';

// 1. Create a new GUI instance
const gui = new GUI({
    label: 'My Settings',
    position: 'top right',
});

// 2. Add a simple button
gui.button('Click me', () => {
    console.log('Button clicked!');
});

// 3. Add a slider connected to an object value natively
const params = { opacity: 0.5 };
gui.slider({ obj: params, prop: 'opacity', min: 0, max: 1 }, (val) => {
    document.body.style.opacity = val;
});

// 4. Group controls in a folder
const folder = gui.folder({ label: 'Advanced' });
folder.color({ label: 'Color', value: '#bada55' }, (color) => {
    document.body.style.backgroundColor = color;
});
```

## Configuration Options

You can customize the GUI by passing an options object to the constructor:

```javascript
const gui = new GUI({
    label: 'My GUI', // Name of the panel (default: null)
    container: '#container', // Element containing the GUI (default: document.body)
    width: 250, // Width of the panel in pixels (default: 290)
    maxHeight: 500, // Max height beyond which scrolling is necessary
    closed: false, // Start closed? (default: false)
    position: 'bottom right', // Position ('top', 'bottom', 'left', 'right')
    draggable: false, // Can it be manually moved? (default: false)
    autoRepositioning: true, // Reset position on window resize? (default: true)
    color: '#bada55', // Accent color
    onUpdate: () => {
        // Callback function triggered each time any GUI instance is updated
    },
});
```

## API / Available Components

See the [Documentation](https://thibka.github.io/perfect-gui/) for a comprehensive list of properties and usage.

- [`button()`](https://thibka.github.io/perfect-gui/public/#button)
- [`slider()`](https://thibka.github.io/perfect-gui/public/#slider)
- [`toggle()`](https://thibka.github.io/perfect-gui/public/#toggle)
- [`list()`](https://thibka.github.io/perfect-gui/public/#list)
- [`image()`](https://thibka.github.io/perfect-gui/public/#image)
- [`color()`](https://thibka.github.io/perfect-gui/public/#color)
- [`vector2()`](https://thibka.github.io/perfect-gui/public/#vector2)
- [`folder()`](https://thibka.github.io/perfect-gui/public/#folder)
- [`toggleClose()`](https://thibka.github.io/perfect-gui/public)
