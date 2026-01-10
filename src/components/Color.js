export default class Color {
    constructor(parent, params = {}, callback) {
        this.parent = parent;

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

            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }
        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] color() "obj" and "prop" parameters must be used together.`);
            }
        }

        const container = document.createElement('div');
        container.className = 'p-gui__color';
        container.textContent = label;
        if ( tooltip ) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

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

                if (this.parent.onUpdate) {
                    this.parent.onUpdate();
                } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
                    this.parent.firstParent.onUpdate();
                }
            });
        }

        if ( isObject ) {
            Object.defineProperty( obj, prop, {
                set: val => { 
                    this.parent.propReferences[propReferenceIndex] = val;

                    colorpicker.value = val;

                    if (typeof callback == 'function') {
                        callback(val);
                    }
                },
                get: () => { 
                    return this.parent.propReferences[propReferenceIndex];
                }
            });
        }

        return container;
    }
}