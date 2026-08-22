import { describe, expect, it, vi } from 'vitest';
import GUI from '../index.js';
import Slider from './Slider.js';
import type { Options } from './Slider.js';

function createSlider(options: Options = {}) {
    const gui = new GUI();
    const obj = { value: 0.5 };
    const slider = new Slider(gui, obj, 'value', options);
    return { slider, obj, gui };
}

describe('Slider quantization', () => {
    it('_quantize rounds to the nearest step', () => {
        const { slider } = createSlider();
        expect(slider._quantize(0.27, 0.1)).toBeCloseTo(0.3);
        expect(slider._quantize(0.24, 0.1)).toBeCloseTo(0.2);
    });

    it('_quantizeCeil always rounds up to the next step', () => {
        const { slider } = createSlider();
        expect(slider._quantizeCeil(0.21, 0.1)).toBeCloseTo(0.3);
        expect(slider._quantizeCeil(0.2, 0.1)).toBeCloseTo(0.2);
    });

    it('_quantizeFloor always rounds down to the previous step', () => {
        const { slider } = createSlider();
        expect(slider._quantizeFloor(0.29, 0.1)).toBeCloseTo(0.2);
        expect(slider._quantizeFloor(0.2, 0.1)).toBeCloseTo(0.2);
    });
});

describe('Slider value <-> DOM sync', () => {
    it('reflects prop changes in the displayed value', () => {
        const { slider, obj } = createSlider({ min: 0, max: 10, step: 1 });
        obj.value = 7;

        const input = slider.element.querySelector<HTMLInputElement>('.p-gui__slider-value')!;
        expect(input.value).toBe('7');
    });

    it('invokes onChange with the new value when the input changes', () => {
        const { slider, obj } = createSlider({ min: 0, max: 10, step: 1 });
        const changes: number[] = [];
        slider.onChange((value) => changes.push(value));

        const input = slider.element.querySelector<HTMLInputElement>('.p-gui__slider-value')!;
        input.value = '4';
        input.dispatchEvent(new Event('change'));

        expect(changes).toEqual([4]);
        expect(obj.value).toBe(4);
    });

    it('keeps two sliders bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { value: 0 };
        const slider1 = new Slider(gui, obj, 'value', { min: 0, max: 10, step: 1 });
        const slider2 = new Slider(gui, obj, 'value', { min: 0, max: 10, step: 1 });

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        slider1.onChange(onChange1);
        slider2.onChange(onChange2);

        const input1 = slider1.element.querySelector<HTMLInputElement>('.p-gui__slider-value')!;
        const input2 = slider2.element.querySelector<HTMLInputElement>('.p-gui__slider-value')!;

        input1.value = '4';
        input1.dispatchEvent(new Event('change'));

        expect(obj.value).toBe(4);
        expect(onChange1).toHaveBeenCalledWith(4);
        expect(onChange2).toHaveBeenCalledWith(4);
        expect(input2.value).toBe('4');

        input2.value = '9';
        input2.dispatchEvent(new Event('change'));

        expect(obj.value).toBe(9);
        expect(onChange1).toHaveBeenCalledWith(9);
        expect(onChange2).toHaveBeenCalledWith(9);
        expect(input1.value).toBe('9');
    });
});
