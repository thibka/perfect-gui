export default class Slider {
    constructor(parent, params = {}, callback) {
        this.parent = parent;
        this.propReferences = [];

        if (typeof params != 'object') {
            throw Error(`[GUI] slider() first parameter must be an object. Received: ${typeof params}.`);
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        this.isObject = false;
        let propReferenceIndex = null;
        this.obj = params.obj; 
        this.prop = params.prop;
        let value = typeof params.value == 'number' ? params.value : null;
        this.min = params.min ?? 0;
        this.max = params.max ?? 1;
        this.step = params.step || (this.max - this.min) / 100;
        this.decimals = this.parent._countDecimals(this.step);
        this.callback = typeof callback == 'function' ? callback : null;

        // callback mode
        if ( value !== null ) {            
            if (this.prop != undefined || this.obj != undefined) {
                console.warn(`[GUI] slider() "obj" and "prop" parameters are ignored when a "value" parameter is used.`);
            }
        }
        // object-binding
        else if (this.prop != undefined && this.obj != undefined) {
            if (typeof this.prop != 'string') {
                throw Error(`[GUI] slider() "prop" parameter must be an string. Received: ${typeof this.prop}.`);
            }
            if (typeof this.obj != 'object') {
                throw Error(`[GUI] slider() "obj" parameter must be an object. Received: ${typeof this.obj}.`);
            }

            if (label == ' ') {
                label = this.prop;
            }

            propReferenceIndex = this.propReferences.push(this.obj[this.prop]) - 1;
            this.isObject = true;
        }
        else {
            if ((this.prop != undefined && this.obj == undefined) || (this.prop == undefined && this.obj != undefined)) {
                console.warn(`[GUI] slider() "obj" and "prop" parameters must be used together.`);
            }

            value = (this.max - this.min) / 2;
        }
        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        this.parent.imageContainer = null;
    
        const container = document.createElement('div');
        container.className = 'p-gui__slider';

        if (tooltip) {
            container.setAttribute('title', tooltip);
        }

        const slider_name = document.createElement('div');
        slider_name.className = 'p-gui__slider-name';
        slider_name.textContent = label;
        container.append(slider_name);
    
        this.ctrlDiv = document.createElement('div');
        this.ctrlDiv.className = 'p-gui__slider-ctrl';
        this.ctrlDiv.setAttribute('type', 'range');
        this.ctrlDiv.setAttribute('min', this.min);
        this.ctrlDiv.setAttribute('max', this.max);
        container.append(this.ctrlDiv);

        const slider_bar = document.createElement('div');
        slider_bar.className = 'p-gui__slider-bar';
        this.ctrlDiv.append(slider_bar);

        this.handle = document.createElement('div');
        this.handle.className = 'p-gui__slider-handle';
        this.ctrlDiv.append(this.handle);

        this.filling = document.createElement('div');
        this.filling.className = 'p-gui__slider-filling';
        slider_bar.append(this.filling);

        this.valueInput = document.createElement('input');
        this.valueInput.className = 'p-gui__slider-value';
        this.valueInput.value = this.isObject ? this.obj[this.prop] : value;
        container.append(this.valueInput);

        // init position
        setTimeout(() => {
            const handleWidth = this.handle.offsetWidth;
            this.handle.position = this._mapLinear(this.valueInput.value, this.min, this.max, handleWidth / 2, 88 - handleWidth / 2);
            this.handle.position = Math.min(this.handle.position, 88 - handleWidth / 2);
            this.handle.position = Math.max(this.handle.position, handleWidth / 2);
            this.handle.style.transform = `translate(-50%, -50%) translateX(${this.handle.position}px)`;
            this.filling.style.width = `${this.handle.position}px`;
        }, 0); // wait for render

        this.valueInput.addEventListener('change', () => {
            this._updateHandlePositionFromValue();
            this._triggerCallbacks();
        })
    
        this.ctrlDiv.addEventListener('pointerdown', (evt) => {
            this.ctrlDiv.pointerDown = true;
            this.ctrlDiv.prevPosition = evt.clientX;
            this._updateHandlePositionFromPointer(evt, true);
        });

        window.addEventListener('pointerup', (evt) => {
            this.ctrlDiv.pointerDown = false;
        });

        window.addEventListener('pointermove', (evt) => {
            if (this.ctrlDiv.pointerDown) {                
                this.ctrlDiv.pointerDelta = evt.clientX - this.ctrlDiv.prevPosition;
                this._updateHandlePositionFromPointer(evt);
            }
        });

        if ( this.isObject ) {
            Object.defineProperty( this.obj, this.prop, {
                set: val => { 
                    this.propReferences[propReferenceIndex] = val;
                    this.valueInput.value = val;

                    this._updateHandlePositionFromValue();

                    if (this.callback) {
                        this.callback(parseFloat(this.valueInput.value));
                    }            
                },
                get: () => { 
                    return this.propReferences[propReferenceIndex];
                }
            });
        }

        return container;
    }

    _updateHandlePositionFromPointer(evt, firstDown = false) {
        const sliderWidth = this.ctrlDiv.offsetWidth;
        const handleWidth = this.handle.offsetWidth;
        const pointerDelta = evt.clientX - this.ctrlDiv.prevPosition;
        const currentValue = parseFloat(this.valueInput.value);
        let handlePosition;
        
        if (firstDown) {
            handlePosition = evt.offsetX;
        } else {
            handlePosition = this.handle.position + pointerDelta;
        }

        handlePosition = Math.max(handleWidth / 2, Math.min(handlePosition, sliderWidth - handleWidth / 2));
        
        let newValue = this.min + (this.max - this.min) * (handlePosition - handleWidth / 2) / (sliderWidth - handleWidth);
        if ( newValue > currentValue ) {
            newValue = this._quantizeFloor(newValue, this.step);
        } else {
            newValue = this._quantizeCeil(newValue, this.step);
        }
        
        // toFixed(9) avoids weird javascript infinite decimals
        newValue = parseFloat(newValue.toFixed(9));
        const nextValue = parseFloat((currentValue + this.step).toFixed(9));
        const prevValue = parseFloat((currentValue - this.step).toFixed(9));
        
        if (newValue >= nextValue || newValue <= prevValue) {
            newValue = newValue.toFixed(this.decimals);

            this.valueInput.value = newValue;

            this.ctrlDiv.prevPosition = evt.clientX;

            this.handle.style.transform = `translate(-50%, -50%) translateX(${handlePosition}px)`;
            this.handle.position = handlePosition;

            this.filling.style.width = this.handle.position + 'px';
        
            this._triggerCallbacks();
        }
    }

    _updateHandlePositionFromValue() {
        const sliderWidth = this.ctrlDiv.offsetWidth;
        const handleWidth = this.handle.offsetWidth;
        let handlePosition = this._mapLinear(this.valueInput.value, this.min, this.max, handleWidth / 2, sliderWidth - handleWidth / 2);
        
        handlePosition = Math.max(handleWidth / 2, Math.min(handlePosition, sliderWidth - handleWidth / 2));
        
        this.handle.style.transform = `translate(-50%, -50%) translateX(${handlePosition}px)`;
        this.handle.position = handlePosition;

        this.filling.style.width = this.handle.position + 'px';
    }

    _triggerCallbacks() {        
        if ( this.isObject ) {
            this.obj[this.prop] = parseFloat(this.valueInput.value);
        }
        else {
            if (this.callback) {
                this.callback(parseFloat(this.valueInput.value));
            }
        }

        if (this.parent.onUpdate) {
            this.parent.onUpdate();
        } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
            this.parent.firstParent.onUpdate();
        }
    }
    
    _mapLinear( x, a1, a2, b1, b2 ) {
        return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
    }

    _quantize(x, step) {
        return step * Math.round(x / step);
    }

    _quantizeCeil(x, step) {
        return step * Math.ceil(x / step);
    }

    _quantizeFloor(x, step) {
        return step * Math.floor(x / step);
    }
}