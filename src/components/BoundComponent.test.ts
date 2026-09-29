import { describe, expect, it, vi } from 'vitest';
import type { Container } from './Component.js';
import BoundComponent from './BoundComponent.js';

class FakeContainer implements Container {
    public appended: HTMLElement[] = [];
    public notifyUpdate = vi.fn();

    append(el: HTMLElement) {
        this.appended.push(el);
    }
}

class TestBoundComponent extends BoundComponent<number> {
    constructor(container: Container, obj: any, prop: string, readonly = false) {
        super(container, obj, prop, readonly);
        this.element = document.createElement('div');
        this.applyReadonlyAttributes(this.element);
        this.propEntry.listeners.add((val) => this.emitChange(val));
    }

    setValue(value: number) {
        this.obj[this.prop] = value;
    }
}

describe('BoundComponent', () => {
    it('throws when obj/prop are invalid', () => {
        const container = new FakeContainer();

        expect(() => new TestBoundComponent(container, null, 'value')).toThrow();
        expect(() => new TestBoundComponent(container, {}, 123 as unknown as string)).toThrow();
    });

    it('binds the shared prop and notifies onChange listeners, including programmatic changes', () => {
        const container = new FakeContainer();
        const obj = { value: 1 };
        const component = new TestBoundComponent(container, obj, 'value');

        const values: number[] = [];
        component.onChange((val) => values.push(val));

        component.setValue(5);
        obj.value = 9;

        expect(values).toEqual([5, 9]);
    });

    it('replaces the callback on each onChange() call instead of stacking listeners', () => {
        const container = new FakeContainer();
        const obj = { value: 1 };
        const component = new TestBoundComponent(container, obj, 'value');

        const first = vi.fn();
        const second = vi.fn();
        component.onChange(first);
        component.onChange(second);

        component.setValue(2);

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledWith(2);
    });

    it('applies data-readonly/aria-readonly/tabindex attributes only when readonly', () => {
        const container = new FakeContainer();

        const readonlyComponent = new TestBoundComponent(container, { value: 1 }, 'value', true);
        expect(readonlyComponent.element.getAttribute('data-readonly')).toBe('true');
        expect(readonlyComponent.element.getAttribute('aria-readonly')).toBe('true');
        expect(readonlyComponent.element.getAttribute('tabindex')).toBe('-1');

        const editableComponent = new TestBoundComponent(container, { value: 1 }, 'value', false);
        expect(editableComponent.element.getAttribute('data-readonly')).toBe(null);
        expect(editableComponent.element.getAttribute('aria-readonly')).toBe(null);
        expect(editableComponent.element.getAttribute('tabindex')).toBe('0');
    });

    it('throws a per-component error naming the concrete class on invalid parameters', () => {
        const container = new FakeContainer();

        expect(() => new TestBoundComponent(container, null, 'value')).toThrow(
            '[GUI] testBoundComponent() invalid parameters. Expected (object, string, options).',
        );
    });

    it('delegates notifyUpdate() to the container', () => {
        const container = new FakeContainer();
        const component = new TestBoundComponent(container, { value: 1 }, 'value');

        (component as any).notifyUpdate();

        expect(container.notifyUpdate).toHaveBeenCalledTimes(1);
    });
});
