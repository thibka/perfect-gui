import Component, { type Container } from './Component.js';
import { bindSharedProp, type SharedPropEntry } from '../shared-prop.js';

export default abstract class BoundComponent<T = any> extends Component {
    protected obj: any;
    protected prop: string;
    protected propEntry: SharedPropEntry<T>;
    protected readonly: boolean;
    private callback: ((value: T) => void) | null = null;

    constructor(container: Container, obj: any, prop: string, readonly: boolean) {
        super(container);

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            const name = new.target.name.charAt(0).toLowerCase() + new.target.name.slice(1);
            throw Error(`[GUI] ${name}() invalid parameters. Expected (object, string, options).`);
        }

        this.obj = obj;
        this.prop = prop;
        this.readonly = readonly;
        this.propEntry = bindSharedProp<T>(obj, prop);
    }

    onChange(callback: (value: T) => void) {
        this.callback = callback;
        return this;
    }

    protected emitChange(value: T) {
        if (typeof this.callback === 'function') {
            this.callback(value);
        }
    }

    protected applyReadonlyAttributes(el: HTMLElement, interactiveTabIndex = '0') {
        el.setAttribute('tabindex', this.readonly ? '-1' : interactiveTabIndex);
        if (this.readonly) {
            el.setAttribute('data-readonly', 'true');
            el.setAttribute('aria-readonly', 'true');
        }
    }
}
