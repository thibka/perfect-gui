import { describe, expect, it, vi } from 'vitest';
import GUI from '../index.js';
import Text from './Text.js';

function createText(initial?: string) {
    const gui = new GUI();
    const obj: { name?: string } = { name: initial };
    const text = new Text(gui, obj, 'name');
    return { text, obj, gui };
}

describe('Text', () => {
    it('reflects the initial value in the input', () => {
        const { text } = createText('hello');
        const input = text.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;
        expect(input.value).toBe('hello');
    });

    it('defaults to an empty string when the initial value is undefined', () => {
        const { text } = createText(undefined);
        const input = text.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;
        expect(input.value).toBe('');
    });

    it('updates the prop and invokes onChange as the user types', () => {
        const { text, obj } = createText('');
        const changes: string[] = [];
        text.onChange((value) => changes.push(value));

        const input = text.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;
        input.value = 'world';
        input.dispatchEvent(new Event('input'));

        expect(obj.name).toBe('world');
        expect(changes).toEqual(['world']);
    });

    it('reflects prop changes set programmatically', () => {
        const { text, obj } = createText('a');
        obj.name = 'b';

        const input = text.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;
        expect(input.value).toBe('b');
    });

    it('keeps two text fields bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { name: 'a' };
        const text1 = new Text(gui, obj, 'name');
        const text2 = new Text(gui, obj, 'name');

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        text1.onChange(onChange1);
        text2.onChange(onChange2);

        const input1 = text1.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;
        const input2 = text2.element.querySelector<HTMLInputElement>('.p-gui__text-input')!;

        input1.value = 'b';
        input1.dispatchEvent(new Event('input'));

        expect(obj.name).toBe('b');
        expect(onChange1).toHaveBeenCalledWith('b');
        expect(onChange2).toHaveBeenCalledWith('b');
        expect(input2.value).toBe('b');
    });
});
