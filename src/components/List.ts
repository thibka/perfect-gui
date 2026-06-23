import type GUI from '../index.js';

type ValueObjectItem = { label: string; value: string | number };
export type Values = (string | number)[] | ValueObjectItem[];

export type Options = {
    label?: string;
    tooltip?: string;
}

type Callback = ((value: string | number | ValueObjectItem, index: number) => void) | null;

export default class List {
    private callback: Callback;

    public element: HTMLElement;

    constructor(private parent: GUI, obj: any, prop: string, valuesArg: Values, options: Options = {}) {
        this.callback = null;

        if (!obj || typeof obj !== 'object' || typeof prop !== 'string') {
            throw Error(`[GUI] list() invalid parameters.`);
        }

        let label = typeof options.label === 'string' ? options.label : prop;
        let values = Array.isArray(valuesArg) ? valuesArg : null;
        if (!values) {
            throw Error(`[GUI] list() Third argument must be an array.`);
        }

        let valuesIsObject =
            values && values.length > 0 && typeof values[0] === 'object';
        const tooltip =
            typeof options.tooltip === 'string'
                ? options.tooltip
                : options.tooltip === true
                  ? label
                  : null;

        let value = (() => {
            if (!values) {
                return null;
            }
            if (typeof obj[prop] === 'string') {
                if (!valuesIsObject) {
                    // values is an array of strings
                    return (values as (string | number)[]).indexOf(obj[prop]);
                } else {
                    // values is an array of objects
                    return (values as ValueObjectItem[]).find((item) => item.value === obj[prop])
                        ?.value;
                }
            }
            if (typeof obj[prop] == 'number') {
                if (!valuesIsObject) {
                    // values is an array of strings
                    return obj[prop];
                } else {
                    // values is an array of objects
                    return (values as ValueObjectItem[]).find((item) => item.value === obj[prop])
                        ?.value;
                }
            }
        })();

        const propReferenceIndex = this.parent.propReferences.push(obj[prop]) - 1;

        let container = document.createElement('div');
        container.className = 'p-gui__list';
        container.textContent = label;
        if (tooltip) {
            container.setAttribute('title', tooltip);
        }
        this.parent.wrapper.append(container);

        // Expose the DOM element
        this.element = container;

        let select = document.createElement('select');
        container.append(select);
        select.className = 'p-gui__list-dropdown';
        select.addEventListener('change', (ev) => {
            obj[prop] = (ev.target as HTMLSelectElement).value;

            if (this.parent.onUpdate) {
                this.parent.onUpdate();
            } else if (
                this.parent.isFolder &&
                this.parent.firstParent.onUpdate
            ) {
                this.parent.firstParent.onUpdate();
            }
        });

        if (values) {
            values.forEach((item, index) => {
                const optionName = valuesIsObject ? (item as ValueObjectItem).label : item;
                const optionValue = valuesIsObject ? (item as ValueObjectItem).value : item;
                let option = document.createElement('option');
                option.setAttribute('value', String(optionValue));
                option.textContent = String(optionName);
                select.append(option);

                if (
                    (!valuesIsObject && value == index) ||
                    (valuesIsObject && value == optionValue)
                ) {
                    option.setAttribute('selected', '');
                }
            });
        }

        Object.defineProperty(obj, prop, {
            set: (val) => {
                let newIndex, newValue, newObj;
                if (valuesIsObject) {
                    newObj = values?.find((item) => {
                        return (item as ValueObjectItem).value == val;
                    });
                    if (!newObj) {
                        console.error(`[GUI] list() value ${val} not found in values`);
                        return;
                    }
                    newValue = (newObj as ValueObjectItem)?.value || (values[0] as ValueObjectItem).value;
                    newIndex = (values as ValueObjectItem[]).indexOf(newObj as ValueObjectItem);
                } 
                else {
                    if (typeof val == 'string') {
                        newIndex = (values as (string | number)[]).indexOf(val);
                        newValue = val;
                    }
                    if (typeof val == 'number') {
                        newIndex = val;
                        newValue = values[val];
                    }
                }

                if (newIndex === undefined || newValue === undefined) {
                    console.error('[GUI] list() newIndex or newValue is undefined');
                    return;
                }

                this.parent.propReferences[propReferenceIndex] =
                    valuesIsObject ? newValue : val;

                const previousSelection =
                    select.querySelector('[selected]');
                if (previousSelection) {
                    previousSelection.removeAttribute('selected');
                }
                select
                    .querySelectorAll('option')
                    [newIndex].setAttribute('selected', '');

                if (typeof this.callback == 'function') {
                    if (valuesIsObject && newObj) {
                        this.callback(newObj, newIndex);
                    } else {
                        this.callback(newValue, newIndex);
                    }
                }
            },
            get: () => {
                return this.parent.propReferences[propReferenceIndex];
            },
        });
    }

    onChange(callback: Callback) {
        this.callback = callback;
        return this;
    }
}
