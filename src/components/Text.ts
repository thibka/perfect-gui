import type GUI from '../index.js';
import { bindSharedProp } from '../shared-prop.js';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
    placeholder?: string;
    maxLength?: number;
};

type Callback = (value: string) => void;

export default class Text {
    private parent: GUI;
    private callback: null | Callback = null;
    public element: HTMLDivElement;

    constructor(
        parent: GUI,
        obj: any,
        prop: string,
        options: Options = {}
    ) {
        this.parent = parent;

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] text() invalid parameters. Expected (object, string, options).`);
        }

        let label = typeof options.label === 'string' ? options.label || ' ' : ' ';
        if (label === ' ') {
            label = prop;
        }

        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const propEntry = bindSharedProp<string>(obj, prop);
        const value = obj[prop] ?? '';

        const container = document.createElement('div');
        container.className = 'p-gui__text';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        const input = document.createElement('input');
        input.className = 'p-gui__text-input';
        input.setAttribute('type', 'text');
        input.setAttribute('aria-label', label);
        if (typeof options.placeholder === 'string') {
            input.setAttribute('placeholder', options.placeholder);
        }
        if (typeof options.maxLength === 'number') {
            input.maxLength = options.maxLength;
        }
        input.value = String(value);
        container.append(input);

        input.addEventListener('input', () => {
            obj[prop] = input.value;

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        });

        propEntry.listeners.add((val) => {
            const nextValue = val ?? '';
            if (input.value !== nextValue) {
                input.value = nextValue;
            }

            if (typeof this.callback === 'function') {
                this.callback(nextValue);
            }
        });
    }

    onChange(callback: Callback) {
        this.callback = callback;
        return this;
    }
}
