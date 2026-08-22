import type GUI from '../index.js';
import { bindSharedProp } from '../shared-prop.js';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
}

type Callback = (value: string) => void;

export default class Color {
    private parent: GUI;
    private callback: null | Callback = null;
    public element: HTMLDivElement;

    constructor(
        parent: GUI,
        obj: any,
        prop: string,
        params: Options = {}
    ) {
        this.parent = parent;

        if (typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] color() invalid parameters. Expected (object, string, options).`);
        }

        let label = typeof params.label === 'string' ? params.label || ' ' : ' ';
        if (label === ' ') {
            label = prop;
        }

        const tooltip =
            typeof params.tooltip === 'string'
                ? params.tooltip
                : params.tooltip === true
                  ? label
                  : null;

        const propEntry = bindSharedProp<string>(obj, prop);
        const value = obj[prop] || '#000000';

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
        colorpicker.setAttribute('aria-label', label);
        colorpicker.value = value;
        container.append(colorpicker);

        colorpicker.addEventListener('input', () => {
            obj[prop] = colorpicker.value;

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
            colorpicker.value = val;

            if (typeof this.callback === 'function') {
                this.callback(val);
            }
        });
    }

    onChange(callback: Callback) {
        this.callback = callback;
        return this;
    }
}

