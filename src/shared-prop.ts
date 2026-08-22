export type SharedPropEntry<T = any> = {
    value: T;
    listeners: Set<(val: T) => void>;
};

// Allows several GUI controllers to be bound to the same object property:
// only the first controller to bind a given property installs the
// getter/setter, and every controller bound to it is notified on change
// instead of the last one silently overwriting the previous descriptor.
const propRegistry = new WeakMap<object, Map<string, SharedPropEntry>>();

export function bindSharedProp<T = any>(obj: any, prop: string): SharedPropEntry<T> {
    let props = propRegistry.get(obj);
    if (!props) {
        props = new Map();
        propRegistry.set(obj, props);
    }

    let entry = props.get(prop);
    if (!entry) {
        entry = { value: obj[prop], listeners: new Set() };
        props.set(prop, entry);

        Object.defineProperty(obj, prop, {
            configurable: true,
            get: () => entry!.value,
            set: (val) => {
                entry!.value = val;
                entry!.listeners.forEach((listener) => listener(val));
            },
        });
    }

    return entry as SharedPropEntry<T>;
}
