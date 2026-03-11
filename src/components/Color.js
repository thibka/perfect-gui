export default class Color {
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
            throw Error(`[GUI] color() invalid parameters.`);
        }

        let label = typeof params.label == 'string' ? params.label || ' ' : ' ';
        let propReferenceIndex = null;
        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        if (!isObject) {
            if (typeof params.value == 'string') {
                if (params.value.length != 7 || params.value[0] != '#') {
                    console.error(
                        `[GUI] color() 'value' parameter must be an hexadecimal string in the format "#ffffff". Received: "${params.value}".`,
                    );
                } else {
                    value = params.value;
                }
            }
            if (!value) value = '#000000';
        } else {
            if (label == ' ') {
                label = prop;
            }
            propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;
            value = obj[prop] || '#000000';
        }

        const container = document.createElement('div');
        container.className = 'p-gui__color';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);
        
        // Expose the DOM element
        this.element = container;

        const colorpicker = document.createElement('input');
        colorpicker.className = 'p-gui__color-picker';
        colorpicker.setAttribute('type', 'color');
        colorpicker.value = value;
        container.append(colorpicker);

        colorpicker.addEventListener('input', () => {
            if (isObject) {
                obj[prop] = colorpicker.value;
            } else if (typeof this.callback == 'function') {
                this.callback(colorpicker.value);
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

        if (isObject) {
            Object.defineProperty(obj, prop, {
                set: (val) => {
                    this.parent.propReferences[propReferenceIndex] = val;

                    colorpicker.value = val;

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
