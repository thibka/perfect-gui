import type GUI from '../index.js';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
    color?: string;
    hoverColor?: string;
}

type Callback = () => void;

export default class Button {
    public parent: GUI;
    public callback: null | Callback = null;
    public element: HTMLDivElement;

    constructor(parent: GUI, options: Options = {}) {
        this.parent = parent;

        if (typeof options !== 'object') {
            throw Error(
                `[GUI] button() first parameter must be an object. Received: ${typeof options}.`,
            );
        }

        let label = options.label || ' ';

        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        const el = document.createElement('div');
        el.className = 'p-gui__button';
        el.textContent = label;
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        if (tooltip) {
            el.setAttribute('title', tooltip);
        }
        const activate = () => {
            if (this.callback) {
                this.callback();
            }

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        };
        el.addEventListener('click', activate);
        el.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                activate();
            }
        });

        if (typeof options.color == 'string') {
            el.style.setProperty('--color-accent', options.color);
            el.style.setProperty(
                '--color-accent-hover',
                options.hoverColor || options.color,
            );
        }

        this.parent.wrapper.append(el);
        
        // Expose the DOM element
        this.element = el;
    }

    onClick(callback: Callback) {
        this.callback = callback;
        return this;
    }
}
