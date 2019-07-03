import styles from './styles';

export default class GUI {
    constructor(options) {
        this.name = (options != undefined && typeof options.name == "string") ? options.name : ''; 

        if (this instanceof GUI) {
            if (typeof GUI[GUI.instanceCounter] != 'number') GUI[GUI.instanceCounter] = 0;
            else GUI[GUI.instanceCounter]++;
        }        
        this.instanceId = GUI[GUI.instanceCounter];

        this.xOffset = 0;
        if (this.instanceId > 0) {
            let previousInstances = document.getElementsByClassName('p-gui');
            for (let i = 0; i < previousInstances.length; i++) {
                this.xOffset += previousInstances[i].offsetWidth;
            }
        }
        this.yOffset = 0;
        
        this.position = {prevX:this.xOffset, prevY:this.yOffset, x:this.xOffset, y:this.yOffset};
        this.wrapperWidth = (options != undefined && options.width) ? options.width+'px' : '290px';
        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('id', 'lm-gui-stylesheet');
        document.head.append(this.stylesheet);
        
        // Common styles
        if (this.instanceId == 0) this._addStyles(`${styles}`);
        
        // Instance styles
        this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth};
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
        }`);
                
        this._addWrapper();
    
        this._makeDraggable();

        this.closed = false;
        if (options != undefined && options.closed) this.toggleClose();
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

        // Image
        var element = this._createElement({
            class: 'p-gui__item',
            onclick: params.callback,
            inline: `background-image: url(${params.path})`
        })
    
        // Text inside image
        this._createElement({
            parent: element,
            class: 'p-gui__item-text',
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