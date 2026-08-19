import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import Color from './Color.js';

function createColor(initial?: string) {
    const gui = new GUI();
    const obj: { color?: string } = { color: initial };
    const color = new Color(gui, obj, 'color');
    return { color, obj, gui };
}

describe('Color', () => {
    it('defaults the picker to black when the initial value is falsy', () => {
        const { color } = createColor(undefined);
        const picker = color.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;
        expect(picker.value).toBe('#000000');
    });

    it('reflects prop changes on the color picker', () => {
        const { color, obj } = createColor('#000000');
        obj.color = '#ff0000';

        const picker = color.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;
        expect(picker.value).toBe('#ff0000');
    });

    it('updates the prop and invokes onChange when the picker input changes', () => {
        const { color, obj } = createColor('#000000');
        const changes: string[] = [];
        color.onChange((value) => changes.push(value));

        const picker = color.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;
        picker.value = '#00ff00';
        picker.dispatchEvent(new Event('input'));

        expect(obj.color).toBe('#00ff00');
        expect(changes).toEqual(['#00ff00']);
    });
});
