import Button from './components/Button';
import Slider from './components/Slider';
import styles from './styles/styles';

export default class GUI {
    constructor(options = {}) {
        this.firstParent = this;

        if ( options.container ) {
            this.container = typeof options.container == "string" ? document.querySelector(options.container) : options.container;
            this.position_type = 'absolute';
        } else {
            this.container = document.body;
            this.position_type = 'fixed';
        }

        this.propReferences = [];
        this.folders = [];

        if ( options.isFolder ) {
            this._folderConstructor(options.folderOptions);
            return;
        }

        if ( typeof options.onUpdate == 'function' ) {
            this.onUpdate = options.onUpdate;
        }

        this.label = (options != undefined && typeof options.label == "string") ? options.label : ''; 
        this.backgroundColor = options.color || null; 
        this.opacity = options.opacity || 1;

        if (this.container == document.body) {
            this.maxHeight = window.innerHeight;
        } else {
            this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight)
        }
        if ( options.maxHeight ) {
            this.initMaxHeight = options.maxHeight;
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }

        this.screenCorner = this._parseScreenCorner(options.position);

        if (!window.perfectGUI) {
            window.perfectGUI = {};
        } 
        if ( window.perfectGUI.instanceCounter == undefined ) {
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
            this.xOffset = this.container.clientWidth - this.wrapperWidth - scrollbar_width;
        }

        if (this.instanceId > 0) {
            let existingDomInstances = this.container.querySelectorAll('.p-gui');
            for (let i = 0; i < existingDomInstances.length; i++) {
                if (this.screenCorner.y == existingDomInstances[i].dataset.cornerY) {
                    if (this.screenCorner.x == 'left' && existingDomInstances[i].dataset.cornerX == 'left') {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } 
                    else if (this.screenCorner.x == 'right' && existingDomInstances[i].dataset.cornerX == 'right') {
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
            y: this.yOffset
        };

        this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${ this.screenCorner.y == 'top' ? '' : 'top: auto; bottom: 0;' }
            ${ this.backgroundColor ? 'background: ' + this.backgroundColor + ';' : '' }
            opacity: ${this.opacity};
        }`);
    }

    _folderConstructor(folderOptions) {
        this.wrapper = folderOptions.wrapper;
        this.isFolder = true;
        this.parent = folderOptions.parent;
        this.firstParent = folderOptions.firstParent;
    }

    _parseScreenCorner(position) {
        let parsedPosition = {x: 'right', y: 'top'};

        if (position == undefined) return parsedPosition;
        else if (typeof position != 'string') console.error('[perfect-gui] Position must be a string.');

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
            this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight)
        }
        if (this.initMaxHeight) {
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }
        this.wrapper.style.maxHeight = this.maxHeight + 'px';

        if (this.hasBeenDragged) {
            return;
        }

        let scrollbar_width = this._getScrollbarWidth(this.container);
        this.xOffset = this.screenCorner.x == 'left' ? 0 : this.container.clientWidth - this.wrapperWidth - scrollbar_width;
        if (this.instanceId > 0) {
            let existingDomInstances = this.container.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);
            for (let i = 0; i < existingDomInstances.length; i++) {
                let instanceId = parseInt(existingDomInstances[i].id.replace('p-gui-', ''));
                if (instanceId > this.instanceId) break;
                if (this.screenCorner.y == existingDomInstances[i].dataset.cornerY) {
                    if (this.screenCorner.x == 'left' && existingDomInstances[i].dataset.cornerX == 'left') {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } 
                    else if (this.screenCorner.x == 'right' && existingDomInstances[i].dataset.cornerX == 'right') {
                        this.xOffset -= existingDomInstances[i].offsetWidth;
                    }
                }
            }
        }
        this.position = {prevX:this.xOffset, prevY:this.yOffset, x:this.xOffset, y:this.yOffset};
        this.wrapper.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
    }
    
    _addStyles(styles) {
        this.stylesheet.innerHTML += styles;
    }
    
    _addWrapper() {
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'p-gui-'+this.instanceId;
        this.wrapper.className = 'p-gui';
        this.wrapper.setAttribute('data-lenis-prevent', '');
        this.container.append(this.wrapper);      
    
        this.header = document.createElement('div');
        this.header.className = 'p-gui__header';
        this.header.textContent = this.label;
        this.header.style = `${ this.backgroundColor ? 'border-color: ' + this.backgroundColor + ';' : ''}`;
        this.wrapper.append(this.header);
    
        const close_btn = document.createElement('div');
        close_btn.className = 'p-gui__header-close';
        close_btn.addEventListener('click', this.toggleClose.bind(this));
        this.header.append(close_btn);
    }

    button (params = {}, callback) {
        const el = new Button(this, params, callback);
        this.wrapper.append(el);
    }
    
    image(params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] image() first parameter must be an object. Received: ${typeof params}.`);
        }
        
