import { describe, expect, it } from 'vitest';
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
});
