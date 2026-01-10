export default class List {
    constructor(parent, params = {}, callback) {
        this.parent = parent;

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

            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
            isObject = true;
        }

        else {
            if ((prop != undefined && obj == undefined) || (prop == undefined && obj == undefined)) {
                console.warn(`[GUI] list() "obj" and "prop" parameters must be used together.`);
            }
        }

        let container = document.createElement('div');
        container.className = 'p-gui__list';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

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

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (this.parent.isFolder && this.parent.firstParent.onUpdate) {
                this.parent.firstParent.onUpdate();
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
                    
                    this.parent.propReferences[propReferenceIndex] = objectValues ? newValue : val;

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
                    return this.parent.propReferences[propReferenceIndex];
                }
            });
        }

        return container;
    }
}