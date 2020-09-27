import styles from './styles';

export default class GUI {
    constructor(options) {
        if (options == undefined) options = {};

        if (options.isFolder) {
            this._folderConstructor(options.folderOptions);
            return;
        }

        this.name = (options != undefined && typeof options.name == "string") ? options.name : ''; 

        if (this instanceof GUI) {
            if (typeof GUI[GUI.instanceCounter] != 'number') GUI[GUI.instanceCounter] = 0;
            else GUI[GUI.instanceCounter]++;
        }        
        this.instanceId = GUI[GUI.instanceCounter];
        
        this.wrapperWidth = (options != undefined && options.width) ? options.width : 290;
        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('id', 'lm-gui-stylesheet');
        document.head.append(this.stylesheet);
        
        // Common styles
        if (this.instanceId == 0) this._addStyles(`${styles}`);
       
        // Instance styles
        this.screenCorner = this._parseScreenCorner(options.position);
        this.xOffset = this.screenCorner.x == 'left' ? 0 : document.documentElement.clientWidth - this.wrapperWidth;
        if (this.instanceId > 0) {
            let existingDomInstances = document.getElementsByClassName('p-gui');
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
        this.position = {prevX:this.xOffset, prevY:this.yOffset, x:this.xOffset, y:this.yOffset};

        let verticalCSSPositioning = this.screenCorner.y == 'top' ? '' : 'top: auto; bottom: 0;';
        this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${verticalCSSPositioning}
        }`);

        if (options.autoRepositioning != false) window.addEventListener('resize', this._handleResize.bind(this));
                
        this._addWrapper();
        this.wrapper.setAttribute('data-corner-x', this.screenCorner.x);
        this.wrapper.setAttribute('data-corner-y', this.screenCorner.y);
    
        this.hasBeenDragged = false;
        if (options.draggable == true) this._makeDraggable();

        this.closed = false;
        if (options != undefined && options.closed) this.toggleClose();

        this.folders = [];
    }

    _folderConstructor(folderOptions) {
        this.wrapper = folderOptions.wrapper;
    }

    _parseScreenCorner(position) {
        let parsedPosition = {x: 'left', y: 'top'};

        if (position == undefined) return parsedPosition;
        else if (typeof position != 'string') console.error('[perfect-gui] The position option must be a string.');

        if (position.includes('right')) parsedPosition.x = 'right';
        if (position.includes('bottom')) parsedPosition.y = 'bottom';

        return parsedPosition;
    }

    _handleResize() {
        if (this.hasBeenDragged) return;

        this.xOffset = this.screenCorner.x == 'left' ? 0 : document.documentElement.clientWidth - this.wrapperWidth;
        if (this.instanceId > 0) {
            let existingDomInstances = document.querySelectorAll(`.p-gui:not(#${this.wrapper.id}):not([data-dragged])`);
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
        // DOM
        element.el = element.el ? element.el : 'div';
        var domElement = document.createElement(element.el);
        if (element.id) domElement.id = element.id;
        if (element.class) domElement.className = element.class;
        if (element.inline) domElement.style = element.inline;
        if (element.href) domElement.href = element.href;
        if (element.onclick) domElement.onclick = element.onclick;
        if (element.onchange) domElement.onchange = element.onchange;
        if (element.textContent) domElement.textContent = element.textContent;
        if (element.innerHTML) domElement.innerHTML = element.innerHTML;
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
            parent: document.body,
            id: 'p-gui-'+this.instanceId,
            class: 'p-gui'
        });        
    
        this.header = this._createElement({
            parent: this.wrapper,
            class: 'p-gui__header',
            textContent: this.name
        });
    
        this._createElement({
            parent: this.header,
            class: 'p-gui__header-close',
            onclick: this.toggleClose.bind(this)
        });
    }

    addButton(text, callback) {
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
    
    addImage(text, path, callback) {
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
            onclick: params.callback,
            inline: `background-image: url(${params.path})`,
            parent: this.imageContainer
        })
    
        // Text inside image
        this._createElement({
            parent: image,
            class: 'p-gui__image-text',
            textContent: params.text
        })    
    }
    
    addSlider (text, sliderParams, callback) {
        this._checkMandatoryParams({
            min: 'number',
            max: 'number',
            value: 'number',
            step: 'number'
        }, sliderParams);

        this.imageContainer = null;
    
        var container = this._createElement({
            class: 'p-gui__slider',
            textContent: text
        });
    
        var ctrl = this._createElement({
            parent: container,
            el: 'input',
            class: 'p-gui__slider-ctrl',
            customAttributes: {
                type: 'range',
                min: sliderParams.min,
                max: sliderParams.max,
                step: sliderParams.step,
                value: sliderParams.value
            }
        });
    
        var val = this._createElement({
            parent: container,
            class: 'p-gui__slider-value',
            textContent: sliderParams.value
        });
    
        ctrl.addEventListener('input', function() {
            val.textContent = ctrl.value;
            if (typeof callback == "function") callback(ctrl.value);
        });
    }

    addSwitch(text, state, callback) {
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

    addList(text, list, callback) {
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

    addFolder(name, open = true) {
        let params = {
            name: name,
            open: open
        };
        this._checkMandatoryParams({
            name: 'string',
            open: 'boolean'
        }, params);

        this.imageContainer = null;

        let className = 'p-gui__folder';
        if (this.folders.length == 0) className += ' p-gui__folder--first';
        if (!open) className += ' p-gui__folder--closed';
        console.log(className);
        let container = this._createElement({
            class: className
        });
        
        let folderHeader = this._createElement({
            innerHTML: `<span class="p-gui__folder-arrow"></span>${params.name}`,
            class: 'p-gui__folder-header',
            onclick: function() {
                this.parentNode.classList.toggle('p-gui__folder--closed');
            },
            parent: container
        })

        let folder = new GUI({isFolder: true, folderOptions: {
            wrapper: container
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
}