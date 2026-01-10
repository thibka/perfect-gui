export default class Toggle {
    constructor(parent, params = {}, callback) {
        this.parent = parent;

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

            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }
        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] toggle() "obj" and "prop" parameters must be used together.`);
            }
        }

        const tooltip = (typeof params.tooltip === 'string') ? params.tooltip : (params.tooltip === true ? label : null);

        const container = document.createElement('div');
        container.textContent = label;
        container.className = 'p-gui__toggle';
        if ( tooltip ) {
            container.setAttribute('title', tooltip);
        }

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

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
                this.parent.firstParent.onUpdate();
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
                    this.parent.propReferences[propReferenceIndex] = val;

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
                    return this.parent.propReferences[propReferenceIndex];
                }
            });
        }

        return container;
    }
}