export default class Toggle {
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
            value = typeof params.value === 'boolean' ? params.value : null;
        } else {
            throw Error(`[GUI] toggle() invalid parameters.`);
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        let propReferenceIndex = null;

        if (isObject && label == ' ') {
            label = prop;
        }

        if (isObject) {
            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
        }

        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.textContent = label;
        container.className = 'p-gui__toggle';
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

        container.addEventListener('click', (ev) => {
            const checkbox = ev.target.childNodes[1];

            let value = true;

            if (checkbox.classList.contains('p-gui__toggle-checkbox--active')) {
                value = false;
            }

            checkbox.classList.toggle('p-gui__toggle-checkbox--active');

            if (isObject) {
                obj[prop] = value;
            } else {
                if (typeof this.callback == 'function') {
                    this.callback(value);
                }
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

        if (isObject) {
            Object.defineProperty(obj, prop, {
                set: (val) => {
                    this.parent.propReferences[propReferenceIndex] = val;

                    if (val) {
                        checkbox.classList.add(
                            'p-gui__toggle-checkbox--active',
                        );
                    } else {
                        checkbox.classList.remove(
                            'p-gui__toggle-checkbox--active',
                        );
                    }

                    if (typeof this.callback == 'function') {
                        this.callback(val);
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
