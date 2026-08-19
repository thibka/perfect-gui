import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import List from './List.js';

describe('List with string values', () => {
    function createList(initial: string) {
        const gui = new GUI();
        const obj = { fruit: initial };
        const values = ['apple', 'banana', 'cherry'];
        const list = new List(gui, obj, 'fruit', values);
        return { list, obj, values, gui };
    }

    it('selects the option matching the initial value', () => {
        const { list } = createList('banana');
        const selected = list.element.querySelector('option[selected]') as HTMLOptionElement;
        expect(selected.value).toBe('banana');
    });

    it('updates the prop when choosing via the native select', () => {
        const { list, obj } = createList('apple');
        const select = list.element.querySelector<HTMLSelectElement>('.p-gui__list-dropdown')!;
        select.value = 'cherry';
        select.dispatchEvent(new Event('change'));

        expect(obj.fruit).toBe('cherry');
    });

    it('invokes onChange with the new value and index when set programmatically', () => {
        const { list, obj } = createList('apple');
        const changes: Array<[string | number, number]> = [];
        list.onChange((value, index) => changes.push([value as string, index]));

        obj.fruit = 'cherry';

        expect(changes).toEqual([['cherry', 2]]);
        expect(list.element.querySelectorAll('option')[2].hasAttribute('selected')).toBe(true);
    });
});

describe('List with object values', () => {
    function createList() {
        const gui = new GUI();
        const obj = { fruit: 'a' };
        const values = [
            { label: 'Apple', value: 'a' },
            { label: 'Banana', value: 'b' },
        ];
        const list = new List(gui, obj, 'fruit', values);
        return { list, obj, values, gui };
    }

    it('resolves the selected option label from the matching value', () => {
        const { list } = createList();
        const selected = list.element.querySelector('option[selected]') as HTMLOptionElement;
        expect(selected.textContent).toBe('Apple');
    });

    it('invokes onChange with the matching object when set programmatically', () => {
        const { list, obj } = createList();
        const changes: unknown[] = [];
        list.onChange((value) => changes.push(value));

        obj.fruit = 'b';

        expect(changes).toEqual([{ label: 'Banana', value: 'b' }]);
    });
});
