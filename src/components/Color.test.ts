import { describe, expect, it, vi } from 'vitest';
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

    it('keeps two color pickers bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { color: '#000000' };
        const color1 = new Color(gui, obj, 'color');
        const color2 = new Color(gui, obj, 'color');

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        color1.onChange(onChange1);
        color2.onChange(onChange2);

        const picker1 = color1.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;
        const picker2 = color2.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;

        picker1.value = '#00ff00';
        picker1.dispatchEvent(new Event('input'));

        expect(obj.color).toBe('#00ff00');
        expect(onChange1).toHaveBeenCalledWith('#00ff00');
        expect(onChange2).toHaveBeenCalledWith('#00ff00');
        expect(picker2.value).toBe('#00ff00');

        picker2.value = '#0000ff';
        picker2.dispatchEvent(new Event('input'));

        expect(obj.color).toBe('#0000ff');
        expect(onChange1).toHaveBeenCalledWith('#0000ff');
        expect(onChange2).toHaveBeenCalledWith('#0000ff');
        expect(picker1.value).toBe('#0000ff');
    });

    it('disables the picker when readonly, but still reflects external changes', () => {
        const gui = new GUI();
        const obj = { color: '#000000' };
        const color = new Color(gui, obj, 'color', { readonly: true });
        const picker = color.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;

        expect(picker.disabled).toBe(true);
        expect(color.element.getAttribute('data-readonly')).toBe('true');

        obj.color = '#00ff00';
        expect(picker.value).toBe('#00ff00');
    });
});
