import type GUI from '../index.js';
import { bindSharedProp } from '../shared-prop.js';

export type Options = {
    label?: string;
    tooltip?: string;
    readonly?: boolean;
}

export default class Toggle {
    private callback: ((value: boolean) => void) | null;

    public element: HTMLDivElement;

    constructor(private parent: GUI, obj: any, prop: string, options: Options = {}) {
        this.callback = null;
        const readonly = !!options.readonly;

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] toggle() invalid parameters.`);
        }

        let label =
            typeof options.label === 'string' && options.label !== ''
                ? options.label
                : prop;
        const propEntry = bindSharedProp<boolean>(obj, prop);

        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const container = document.createElement('div');
        container.textContent = label;
        container.className = 'p-gui__toggle';
        container.setAttribute('role', 'switch');
        container.setAttribute('tabindex', readonly ? '-1' : '0');
        container.setAttribute('aria-checked', String(!!obj[prop]));
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        if (readonly) {
            container.setAttribute('data-readonly', 'true');
            container.setAttribute('aria-readonly', 'true');
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        let activeClass = obj[prop] ? ' p-gui__toggle-checkbox--active' : '';

        const checkbox = document.createElement('div');
        checkbox.className = 'p-gui__toggle-checkbox' + activeClass;
        container.append(checkbox);

        const toggleValue = () => {
            if (readonly) return;

            let value = true;

            if (checkbox.classList.contains('p-gui__toggle-checkbox--active')) {
                value = false;
            }

            checkbox.classList.toggle('p-gui__toggle-checkbox--active');
            container.setAttribute('aria-checked', String(value));

            obj[prop] = value;

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        };

        container.addEventListener('click', (ev) => {
            if (!ev.target || !(ev.target instanceof HTMLElement)) return;

            toggleValue();
        });

        container.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                toggleValue();
            }
        });

        propEntry.listeners.add((val) => {
            if (val) {
                checkbox.classList.add('p-gui__toggle-checkbox--active');
            } else {
                checkbox.classList.remove('p-gui__toggle-checkbox--active');
            }
            container.setAttribute('aria-checked', String(!!val));

            if (typeof this.callback == 'function') {
                this.callback(val);
            }
        });
    }

    onChange(callback: (value: boolean) => void) {
        this.callback = callback;
        return this;
    }
}
