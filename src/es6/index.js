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
            let previousInstances = document.getElementsByClassName('lm_gui');
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
        this._addStyles(`#lm_gui-${this.instanceId} {
            width: ${this.wrapperWidth};
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
        }`);
                
        this._addWrapper();
    
        this._makeDraggable();

        this.closed = false;
        if (options.closed) this.toggleClose();
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
            id: 'lm_gui-'+this.instanceId,
            class: 'lm_gui'
        });        
    
        this.header = this._createElement({
            parent: this.wrapper,
            class: 'lm_gui__header',
            textContent: this.name
        });
    
        this._createElement({
            parent: this.header,
            class: 'lm_gui__header-close',
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
            class: 'lm_gui__button',
            onclick: params.callback,
            textContent: params.text
        })
    }
    
    addImage(params) {
        // Image
        var element = this._createElement({
            class: 'lm_gui__item',
            onclick: params.onclick,
            inline: `background-image: url(${params.image})`
        })
    
        // Text inside image
        this._createElement({
            parent: element,
            class: 'lm_gui__item-text',
            textContent: params.text
        })    
    }
    
    addSlider (params) {
        this._checkMandatoryParams({
            text: 'string',
            min: 'number',
            max: 'number'
        }, params);
    
        var container = this._createElement({
            class: 'lm_gui__slider',
            onclick: params.onclick,
            textContent: params.text
        });
    
        var ctrl = this._createElement({
            parent: container,
            el: 'input',
            class: 'lm_gui__slider-ctrl',
            customAttributes: {
                type: 'range',
                min: params.min,
                max: params.max,
                step: params.step,
                value: params.value
            }
        });
    
        var val = this._createElement({
            parent: container,
            class: 'lm_gui__slider-value',
            textContent: params.value
        });
    
        ctrl.addEventListener('input', function() {
            val.textContent = ctrl.value;
            if (typeof params.oninput == "function") params.oninput(ctrl.value);
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
        this.wrapper.classList.toggle('lm_gui--collapsed');
    }
}