        let path;
        if (typeof params.path == 'string') {
            path = params.path;
        } else {
            if (typeof params.path == undefined) {
                throw Error(`[GUI] image() path must be provided.`);
            } else {
                throw Error(`[GUI] image() path must be a string.`);
            }
        }
        let filename = path.replace(/^.*[\\\/]/, '');
        let label;
        if (params.label == undefined) {
            label = filename;
        } else {
            label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        }

        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        const selected = params.selected === true;
        const selectionBorder = params.selectionBorder !== false;
        
        // width & height options
        let inline_styles = '';
        if (params.width) {
            if (typeof params.width == 'number') {
                params.width += 'px';
            }
            inline_styles += `flex: 0 0 calc(${params.width} - 5px); `;
        }
        
        if (params.height) {
            if (typeof params.height == 'number') {
                params.height += 'px';
            }
            inline_styles += `height: ${params.height}; `;
        }
                
        if (!this.imageContainer) {
            this.imageContainer = document.createElement('div');
            this.imageContainer.className = 'p-gui__image-container';
            this.wrapper.append(this.imageContainer);
        }

        // Image button
        const image = document.createElement('div');
        image.className = 'p-gui__image';
        image.style = 'background-image: url(' + path + '); ' + inline_styles;
        if ( tooltip ) {
            image.setAttribute('title', tooltip);
        }
        this.imageContainer.append(image);

        if (selected && selectionBorder) {
            image.classList.add('p-gui__image--selected');
        }
        
        // Text inside image
        const text = document.createElement('div');
        text.className = 'p-gui__image-text';
        text.textContent = label;
        image.append(text);
        
        image.addEventListener('click', () => {
            let selected_items = image.parentElement.querySelectorAll('.p-gui__image--selected');
            for (let i = 0; i < selected_items.length; i++) {
                selected_items[i].classList.remove('p-gui__image--selected');
            }
            if (selectionBorder) {
                image.classList.add('p-gui__image--selected');
            }
            if (typeof callback == 'function') {
                callback({ path, text: label });
            }
            if (this.onUpdate) {
                this.onUpdate();
            } else if (this.isFolder && this.firstParent.onUpdate) {
                this.firstParent.onUpdate();
            }
        });

