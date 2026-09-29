import type { Container } from './Component.js';
import BoundComponent from './BoundComponent.js';

export type Options = {
    label?: string;
    tooltip?: string;
    readonly?: boolean;
}

export default class Toggle extends BoundComponent<boolean> {
    constructor(container: Container, obj: any, prop: string, options: Options = {}) {
        super(container, obj, prop, !!options.readonly);

        const label = this.resolveLabel(options, prop);
        const tooltip = this.resolveTooltip(options, label);

        const el = document.createElement('div');
        el.textContent = label;
        el.className = 'p-gui__toggle';
        el.setAttribute('role', 'switch');
        el.setAttribute('aria-checked', String(!!obj[prop]));
        if (tooltip) {
            el.setAttribute('title', tooltip);
        }
        this.applyReadonlyAttributes(el);
        this.container.append(el);

        // Expose the DOM element
        this.element = el;

        const activeClass = obj[prop] ? ' p-gui__toggle-checkbox--active' : '';

        const checkbox = document.createElement('div');
        checkbox.className = 'p-gui__toggle-checkbox' + activeClass;
        el.append(checkbox);

        const toggleValue = () => {
            if (this.readonly) return;

            let value = true;

            if (checkbox.classList.contains('p-gui__toggle-checkbox--active')) {
                value = false;
            }

            checkbox.classList.toggle('p-gui__toggle-checkbox--active');
            el.setAttribute('aria-checked', String(value));

            this.obj[this.prop] = value;

            this.notifyUpdate();
        };

        el.addEventListener('click', (ev) => {
            if (!ev.target || !(ev.target instanceof HTMLElement)) return;

            toggleValue();
        });

        el.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                toggleValue();
            }
        });

        this.propEntry.listeners.add((val) => {
            if (val) {
                checkbox.classList.add('p-gui__toggle-checkbox--active');
            } else {
                checkbox.classList.remove('p-gui__toggle-checkbox--active');
            }
            el.setAttribute('aria-checked', String(!!val));

            this.emitChange(val);
        });
    }
}
