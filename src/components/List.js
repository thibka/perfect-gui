export default class List {
    constructor(parent, arg1, arg2, arg3) {
        this.parent = parent;
        this.callback = null;

        let params = {};
        let value = null;
        let isObject = false;
        let obj, prop;

        if (arg1 && typeof arg1 === 'object' && typeof arg2 === 'string') {
            obj = arg1;
            prop = arg2;
            isObject = true;
            params = arg3 || {};
        } else if (arg1 && typeof arg1 === 'object') {
            isObject = false;
            params = arg1;
        } else {
            throw Error(`[GUI] list() invalid parameters.`);
        }

        let label = typeof params.label == 'string' ? params.label : ' ';
        let propReferenceIndex = null;
        let values = Array.isArray(params.values) ? params.values : null;
        let objectValues =
            values && values.length > 0 && typeof values[0] === 'object';
        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        if (!isObject) {
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
        } else {
            value = (() => {
                if (!values) {
                    return null;
                }
                if (typeof obj[prop] == 'string') {
                    if (!objectValues) {
                        // values is an array of strings
                        return values.indexOf(obj[prop]);
                    } else {
                        // values is an array of objects
                        return values.find((item) => item.value === obj[prop])
                            .value;
                    }
                }
                if (typeof obj[prop] == 'number') {
                    if (!objectValues) {
                        // values is an array of strings
                        return obj[prop];
                    } else {
                        // values is an array of objects
                        return values.find((item) => item.value === obj[prop])
                            .value;
                    }
                }
            })();

            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
        }

        let container = document.createElement('div');
        container.className = 'p-gui__list';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);
        
        // Expose the DOM element
        this.element = container;

        let select = document.createElement('select');
        container.append(select);
        select.className = 'p-gui__list-dropdown';
        select.addEventListener('change', (ev) => {
            if (isObject) {
                obj[prop] = ev.target.value;
            } else if (this.callback) {
                this.callback(ev.target.value);
            }

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        });

        if (values) {
            values.forEach((item, index) => {
                const optionName = objectValues ? item.label : item;
                const optionValue = objectValues ? item.value : item;
                let option = document.createElement('option');
                option.setAttribute('value', optionValue);
                option.textContent = optionName;
                select.append(option);

                if (
                    (!objectValues && value == index) ||
                    (objectValues && value == optionValue)
                ) {
                    option.setAttribute('selected', '');
                }
            });
        }

        if (isObject) {
            Object.defineProperty(obj, prop, {
                set: (val) => {
                    let newIndex, newValue, newObj;
                    if (objectValues) {
                        newObj = values.find((item) => {
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

                    this.parent.propReferences[propReferenceIndex] =
                        objectValues ? newValue : val;

                    const previousSelection =
                        select.querySelector('[selected]');
                    if (previousSelection) {
                        previousSelection.removeAttribute('selected');
                    }
                    select
                        .querySelectorAll('option')
                        [newIndex].setAttribute('selected', '');

                    if (typeof this.callback == 'function') {
                        if (objectValues) {
                            this.callback(newObj, newIndex);
                        } else {
                            this.callback(newValue, newIndex);
                        }
                    }
                },
                get: () => {
                    return this.parent.propReferences[propReferenceIndex];
                },
            });
        }
    }

    onChange(callback) {
        this.callback = callback;
        return this;
    }
}