        return image;
    }

    slider (params = {}, callback) {
        const el = new Slider(this, params, callback);
        this.wrapper.append(el);
    }

    toggle(params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof params}.`);
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        let isObject = false;
        let propReferenceIndex = null;
        let obj = params.obj; 
        let prop = params.prop;
        let value = typeof params.value === 'boolean' ? params.value : null;

        // callback mode
        if ( value !== null ) {
            if (prop != undefined || obj != undefined) {
                console.warn(`[GUI] toggle() "obj" and "prop" parameters are ignored when a "value" parameter is used.`);
            }
        }

        // object-binding
        else if (prop != undefined && obj != undefined) {
            if (typeof prop != 'string') {
                throw Error(`[GUI] toggle() "prop" parameter must be an string. Received: ${typeof prop}.`);
            }
            if (typeof obj != 'object') {
                throw Error(`[GUI] toggle() "obj" parameter must be an object. Received: ${typeof obj}.`);
            }

            if (label == ' ') {
                label = prop;
            }

            propReferenceIndex = this.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }
        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] toggle() "obj" and "prop" parameters must be used together.`);
            }
        }

        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        this.imageContainer = null;

        const container = document.createElement('div');
        container.textContent = label;
        container.className = 'p-gui__toggle';
        if ( tooltip ) {
            container.setAttribute('title', tooltip);
        }
        this.wrapper.append(container);

        container.addEventListener('click', (ev) => {
            const checkbox = ev.target.childNodes[1];
            
            let value = true;
            
            if (checkbox.classList.contains('p-gui__toggle-checkbox--active')) {
                value = false;
            }
            
            checkbox.classList.toggle('p-gui__toggle-checkbox--active');

            if ( isObject ) {
                obj[prop] = value;
            }
            
            else {
                if (typeof callback == 'function') {
                    callback(value);
                }
            }

            if (this.onUpdate) {
                this.onUpdate();
            } else if (this.isFolder && this.firstParent.onUpdate) {
                this.firstParent.onUpdate();
            }
        });

        let activeClass = (() => {
            if (!isObject) {
                return value ? ' p-gui__toggle-checkbox--active' : '';
            } else {
                return obj[prop] ? ' p-gui__toggle-checkbox--active' : '';
            }
        })();

        const checkbox = document.createElement('div');
        checkbox.className = 'p-gui__toggle-checkbox' + activeClass;
        container.append(checkbox);

        if ( isObject ) {
            Object.defineProperty( obj, prop, {
                set: val => { 
                    this.propReferences[propReferenceIndex] = val;

                    if (val) {
                        checkbox.classList.add('p-gui__toggle-checkbox--active');
                    } else {
                        checkbox.classList.remove('p-gui__toggle-checkbox--active');
                    }

                    if (typeof callback == 'function') {
                        callback(val);
                    }
                },
                get: () => { 
                    return this.propReferences[propReferenceIndex];
                }
            });
        }
    }

    list(params = {}, callback) {  
        if (typeof params != 'object') {
            throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof params}.`);
        }

        let label = typeof params.label == 'string' ? params.label : ' ';
        let isObject = false;
        let propReferenceIndex = null;
        let obj = params.obj; 
        let prop = params.prop;
        let values = Array.isArray(params.values) ? params.values : null;
        let value;
        let objectValues = typeof values[0] == 'string' ? false : true;
        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        callback = typeof callback == 'function' ? callback : null;

        // callback mode
        if ( params.value !== undefined || 
            (params.value === undefined && obj === undefined && prop === undefined)) {
            if (prop != undefined || obj != undefined) {
                console.warn(`[GUI] list() "obj" and "prop" parameters are ignored when a "value" parameter is used.`);
            }

            value = (() => {
                if (!values) {
                    return null;
                }
                if (typeof params.value == 'string') {
                    return values.indexOf(params.value);
                }
                if (typeof params.value == 'number') {
                    return params.value;
                }
            })();
        }

        // object-binding mode
        else if (prop != undefined && obj != undefined) {
            if (typeof prop != 'string') {
                throw Error(`[GUI] list() "prop" parameter must be an string. Received: ${typeof prop}.`);
            }
            if (typeof obj != 'object') {
                throw Error(`[GUI] list() "obj" parameter must be an object. Received: ${typeof obj}.`);
            }

            value = (() => {                
                if (!values) {
                    return null;
                }
                if (typeof obj[prop] == 'string') {
                    if ( !objectValues ) { // values is an array of strings
                        return values.indexOf(obj[prop]);
                    }
                    else { // values is an array of objects
                        return values.find(item => item.value === obj[prop]).value;
                    }
                }
                if (typeof obj[prop] == 'number') {
                    if ( !objectValues ) { // values is an array of strings
                        return obj[prop];
                    }
                    else { // values is an array of objects
                        return values.find(item => item.value === obj[prop]).value;
                    }
                }
            })();

            propReferenceIndex = this.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }

        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] list() "obj" and "prop" parameters must be used together.`);
            }
        }

        this.imageContainer = null;

        let container = document.createElement('div');
        container.className = 'p-gui__list';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.wrapper.append(container);

        let select = document.createElement('select');
        container.append(select);
        select.className = 'p-gui__list-dropdown';
        select.addEventListener('change', (ev) => {
            if ( isObject ) {
                obj[prop] = ev.target.value;
            }

            else if (callback) {
                callback(ev.target.value);
            }

            if (this.onUpdate) {
                this.onUpdate();
            } else if (this.isFolder && this.firstParent.onUpdate) {
                this.firstParent.onUpdate();
            }
        });

        if (values) 
        {
            values.forEach((item, index) => 
            {
                const optionName = objectValues ? item.label : item;
                const optionValue = objectValues ? item.value : item;
                let option = document.createElement('option');
                option.setAttribute('value', optionValue);
                option.textContent = optionName;
                select.append(option);

                if (!objectValues && value == index || objectValues && value == optionValue) {
                    option.setAttribute('selected', '');
                }
            });
        }

        if ( isObject ) {
            Object.defineProperty( obj, prop, {
                set: val => {
                    let newIndex, newValue, newObj; 
                    if (objectValues) {
                        newObj = values.find(item => {
                            return item.value == val;
                        });
                        newValue = newObj?.value || values[0].value;
                        newIndex = values.indexOf(newObj);
                    } else {
                        if (typeof val == 'string') {
                            newIndex = values.indexOf(val);
                            newValue = val;
                        }
                        if (typeof val == 'number') {
                            newIndex = val;
                            newValue = values[val];
                        }
                    }
                    
                    this.propReferences[propReferenceIndex] = objectValues ? newValue : val;

                    const previousSelection = select.querySelector('[selected]');
                    if ( previousSelection ) {
                        previousSelection.removeAttribute('selected')
                    }
                    select.querySelectorAll('option')[newIndex].setAttribute('selected', '');
                    
                    if (typeof callback == 'function') {
                        if (objectValues) {
                            callback(newObj, newIndex);
                        } else {
                            callback(newValue, newIndex);
                        }
                    }
                },
                get: () => { 
                    return this.propReferences[propReferenceIndex];
                }
            });
        }
    }

    color(params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof params}.`);
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';

        let isObject = false;
        let propReferenceIndex = null;
        let obj = params.obj; 
        let prop = params.prop;
        let value;
        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        if (typeof params.value == 'string') {
            if (params.value.length != 7 || params.value[0] != '#') {
                console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${params.value}".`)
            }
            else {
                value = params.value;
            }
        }
        if (!value) value = '#000000';

        // callback mode
        if ( params.value !== undefined ) {
            if (prop != undefined || obj != undefined) {
                console.warn(`[GUI] color() "obj" and "prop" parameters are ignored when a "value" parameter is used.`);
            }
        }

        // object-binding
        else if (prop != undefined && obj != undefined) {
            if (typeof prop != 'string') {
                throw Error(`[GUI] color() "prop" parameter must be an string. Received: ${typeof prop}.`);
            }
            if (typeof obj != 'object') {
                throw Error(`[GUI] color() "obj" parameter must be an object. Received: ${typeof obj}.`);
            }

            if (label == ' ') {
                label = prop;
            }

            propReferenceIndex = this.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }
        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] color() "obj" and "prop" parameters must be used together.`);
            }
        }

        this.imageContainer = null;

        const container = document.createElement('div');
        container.className = 'p-gui__color';
        container.textContent = label;
        if ( tooltip ) {
            container.setAttribute('title', tooltip);
        }
        this.wrapper.append(container);

        const colorpicker = document.createElement('input');
        colorpicker.className = 'p-gui__color-picker';
        colorpicker.setAttribute('type', 'color');
        colorpicker.value = value;
        container.append(colorpicker);

        if (typeof callback == 'function') {
            colorpicker.addEventListener('input', () => {
                if ( isObject ) {
                    obj[prop] = colorpicker.value;
                }

                else if (typeof callback == 'function') {
                    callback(colorpicker.value);
                }

                if (this.onUpdate) {
                    this.onUpdate();
                } else if (this.isFolder && this.firstParent.onUpdate) {
                    this.firstParent.onUpdate();
                }
            });
        }

        if ( isObject ) {
            Object.defineProperty( obj, prop, {
                set: val => { 
                    this.propReferences[propReferenceIndex] = val;

                    colorpicker.value = val;

                    if (typeof callback == 'function') {
                        callback(val);
                    }
                },
                get: () => { 
                    return this.propReferences[propReferenceIndex];
                }
            });
        }
    }

    vector2( params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof params}.`);
        }
    
        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
    
        const minX = params.x.min ?? 0;
        const maxX = params.x.max ?? 1;
        const minY = params.y.min ?? 0;
        const maxY = params.y.max ?? 1;
        const stepX = params.x.step || (maxX - minX) / 100;
        const stepY = params.y.step || (maxY - minY) / 100;
        const decimalsX = this._countDecimals(stepX);
        const decimalsY = this._countDecimals(stepY);
    
        const objectX = params.x.obj;
        const propX = params.x.prop;
        const propXReferenceIndex = this.propReferences.push(objectX[propX]) - 1;
        
        const objectY = params.y.obj;
        const propY = params.y.prop;
        const propYReferenceIndex = this.propReferences.push(objectY[propY]) - 1;
    
        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);
    
        callback = typeof callback == 'function' ? callback : null;
    
        this.imageContainer = null;
    
        const container = document.createElement('div');
        container.className = 'p-gui__vector2';
        container.textContent = label;
        if ( tooltip ) {
            container.setAttribute('title', tooltip);
        }
        this.wrapper.append(container);
    
        const vector_value = document.createElement('div');
        vector_value.className = 'p-gui__vector-value';
        vector_value.textContent = objectX[propX] + ', ' + objectY[propY];
        container.append(vector_value);
    
        const area = document.createElement('div');
        area.className = 'p-gui__vector2-area';
        container.append(area);
        area.addEventListener('click', evt => {
            const newX = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX));
            const newY = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY));
            objectX[propX] = newX.toFixed(decimalsX);
            objectY[propY] = newY.toFixed(decimalsY);
    
            if (callback) {
                callback(objectX[propX], objectX[propY]);
            }
    
            if (this.onUpdate) {
                this.onUpdate();
            } else if (this.isFolder && this.firstParent.onUpdate) {
                this.firstParent.onUpdate();
            }
        });
        
        let pointer_is_down = false;
        area.addEventListener('pointerdown', (evt) => {
            pointer_is_down = true;
        });
        area.addEventListener('pointerup', () => {
            pointer_is_down = false;
        });
        area.addEventListener('pointermove', (evt) => {
            if (pointer_is_down) {
                const newX = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX));
                const newY = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY));
                objectX[propX] = newX.toFixed(decimalsX);
                objectY[propY] = newY.toFixed(decimalsY);
    
                if (callback) {
                    callback(objectX[propX], objectX[propY]);
                }
    
                if (this.onUpdate) {
                    this.onUpdate();
                } else if (this.isFolder && this.firstParent.onUpdate) {
                    this.firstParent.onUpdate();
                }
            }
        });
    
        const line_x = document.createElement('div');
        line_x.className = 'p-gui__vector2-line p-gui__vector2-line-x';
        area.append(line_x);
    
        const line_y = document.createElement('div');
        line_y.className = 'p-gui__vector2-line p-gui__vector2-line-y';
        area.append(line_y);
    
        const dot = document.createElement('div');
        dot.className = 'p-gui__vector2-dot';
        area.append(dot);
    
        dot.style.left = this._mapLinear(objectX[propX], minX, maxX, 0, area.clientWidth) + 'px';
        dot.style.top = this._mapLinear(objectY[propY], minY, maxY, area.clientHeight, 0) + 'px';
    
        Object.defineProperty( objectX, propX, {
            set: val => { 
                this.propReferences[propXReferenceIndex] = val;
                dot.style.left = this._mapLinear(val, minX, maxX, 0, area.clientWidth) + 'px';
                vector_value.textContent = String( val ) + ', ' + objectY[propY];
            },
            get: () => { 
                return this.propReferences[propXReferenceIndex];
            }
        });
    
        Object.defineProperty( objectY, propY, {
            set: val => { 
                this.propReferences[propYReferenceIndex] = val;
                dot.style.top = this._mapLinear(val, minY, maxY, area.clientHeight, 0) + 'px';
                vector_value.textContent = objectX[propX] + ', ' + String( val );
            },
            get: () => { 
                return this.propReferences[propYReferenceIndex];
            }
        });
    }

    folder(options = {}) {
        let closed = typeof options.closed == 'boolean' ? options.closed : false;
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
        folderHeader.addEventListener('click', () => {
            container.classList.toggle('p-gui__folder--closed');
        });

        let folder = new GUI({isFolder: true, folderOptions: {
            wrapper: container,
            parent: this,
            firstParent: this.firstParent
        }});
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
                that.wrapper.setAttribute('data-dragged', 'true')
            }
    
            that.position.x = that.position.initX + ev.clientX - that.position.prevX;
            that.position.y = that.position.initY + ev.clientY - that.position.prevY;
    
            that.wrapper.style.transform = "translate3d("+that.position.x + "px,"+that.position.y + "px,0)";
        }

        function dragMouseUp(ev) {
            document.removeEventListener('pointermove', dragElement);
        }
    }

    toggleClose() {
        this.closed = !this.closed;
        
        if (this.closed) {
            this.previousInnerScroll = this.wrapper.scrollTop;
            this.wrapper.scrollTo(0,0);
        } else {
            this.wrapper.scrollTo(0,this.previousInnerScroll);
        }
        
        this.wrapper.classList.toggle('p-gui--collapsed');
    }

    kill() {
        this.wrapper.remove();
    }

    _mapLinear( x, a1, a2, b1, b2 ) {
        return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
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