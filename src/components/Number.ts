import type GUI from '../index.js';
import { bindSharedProp } from '../shared-prop.js';

export type Options = {
    label?: string;
    tooltip?: string | boolean;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    readonly?: boolean;
};

type Callback = (value: number) => void;

export default class NumberInput {
    private parent: GUI;
    private min?: number;
    private max?: number;
    private callback: null | Callback = null;
    public element: HTMLDivElement;

    constructor(
        parent: GUI,
        obj: any,
        prop: string,
        options: Options = {}
    ) {
        this.parent = parent;
        this.min = options.min;
        this.max = options.max;
        const readonly = !!options.readonly;

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] number() invalid parameters. Expected (object, string, options).`);
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

        const propEntry = bindSharedProp<number>(obj, prop);
        const value = typeof obj[prop] === 'number' ? obj[prop] : 0;

        const container = document.createElement('div');
        container.className = 'p-gui__number';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        if (readonly) {
            container.setAttribute('data-readonly', 'true');
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        const step = options.step || 1;
        const stepDecimals = this.parent._countDecimals(step);

        const ctrl = document.createElement('div');
        ctrl.className = 'p-gui__number-ctrl';
        container.append(ctrl);

        const input = document.createElement('input');
        input.className = 'p-gui__number-input';
        input.setAttribute('type', 'number');
        input.setAttribute('aria-label', label);
        if (typeof options.min === 'number') {
            input.setAttribute('min', String(options.min));
        }
        if (typeof options.max === 'number') {
            input.setAttribute('max', String(options.max));
        }
        input.setAttribute('step', String(step));
        if (typeof options.placeholder === 'string') {
            input.setAttribute('placeholder', options.placeholder);
        }
        input.value = String(value);
        if (readonly) {
            input.readOnly = true;
            input.tabIndex = -1;
        }
        ctrl.append(input);

        const stepper = document.createElement('div');
        stepper.className = 'p-gui__number-stepper';
        ctrl.append(stepper);

        const upArrow = document.createElement('div');
        upArrow.className = 'p-gui__number-arrow p-gui__number-arrow--up';
        upArrow.setAttribute('role', 'button');
        upArrow.setAttribute('tabindex', '-1');
        upArrow.setAttribute('aria-label', `Increase ${label}`);
        stepper.append(upArrow);

        const downArrow = document.createElement('div');
        downArrow.className = 'p-gui__number-arrow p-gui__number-arrow--down';
        downArrow.setAttribute('role', 'button');
        downArrow.setAttribute('tabindex', '-1');
        downArrow.setAttribute('aria-label', `Decrease ${label}`);
        stepper.append(downArrow);

        const commitValue = () => {
            if (readonly) return;

            let newValue = parseFloat(input.value);

            if (isNaN(newValue)) {
                newValue = 0;
            }
            if (typeof this.min === 'number') {
                newValue = Math.max(this.min, newValue);
            }
            if (typeof this.max === 'number') {
                newValue = Math.min(this.max, newValue);
            }

            input.value = String(newValue);
            obj[prop] = newValue;

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        };

        const applyStep = (direction: 1 | -1) => {
            if (readonly) return;

            let current = parseFloat(input.value);
            if (isNaN(current)) {
                current = 0;
            }
            // Preserve the current value's own decimals (e.g. starting at 0.1
            // with an integer step should keep stepping to 1.1, 2.1, ...)
            // in addition to the step's decimals, then round to avoid
            // floating-point drift (0.1 + 1 !== 1.1 in binary floats).
            const decimals = Math.max(stepDecimals, this.parent._countDecimals(current));
            const stepped = parseFloat((current + direction * step).toFixed(decimals));
            input.value = String(stepped);
            commitValue();
            input.focus();
        };

        input.addEventListener('change', commitValue);

        input.addEventListener('keydown', (evt) => {
            if (evt.key === 'ArrowUp') {
                evt.preventDefault();
                applyStep(1);
            } else if (evt.key === 'ArrowDown') {
                evt.preventDefault();
                applyStep(-1);
            }
        });

        upArrow.addEventListener('pointerdown', (evt) => {
            evt.preventDefault();
            applyStep(1);
        });

        downArrow.addEventListener('pointerdown', (evt) => {
            evt.preventDefault();
            applyStep(-1);
        });

        propEntry.listeners.add((val) => {
            const nextValue = String(val);
            if (input.value !== nextValue) {
                input.value = nextValue;
            }

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
