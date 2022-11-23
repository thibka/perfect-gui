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

        this.maxHeight = Math.min(this.container.clientHeight, window.innerHeight)
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
        if (this.screenCorner.x == 'left') {
            this.xOffset = 0;
        } else {
            this.xOffset = this.container.clientWidth - this.wrapperWidth - this._getScrollbarWidth(this.container);
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
        this.maxHeight = Math.min(this.initMaxHeight, Math.min(this.container.clientHeight, window.innerHeight));

        if (this.hasBeenDragged) {
            return;
        }

        this.xOffset = this.screenCorner.x == 'left' ? 0 : this.container.clientWidth - this.wrapperWidth;
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

    button(text, callback) {
        let params = {
            text: text,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            callback: 'function'
        }, params);

        this.imageContainer = null;

        this._createElement({
            class: 'p-gui__button',
            onclick: params.callback,
            textContent: params.text
        })
    }
    
    image(text, path, callback) {
        let params = {
            text: text,
            path: path,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            path: 'string',
            callback: 'function'
        }, params);
                
        if (!this.imageContainer) {
            this.imageContainer = this._createElement({
                class: 'p-gui__image-container'
            });
        }
        
        // Image
        var image = this._createElement({
            class: 'p-gui__image',
            inline: `background-image: url(${params.path})`,
            parent: this.imageContainer
        })
        
        // Text inside image
        this._createElement({
            parent: image,
            class: 'p-gui__image-text',
            textContent: params.text
        })    
        
        image.onclick = () => params.callback({ path: params.path, text: params.text });
    }
    
    slider (params, callback) {
        let isObject = false;
        let propReferenceIndex = null;
        let object; 
        let prop;
        
        const min = params.min ?? 0;
        const max = params.max ?? 1;
        const step = params.step || (max - min) / 100;

        if ( typeof params.value == 'number' ) {
            this._checkMandatoryParams({
                value: 'number'
            }, params);
        } else {
            object = params.obj || params.object;
            prop = params.prop || params.property;
            
            this._checkMandatoryParams({
                object: 'object',
                prop: 'string'
            }, {object, prop});

            propReferenceIndex = this.propReferences.push(object[prop]) - 1;
            isObject = true;
        }

        this.imageContainer = null;
    
        var container = this._createElement({
            class: 'p-gui__slider',
            textContent: params.name || prop
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
                value: isObject ? object[prop] : params.value
            }
        });
    
        var slider_value = this._createElement({
            parent: container,
            class: 'p-gui__slider-value',
            textContent: isObject ? String(object[prop]) : String(params.value)
        });
    
        slider_ctrl.addEventListener('input', () => {
            slider_value.textContent = slider_ctrl.value;

            if ( isObject ) {
                object[prop] = slider_ctrl.value;
            }

            if (typeof callback == "function") {
                callback(parseFloat(slider_ctrl.value));
            }            
        });

        if ( isObject ) {
            Object.defineProperty( object, prop, {
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

    toggle(text, state, callback) {
        let params = {
            text: text,
            state: state,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            state: 'boolean',
            callback: 'function'
        }, params);

        this.imageContainer = null;

        let switchContainer = this._createElement({
            class: 'p-gui__switch',
            onclick: (ev) => {
                let checkbox = ev.target.childNodes[1], 
                    state = true;
                if (checkbox.classList.contains('p-gui__switch-checkbox--active')) {
                    state = false;
                }
                checkbox.classList.toggle('p-gui__switch-checkbox--active')
                params.callback(state)
            },
            textContent: params.text
        });

        let activeClass = state ? " p-gui__switch-checkbox--active" : "";

        this._createElement({
            parent: switchContainer,
            class: "p-gui__switch-checkbox" + activeClass
        });
    }

    list(text, list, callback) {
        let params = {
            text: text,
            list: list,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            list: 'object',
            callback: 'function'
        }, params);

        this.imageContainer = null;

        let container = this._createElement({
            class: 'p-gui__list',
            textContent: params.text
        });

        let select = this._createElement({
            parent: container,
            el: 'select',
            class: 'p-gui__list-dropdown',
            onchange: (ev) => {
                params.callback(ev.target.value);
            }
        });

        list.forEach(item => {
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

    vector2(text, data, callback) {
        this._checkMandatoryParams({
            text: 'string',
            data: 'object',
        }, {
            text,
            data,
        });

        const minX = data.x.min ?? 0;
        const maxX = data.x.max ?? 1;
        const minY = data.y.min ?? 0;
        const maxY = data.y.max ?? 1;

        const objectX = data.x.obj || data.x.object;
        const propX = data.x.prop || data.x.property;
        const propXReferenceIndex = this.propReferences.push(objectX[propX]) - 1;
        
        const objectY = data.y.obj || data.y.object;
        const propY = data.y.prop || data.y.property;
        const propYReferenceIndex = this.propReferences.push(objectY[propY]) - 1;

        this.imageContainer = null;

        const container = this._createElement({
            class: 'p-gui__vector2',
            textContent: text
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

    color(text, value, callback) {
        const container = this._createElement({
            el: 'div',
            class: 'p-gui__color',
            textContent: text,
        });

        const colorpicker = this._createElement({
            parent: container,
            el: 'input',
            class: 'p-gui__color-picker',
            type: 'color',
            value
        });

        if (callback) {
            colorpicker.addEventListener('input', () => {
                callback(colorpicker.value);
            });
        }
    }

    folder(options = {}) {
        let closed = typeof options.closed == 'boolean' ? options.closed : false;
        let name = options.name || '';
        let color = options.color || null;

        this.imageContainer = null;

        let className = 'p-gui__folder';
        
        if (this.folders.length == 0) {
            className += ' p-gui__folder--first';
        }
        
        if (closed) {
            className += ' p-gui__folder--closed';
        }
        
        let container = this._createElement({
            class: className,
            inline: color ? `background-color: ${color};`: null,
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
    
    _checkMandatoryParams(mandatoryParams, params) {
        var errors = [];
        for (var i in mandatoryParams) {
            let typeTest = typeof params[i] == mandatoryParams[i];
            if (!typeTest) {
                errors.push(i);
            }
        };
        if (errors.length > 0) {
            errors.forEach(error => {
                throw Error(`[GUI] Missing '${error}' parameter`);
            })
        }
    }
    
    _makeDraggable() {
        var that = this;
        this.header.addEventListener('mousedown', dragMouseDown);
        this.header.addEventListener('mouseup', dragMouseUp);
    
        function dragMouseDown(ev) {             
            ev.preventDefault();
            
            that.position.initX = that.position.x;
            that.position.initY = that.position.y;  

            that.position.prevX = ev.clientX;
            that.position.prevY = ev.clientY;  

            document.addEventListener('mousemove', dragElement);
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
            document.removeEventListener('mousemove', dragElement);
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