import styles from './styles';

export default class GUI {
    constructor(options = {}) {
        // Process options
        if ( options.container ) {
            this.container = typeof options.container == "string" ? document.querySelector(options.container) : options.container;
            this.position_type = 'absolute';
        } else {
            this.container = document.body;
            this.position_type = 'fixed';
        }

        this.propReferences = [];

        if ( options.isFolder ) {
            this._folderConstructor(options.folderOptions);
            return;
        }

        this.name = (options != undefined && typeof options.name == "string") ? options.name : ''; 
        
        this.backgroundColor = options.color || null; 

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

        if ( this instanceof GUI ) {
            if ( typeof GUI[GUI.instanceCounter] != 'number' ) {
                GUI[GUI.instanceCounter] = 0;
            }
            else {
                GUI[GUI.instanceCounter]++;
            }
        }        
        this.instanceId = GUI[GUI.instanceCounter];
        
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

        this.folders = [];
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
        }`);
    }

    _folderConstructor(folderOptions) {
        this.wrapper = folderOptions.wrapper;
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

    _createElement(element) {
        element.el = element.el || 'div';
        var domElement = document.createElement(element.el);
        if (element.id) domElement.id = element.id;
        if (element.class) domElement.className = element.class;
        if (element.inline) domElement.style = element.inline;
        if (element.href) domElement.href = element.href;
        if (element.onclick) domElement.onclick = element.onclick;
        if (element.onchange) domElement.onchange = element.onchange;
        if (element.textContent) domElement.textContent = element.textContent;
        if (element.innerHTML) domElement.innerHTML = element.innerHTML;
        if (element.type) domElement.type = element.type;
        if (element.value) domElement.value = element.value;
        if (element.customAttributes) {
            for (var i in element.customAttributes) {
                domElement.setAttribute(i, element.customAttributes[i]);
            }
        }
        element.parent = element.parent ? element.parent : this.wrapper;
        element.parent.append(domElement);
        return domElement;
    }
    
    _addStyles(styles) {
        this.stylesheet.innerHTML += styles;
    }
    
    _addWrapper() {
        this.wrapper = this._createElement({
            parent: this.container,
            id: 'p-gui-'+this.instanceId,
            class: 'p-gui'
        });        
    
        this.header = this._createElement({
            parent: this.wrapper,
            class: 'p-gui__header',
            textContent: this.name,
            inline: `${ this.backgroundColor ? 'border-color: ' + this.backgroundColor + ';' : ''}`
        });
    
        this._createElement({
            parent: this.header,
            class: 'p-gui__header-close',
            onclick: this.toggleClose.bind(this)
        });
    }

    button(name, callback) {
        if (typeof name != 'string') {
            if (typeof name == 'object' && name?.hasOwnProperty('name')) {
                name = name.name;
            } else {
                name = ' ';
            }
        }
        if (name === '') {
            name = ' ';
        }

        this.imageContainer = null;

        if (typeof callback != 'function') {
            callback = () => {};
        }
        
        this._createElement({
            class: 'p-gui__button',
            textContent: name,
            onclick: callback
        });
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
        let name;
        if (params.name == undefined) {
            name = filename;
        } else {
            name = typeof params.name == 'string' ? params.name || ' ' : ' ';
        }
                
        if (!this.imageContainer) {
            this.imageContainer = this._createElement({
                class: 'p-gui__image-container'
            });
        }
        
        // Image
        var image = this._createElement({
            class: 'p-gui__image',
            inline: `background-image: url(${path})`,
            parent: this.imageContainer
        })
        
        // Text inside image
        this._createElement({
            parent: image,
            class: 'p-gui__image-text',
            textContent: name
        })    
        
        if (typeof callback == 'function') {
            image.onclick = () => callback({ path, text: name });
        }
    }
    
    slider (params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof params}.`);
        }

        let name = typeof params.name == 'string' ? params.name || ' ' : ' ';
        let isObject = false;
        let propReferenceIndex = null;
        let obj = params.obj || params.object; 
        let prop = params.prop || params.property;
        let value = typeof params.value == 'number' ? params.value : null;
        let min = params.min ?? 0;
        let max = params.max ?? 1;
        let step = params.step || (max - min) / 100;

        // callback mode
        if ( value !== null ) {
            if (prop != undefined || obj != undefined) {
                console.warn(`[GUI] slider() "obj" and "property" parameters are ignored when a "value" parameter is used.`);
            }
        }
        // object-binding
        else if (prop != undefined && obj != undefined) {
            if (typeof prop != 'string') {
                throw Error(`[GUI] slider() "prop" (or "property") parameter must be an string. Received: ${typeof prop}.`);
            }
            if (typeof obj != 'object') {
                throw Error(`[GUI] slider() "obj" (or "object") parameter must be an object. Received: ${typeof obj}.`);
            }

            if (name == ' ') {
                name = prop;
            }

            propReferenceIndex = this.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }
        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] slider() "obj" and "prop" parameters must be used together.`);
            }

            value = (max - min) / 2;
        }

        this.imageContainer = null;
    
        var container = this._createElement({
            class: 'p-gui__slider',
            textContent: name
        });
    
        var slider_ctrl = this._createElement({
            parent: container,
            el: 'input',
            class: 'p-gui__slider-ctrl',
            customAttributes: {
                type: 'range',
                min,
                max,
                step,
                value: isObject ? obj[prop] : value
            }
        });
    
        var slider_value = this._createElement({
            parent: container,
            class: 'p-gui__slider-value',
            textContent: isObject ? String(obj[prop]) : String(value)
        });
    
        slider_ctrl.addEventListener('input', () => {
            slider_value.textContent = slider_ctrl.value;

            if ( isObject ) {
                obj[prop] = slider_ctrl.value;
            }

            if (typeof callback == "function") {
                callback(parseFloat(slider_ctrl.value));
            }            
        });

        if ( isObject ) {
            Object.defineProperty( obj, prop, {
                set: val => { 
                    this.propReferences[propReferenceIndex] = val;
                    slider_ctrl.value = val;
                    slider_value.textContent = String( val );
                },
                get: () => { 
                    return this.propReferences[propReferenceIndex];
                }
            });
        }
    }

    toggle(params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] toggle() first parameter must be an object. Received: ${typeof params}.`);
        }

        let name = typeof params.name == 'string' ? params.name || ' ' : ' ';
        let value = params.value === true ? true : false;

        this.imageContainer = null;

        let switchContainer = this._createElement({
            class: 'p-gui__switch',
            onclick: (ev) => {
                let checkbox = ev.target.childNodes[1], 
                    value = true;
                if (checkbox.classList.contains('p-gui__switch-checkbox--active')) {
                    value = false;
                }
                checkbox.classList.toggle('p-gui__switch-checkbox--active');
                if (typeof callback == 'function') {
                    callback(value);
                }
            },
            textContent: name
        });

        let activeClass = value ? ' p-gui__switch-checkbox--active' : '';

        this._createElement({
            parent: switchContainer,
            class: 'p-gui__switch-checkbox' + activeClass
        });
    }

    list(params = {}, callback) {  
        if (typeof params != 'object') {
            throw Error(`[GUI] list() first parameter must be an object. Received: ${typeof params}.`);
        }

        let name = typeof params.name == 'string' ? params.name : ' ';
        let values = Array.isArray(params.values) ? params.values : null;
        callback = typeof callback == 'function' ? callback : null;

        this.imageContainer = null;

        let container = this._createElement({
            class: 'p-gui__list',
            textContent: name
        });

        let select = this._createElement({
            parent: container,
            el: 'select',
            class: 'p-gui__list-dropdown',
            onchange: (ev) => {
                if (callback) {
                    callback(ev.target.value);
                }
            }
        });

        values.forEach(item => {
            this._createElement({
                parent: select,
                el: 'option',
                customAttributes: {
                    value: item,
                },
                textContent: item
            });
        });
    }

    options(params, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] options() first parameter must be an object. Received: ${typeof params}.`);
        }
        this.list(params, callback);
    }

    vector2( params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] vector2() first parameter must be an object. Received: ${typeof params}.`);
        }

        let name = typeof params.name == 'string' ? params.name || ' ' : ' ';

        const minX = params.x.min ?? 0;
        const maxX = params.x.max ?? 1;
        const minY = params.y.min ?? 0;
        const maxY = params.y.max ?? 1;

        const objectX = params.x.obj || params.x.object;
        const propX = params.x.prop || params.x.property;
        const propXReferenceIndex = this.propReferences.push(objectX[propX]) - 1;
        
        const objectY = params.y.obj || params.y.object;
        const propY = params.y.prop || params.y.property;
        const propYReferenceIndex = this.propReferences.push(objectY[propY]) - 1;

        callback = typeof callback == 'function' ? callback : null;

        this.imageContainer = null;

        const container = this._createElement({
            class: 'p-gui__vector2',
            textContent: name
        });

        const vector_value = this._createElement({
            parent: container,
            class: 'p-gui__vector-value',
            textContent: objectX[propX] + ', ' + objectY[propY]
        });

        const area = this._createElement({
            parent: container,
            el: 'div',
            class: 'p-gui__vector2-area',
            onclick: (evt) => {
                objectX[propX] = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX).toFixed(1));
                objectY[propY] = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY).toFixed(1));

                if (callback) {
                    callback(objectX[propX], objectX[propY]);
                }
            },
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
                objectX[propX] = parseFloat(this._mapLinear(evt.offsetX, 0, area.clientWidth, minX, maxX).toFixed(1));
                objectY[propY] = parseFloat(this._mapLinear(evt.offsetY, 0, area.clientHeight, maxY, minY).toFixed(1));

                if (callback) {
                    callback(objectX[propX], objectX[propY]);
                }
            }
        });

        this._createElement({
            parent: area,
            class: 'p-gui__vector2-line p-gui__vector2-line-x'
        });
        
        this._createElement({
            parent: area,
            class: 'p-gui__vector2-line p-gui__vector2-line-y'
        });

        const dot = this._createElement({
            parent: area,
            class: 'p-gui__vector2-dot'
        });

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

    color(params = {}, callback) {
        if (typeof params != 'object') {
            throw Error(`[GUI] color() first parameter must be an object. Received: ${typeof params}.`);
        }

        let name = typeof params.name == 'string' ? params.name || ' ' : ' ';
        let value;
        if (typeof params.value == 'string') {
            if (params.value.length != 7 || params.value[0] != '#') {
                console.error(`[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${params.value}".`)
            }
            else {
                value = params.value;
            }
        }
        if (!value) value = '#000000';

        const container = this._createElement({
            el: 'div',
            class: 'p-gui__color',
            textContent: name,
        });

        const colorpicker = this._createElement({
            parent: container,
            el: 'input',
            class: 'p-gui__color-picker',
            type: 'color',
            value
        });

        if (typeof callback == 'function') {
            colorpicker.addEventListener('input', () => {
                callback(colorpicker.value);
            });
        }
    }

    folder(options = {}) {
        let closed = typeof options.closed == 'boolean' ? options.closed : false;
        let name = options.name || '';
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
        
        let container = this._createElement({
            class: className,
            inline: container_style,
        });
        
        let folderHeader = this._createElement({
            innerHTML: `<span class="p-gui__folder-arrow"></span>${name}`,
            class: 'p-gui__folder-header',
            onclick: function() {
                this.parentNode.classList.toggle('p-gui__folder--closed');
            },
            parent: container
        });

        let folder = new GUI({isFolder: true, folderOptions: {
            wrapper: container,
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
        this.wrapper.classList.toggle('p-gui--collapsed');
    }

    kill() {
        this.wrapper.remove();
    }

    _mapLinear( x, a1, a2, b1, b2 ) {
        return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
    }
}