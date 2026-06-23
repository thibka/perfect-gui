import type GUI from '../index';

export type Options = {
    label?: string;
    tooltip?: string;
}

export default class Toggle {
    private callback: ((value: boolean) => void) | null;

    public element: HTMLDivElement;

    constructor(private parent: GUI, obj: any, prop: string, options: Options = {}) {
        this.callback = null;

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] toggle() invalid parameters.`);
        }

        let label =
            typeof options.label === 'string' && options.label !== ''
                ? options.label
                : prop;
        const propReferenceIndex =
            this.parent.propReferences.push(obj[prop]) - 1;

        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.textContent = label;
        container.className = 'p-gui__toggle';
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        let activeClass = obj[prop] ? ' p-gui__toggle-checkbox--active' : '';

        const checkbox = document.createElement('div');
        checkbox.className = 'p-gui__toggle-checkbox' + activeClass;
        container.append(checkbox);

        container.addEventListener('click', (ev) => {
            if (!ev.target || !(ev.target instanceof HTMLElement)) return;

            let value = true;

            if (checkbox.classList.contains('p-gui__toggle-checkbox--active')) {
                value = false;
            }

            checkbox.classList.toggle('p-gui__toggle-checkbox--active');

            obj[prop] = value;

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        });

        Object.defineProperty(obj, prop, {
            set: (val) => {
                this.parent.propReferences[propReferenceIndex] = val;

                if (val) {
                    checkbox.classList.add('p-gui__toggle-checkbox--active');
                } else {
                    checkbox.classList.remove('p-gui__toggle-checkbox--active');
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

    onChange(callback: (value: boolean) => void) {
        this.callback = callback;
        return this;
    }
}
