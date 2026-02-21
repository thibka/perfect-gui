import Button from './components/Button.js';
import Slider from './components/Slider.js';
import Image from './components/Image.js';
import Toggle from './components/Toggle.js';
import List from './components/List.js';
import Color from './components/Color.js';
import Vector2 from './components/Vector2.js';
import styles from './styles/styles.js';

export default class GUI {
    constructor(options = {}) {
        this.firstParent = this;

        if (options.container) {
            this.container =
                typeof options.container == 'string'
                    ? document.querySelector(options.container)
                    : options.container;
            this.position_type = 'absolute';
        } else {
            this.container = document.body;
            this.position_type = 'fixed';
        }

        this.propReferences = [];
        this.folders = [];

        if (options.isFolder) {
            this._folderConstructor(options.folderOptions);
            return;
        }

        if (typeof options.onUpdate == 'function') {
            this.onUpdate = options.onUpdate;
        }

        this.label =
            options != undefined && typeof options.label == 'string'
                ? options.label
                : '';
        this.backgroundColor = options.color || null;
        this.opacity = options.opacity || 1;

        if (this.container == document.body) {
            this.maxHeight = window.innerHeight;
        } else {
            this.maxHeight = Math.min(
                this.container.clientHeight,
                window.innerHeight,
            );
        }
        if (options.maxHeight) {
            this.initMaxHeight = options.maxHeight;
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }

        this.screenCorner = this._parseScreenCorner(options.position);

        if (!window.perfectGUI) {
            window.perfectGUI = {};
        }
        if (window.perfectGUI.instanceCounter == undefined) {
            window.perfectGUI.instanceCounter = 0;
        } else {
            window.perfectGUI.instanceCounter++;
        }
        this.instanceId = window.perfectGUI.instanceCounter;

        this.wrapperWidth = options.width || 290;
        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('id', 'lm-gui-stylesheet');
        document.head.append(this.stylesheet);

        // Common styles
        if (this.instanceId == 0) {
            this._addStyles(`${styles(this.position_type)}`);
        }

        // Instance specific styles
        this._styleInstance();

        this._addWrapper();
        this.wrapper.setAttribute('data-corner-x', this.screenCorner.x);
        this.wrapper.setAttribute('data-corner-y', this.screenCorner.y);

        if (options.autoRepositioning != false) {
            window.addEventListener('resize', this._handleResize.bind(this));
        }
        this._handleResize();

        this.hasBeenDragged = false;
        if (options.draggable == true) this._makeDraggable();

        this.closed = false;
        if (options.closed) this.toggleClose();
    }

