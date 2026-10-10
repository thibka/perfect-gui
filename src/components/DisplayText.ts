import BoundComponent from './BoundComponent.js';
import { type Container } from './Component.js';

export type Options = {
    tooltip?: string | boolean;
    style?: 'normal' | 'heading' | 'code';
};

export default class DisplayText extends BoundComponent<string> {
    constructor(container: Container, obj: any, prop: string, options: Options = {}) {
        super(container, obj, prop, true); // DisplayText is always readonly

        const style = options.style ?? 'normal';
        const tooltip = this.resolveTooltip(options, this.prop);

        const el = document.createElement('div');
        el.className = 'p-gui__displaytext';
        if (style !== 'normal') {
            el.classList.add(`p-gui__displaytext--${style}`);
        }
        if (tooltip) {
            el.setAttribute('title', tooltip);
        }

        const value = obj[prop] ?? '';
        el.textContent = String(value);

        this.element = el;
        container.append(el);

        // Listen for changes to the bound property
        this.propEntry.listeners.add((val) => {
            const nextValue = val ?? '';
            if (el.textContent !== nextValue) {
                el.textContent = nextValue;
            }
            this.emitChange(nextValue);
        });
    }
}
