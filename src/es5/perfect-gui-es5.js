(function (window, document, undefined) {

    function GUI(options) {
        this.name = (options != undefined && typeof options.name == "string") ? options.name : '';
        
        if (this instanceof GUI) {
            if (typeof GUI[GUI.instanceCounter] != 'number') GUI[GUI.instanceCounter] = 0;
            else GUI[GUI.instanceCounter]++;
        }
        this.instanceId = GUI[GUI.instanceCounter];

        this.xOffset = 0;
        if (this.instanceId > 0) {
            var previousInstances = document.getElementsByClassName('p-gui');
            for (var i = 0; i < previousInstances.length; i++) {
                this.xOffset += previousInstances[i].offsetWidth;
            }
        }
        this.yOffset = 0;

        this.position = { prevX: this.xOffset, prevY: this.yOffset, x: this.xOffset, y: this.yOffset };
        this.wrapperWidth = (options != undefined && options.width) ? options.width + 'px' : '290px';
        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('id', 'lm-gui-stylesheet');
        document.head.append(this.stylesheet);

        // Common styles
        if (this.instanceId == 0) this._addStyles('.p-gui{position:fixed;top:0;left:0;transform:translate3d(0,0,0);padding:25px 10px 10px 10px;background:rgba(51,51,51,.9);display:flex;flex-wrap:wrap;font-family:Verdana,Arial,sans-serif;width:290px;overflow:hidden;box-shadow:0 0 10px #000;box-sizing:border-box}.p-gui--collapsed{height:0;padding:21px 10px 0 10px}.p-gui__header{position:absolute;top:0;left:0;width:100%;height:20px;background-color:#111;border-bottom:1px solid #484848;cursor:grab;color:grey;font-size:10px;line-height:20px;padding-left:8px;box-sizing:border-box}.p-gui__header-close{width:20px;height:20px;position:absolute;top:0;right:0;cursor:pointer;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABFJREFUCNdjIAb8//8BjIkAAOrOBd3TR0jRAAAAAElFTkSuQmCC);background-size:50% 50%;background-position:center;background-repeat:no-repeat}.p-gui--collapsed .p-gui__header-close{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABVJREFUCNdjYEhgIIj///8AwsSoBQD43QydY5mb0QAAAABJRU5ErkJggg==)}.p-gui__item{width:80px;height:80px;background-size:cover;margin:5px 5px 21px 5px;cursor:pointer;position:relative}.p-gui__item-text{position:absolute;bottom:-15px;color:#eee;font-size:11px;text-shadow:0 -1px 0 #111}.p-gui__button,.p-gui__list,.p-gui__switch{width:100%;margin:5px;padding:7px;background:#1b1b1b;font-size:11px;color:#fff;border-bottom:1px solid #00ff89;cursor:pointer;position:relative}.p-gui__list{cursor:default}.p-gui__button:hover,.p-gui__switch:hover{background:#101010}.p-gui__switch-checkbox{width:5px;height:5px;background-color:#343434;position:absolute;top:0;right:8px;bottom:0;margin:auto;border-radius:50%;pointer-events:none}.p-gui__switch-checkbox--active{background-color:#00ff89;box-shadow:0 0 5px #00ff89}.p-gui__list-dropdown{position:absolute;right:5px;top:0;bottom:0;margin:auto;height:18px;cursor:pointer}.p-gui__slider{width:100%;margin:5px 5px 10px 5px;padding:7px;background:#1b1b1b;font-size:11px;color:#fff;position:relative}.p-gui__slider-ctrl{-webkit-appearance:none;padding:0;font:inherit;outline:0;opacity:.8;background:#00a1ff;box-sizing:border-box;cursor:pointer;position:absolute;bottom:-5px;right:0;height:5px;width:100%;margin:0}.p-gui__slider-ctrl::-webkit-slider-runnable-track{height:12px;border:none;border-radius:0;background-color:transparent}.p-gui__slider-ctrl::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:inherit;border:none;border-radius:50%;background:#fff;border:2px solid #00a1ff}.p-gui__slider-value{display:inline-block;position:absolute;right:7px}');

        // Instance styles
        this._addStyles('#p-gui-'+this.instanceId+' { width: '+this.wrapperWidth+'; transform: translate3d('+this.xOffset+'px,'+this.yOffset+'px,0); }');

        this._addWrapper();

        this._makeDraggable();

        this.closed = false;
        if (options.closed) this.toggleClose();
    }

    GUI.prototype._createElement = function (element) {
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

    GUI.prototype._addStyles = function (styles) {
        this.stylesheet.innerHTML += styles;
    }

    GUI.prototype._addWrapper = function () {
        this.wrapper = this._createElement({
            parent: document.body,
            id: 'p-gui-' + this.instanceId,
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

    GUI.prototype.addButton = function (text, callback) {
        var params = {
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

    GUI.prototype.addImage = function (text, path, callback) {
        var params = {
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
            inline: 'background-image: url('+params.path+')'
        })

        // Text inside image
        this._createElement({
            parent: element,
            class: 'p-gui__item-text',
            textContent: params.text
        })
    }

    GUI.prototype.addSlider = function (text, sliderParams, callback) {
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

        ctrl.addEventListener('input', function () {
            val.textContent = ctrl.value;
            if (typeof callback == "function") callback(ctrl.value);
        });
    }

    GUI.prototype.addSwitch = function(text, state, callback) {
        var params = {
            text: text,
            state: state,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            state: 'boolean',
            callback: 'function'
        }, params);

        var switchContainer = this._createElement({
            class: 'p-gui__switch',
            onclick: function(ev) {
                var checkbox = ev.target.childNodes[1], 
                    state = true;
                if (checkbox.classList.contains('p-gui__switch-checkbox--active')) {
                    state = false;
                }
                checkbox.classList.toggle('p-gui__switch-checkbox--active')
                params.callback(state)
            },
            textContent: params.text
        });

        var activeClass = state ? " p-gui__switch-checkbox--active" : "";

        this._createElement({
            parent: switchContainer,
            class: "p-gui__switch-checkbox" + activeClass
        });
    }

    GUI.prototype.addList = function(text, list, callback) {
        var params = {
            text: text,
            list: list,
            callback: callback
        };
        this._checkMandatoryParams({
            text: 'string',
            list: 'object',
            callback: 'function'
        }, params);

        var container = this._createElement({
            class: 'p-gui__list',
            textContent: params.text
        });

        var select = this._createElement({
            parent: container,
            el: 'select',
            class: 'p-gui__list-dropdown',
            onchange: function(ev) {
                params.callback(ev.target.value);
            }
        });

        list.forEach(function(item) {
            this._createElement({
                parent: select,
                el: 'option',
                customAttributes: {
                    value: item,
                },
                textContent: item
            });
        }.bind(this));
    }

    GUI.prototype._checkMandatoryParams = function (mandatoryParams, params) {
        var errors = [];
        for (var i in mandatoryParams) {
            var typeTest = typeof params[i] == mandatoryParams[i];
            if (!typeTest) {
                errors.push(i);
            }
        };
        if (errors.length > 0) {
            errors.forEach(function(error) {
                throw Error("[GUI] Missing '"+error+"' parameter");
            })
        }
    }
    
    GUI.prototype._makeDraggable = function () {
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
            
            that.wrapper.style.transform = "translate3d(" + that.position.x + "px," + that.position.y + "px,0)";
        }
        
        function dragMouseUp(ev) {
            document.removeEventListener('mousemove', dragElement);
        }
    }
    
    GUI.prototype.toggleClose = function () {
        this.closed = !this.closed;
        this.wrapper.classList.toggle('p-gui--collapsed');
    }
    
    window.perfectGUI = GUI;

}) (window, document);