    _styleInstance() {
        let scrollbar_width = this._getScrollbarWidth(this.container);
        if (this.screenCorner.x == 'left') {
            this.xOffset = 0;
        } else {
            this.xOffset =
                this.container.clientWidth -
                this.wrapperWidth -
                scrollbar_width;
        }

        if (this.instanceId > 0) {
            let existingDomInstances =
                this.container.querySelectorAll('.p-gui');
            for (let i = 0; i < existingDomInstances.length; i++) {
                if (
                    this.screenCorner.y ==
                    existingDomInstances[i].dataset.cornerY
                ) {
                    if (
                        this.screenCorner.x == 'left' &&
                        existingDomInstances[i].dataset.cornerX == 'left'
                    ) {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } else if (
                        this.screenCorner.x == 'right' &&
                        existingDomInstances[i].dataset.cornerX == 'right'
                    ) {
                        this.xOffset -= existingDomInstances[i].offsetWidth;
                    }
                }
            }
        }
        this.yOffset = 0;
        this.position = {
            prevX: this.xOffset,
            prevY: this.yOffset,
            x: this.xOffset,
            y: this.yOffset,
        };

        this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${this.screenCorner.y == 'top' ? '' : 'top: auto; bottom: 0;'}
            ${this.backgroundColor ? 'background: ' + this.backgroundColor + ';' : ''}
            opacity: ${this.opacity};
        }`);
    }

    _folderConstructor(folderOptions) {
        this.domElement = folderOptions.wrapper;
        this.isFolder = true;
        this.parent = folderOptions.parent;
        this.firstParent = folderOptions.firstParent;
        this.wrapper = folderOptions.inner;
    }

    _parseScreenCorner(position) {
        let parsedPosition = { x: 'right', y: 'top' };

        if (position == undefined) return parsedPosition;
        else if (typeof position != 'string')
            console.error('[perfect-gui] Position must be a string.');

        if (position.includes('left')) parsedPosition.x = 'left';
        if (position.includes('bottom')) parsedPosition.y = 'bottom';

        return parsedPosition;
    }

    _getScrollbarWidth(element) {
        if (element === document.body) {
            return window.innerWidth - document.documentElement.clientWidth;
        } else {
            return element.offsetWidth - element.clientWidth;
        }
    }

    _handleResize() {
        if (this.container == document.body) {
            this.maxHeight = window.innerHeight;
        } else {
            this.maxHeight = Math.min(
                this.container.clientHeight,
                window.innerHeight,
            );
        }
        if (this.initMaxHeight) {
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }
        this.wrapper.style.maxHeight = this.maxHeight + 'px';

        if (this.hasBeenDragged) {
            return;
        }

        let scrollbar_width = this._getScrollbarWidth(this.container);
        this.xOffset =
            this.screenCorner.x == 'left'
                ? 0
                : this.container.clientWidth -
                this.wrapperWidth -
                scrollbar_width;
        if (this.instanceId > 0) {
            let existingDomInstances = this.container.querySelectorAll(
                `.p-gui:not(#${this.wrapper.id}):not([data-dragged])`,
            );
            for (let i = 0; i < existingDomInstances.length; i++) {
                let instanceId = parseInt(
                    existingDomInstances[i].id.replace('p-gui-', ''),
                );
                if (instanceId > this.instanceId) break;
                if (
                    this.screenCorner.y ==
                    existingDomInstances[i].dataset.cornerY
                ) {
                    if (
                        this.screenCorner.x == 'left' &&
                        existingDomInstances[i].dataset.cornerX == 'left'
                    ) {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } else if (
                        this.screenCorner.x == 'right' &&
                        existingDomInstances[i].dataset.cornerX == 'right'
                    ) {
                        this.xOffset -= existingDomInstances[i].offsetWidth;
                    }
                }
            }
        }
        this.position = {
            prevX: this.xOffset,
            prevY: this.yOffset,
            x: this.xOffset,
            y: this.yOffset,
        };
        this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
    }

    _addStyles(styles) {
        this.stylesheet.innerHTML += styles;
    }

    _addWrapper() {
        this.domElement = document.createElement('div');
        this.domElement.id = 'p-gui-' + this.instanceId;
        this.domElement.className = 'p-gui';
        this.domElement.setAttribute('data-lenis-prevent', '');
        this.container.append(this.domElement);

        this.header = document.createElement('div');
        this.header.className = 'p-gui__header';
        this.header.textContent = this.label;
        this.header.style = `${this.backgroundColor ? 'border-color: ' + this.backgroundColor + ';' : ''}`;
        this.domElement.append(this.header);

        const close_btn = document.createElement('div');
        close_btn.className = 'p-gui__header-close';
        close_btn.addEventListener('click', this.toggleClose.bind(this));
        this.header.append(close_btn);

        const content = document.createElement('div');
        content.className = 'p-gui__content';
        this.domElement.append(content);

        this.wrapper = document.createElement('div');
        this.wrapper.className = 'p-gui__inner';
        content.append(this.wrapper);
    }

    button(params = {}, callback) {
        this.imageContainer = null;
        const el = new Button(this, params, callback);
        return el;
    }

    image(params = {}, callback) {
        if (!this.imageContainer) {
            this.imageContainer = document.createElement('div');
            this.imageContainer.className = 'p-gui__image-container';
            this.wrapper.append(this.imageContainer);
        }
        const el = new Image(this, params, callback);
        return el;
    }

    slider(params = {}, callback) {
        this.imageContainer = null;
        const el = new Slider(this, params, callback);
        return el;
    }

    toggle(params = {}, callback) {
        this.imageContainer = null;
        const el = new Toggle(this, params, callback);
        this.wrapper.append(el);
        return el;
    }

    list(params = {}, callback) {
        this.imageContainer = null;
        const el = new List(this, params, callback);
        return el;
    }

    color(params = {}, callback) {
        this.imageContainer = null;
        const el = new Color(this, params, callback);
        return el;
    }

    vector2(params = {}, callback) {
        this.imageContainer = null;
        const el = new Vector2(this, params, callback);
        return el;
    }

    folder(options = {}) {
        let closed =
            typeof options.closed == 'boolean' ? options.closed : false;
        let label = options.label || '';
        let color = options.color || null;
        let maxHeight = options.maxHeight || null;

        this.imageContainer = null;

        let className = 'p-gui__folder';

        if (this.folders.length == 0) {
            className += ' p-gui__folder--first';
        }

        if (closed) {
            className += ' p-gui__folder--closed';
        }

        let container_style = color ? `background-color: ${color};` : '';
        container_style += maxHeight ? `max-height: ${maxHeight}px;` : '';

        const container = document.createElement('div');
        container.className = className;
        container.style = container_style;
        this.wrapper.append(container);

        const folderHeader = document.createElement('div');
        folderHeader.innerHTML = `<span class="p-gui__folder-arrow"></span>${label}`;
        folderHeader.className = 'p-gui__folder-header';
        container.append(folderHeader);

        const folderContent = document.createElement('div');
        folderContent.className = 'p-gui__folder-content';
        container.append(folderContent);

        const folderInner = document.createElement('div');
        folderInner.className = 'p-gui__folder-inner';
        folderContent.append(folderInner);

        folderHeader.addEventListener('click', () => {
            container.classList.toggle('p-gui__folder--closed');
        });

        let folder = new GUI({
            isFolder: true,
            folderOptions: {
                wrapper: container,
                inner: folderInner,
                parent: this,
                firstParent: this.firstParent,
            },
        });
        this.folders.push(folder);
        return folder;
    }

    _makeDraggable() {
        var that = this;
        this.header.addEventListener('pointerdown', dragMouseDown);
        this.header.addEventListener('pointerup', dragMouseUp);

        function dragMouseDown(ev) {
            ev.preventDefault();

            that.position.initX = that.position.x;
            that.position.initY = that.position.y;

            that.position.prevX = ev.clientX;
            that.position.prevY = ev.clientY;

            document.addEventListener('pointermove', dragElement);
        }

        function dragElement(ev) {
            ev.preventDefault();
            if (!that.hasBeenDragged) {
                that.hasBeenDragged = true;
                that.domElement.setAttribute('data-dragged', 'true');
            }

            that.position.x =
                that.position.initX + ev.clientX - that.position.prevX;
            that.position.y =
                that.position.initY + ev.clientY - that.position.prevY;

            that.domElement.style.transform =
                'translate3d(' +
                that.position.x +
                'px,' +
                that.position.y +
                'px,0)';
        }

        function dragMouseUp(ev) {
            document.removeEventListener('pointermove', dragElement);
        }
    }

    toggleClose() {
        this.closed = !this.closed;

        if (this.closed) {
            this.previousInnerScroll = this.wrapper.scrollTop;
            this.wrapper.scrollTo(0, 0);
        } else {
            this.wrapper.scrollTo(0, this.previousInnerScroll);
        }

        this.domElement.classList.toggle('p-gui--collapsed');
    }

    kill() {
        this.domElement.remove();
    }

    _mapLinear(x, a1, a2, b1, b2) {
        return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
    }

    _countDecimals(num) {
        // Convert the number to a string
        const numStr = num.toString();

        // Find the position of the decimal point
        const decimalIndex = numStr.indexOf('.');

        // If there is no decimal point, return 0
        if (decimalIndex === -1) {
            return 0;
        }

        // Calculate the number of digits after the decimal point
        const decimalPlaces = numStr.length - decimalIndex - 1;

        return decimalPlaces;
    }

    static registerPlugin(plugin) {
        for (let i in plugin) {
            GUI.prototype[i] = plugin[i];
        }
    }
}
