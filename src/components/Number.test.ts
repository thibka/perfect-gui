import { describe, expect, it, vi } from 'vitest';
import GUI from '../index.js';
import NumberInput from './Number.js';

function createNumber(initial: number, options?: ConstructorParameters<typeof NumberInput>[3]) {
    const gui = new GUI();
    const obj: { value: number } = { value: initial };
    const number = new NumberInput(gui, obj, 'value', options);
    return { number, obj, gui };
}

describe('NumberInput', () => {
    it('reflects the initial value in the input', () => {
        const { number } = createNumber(42);
        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;
        expect(input.value).toBe('42');
    });

    it('updates the prop and invokes onChange on change', () => {
        const { number, obj } = createNumber(0);
        const changes: number[] = [];
        number.onChange((value) => changes.push(value));

        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;
        input.value = '5';
        input.dispatchEvent(new Event('change'));

        expect(obj.value).toBe(5);
        expect(changes).toEqual([5]);
    });

    it('clamps the value between min and max when provided', () => {
        const { number, obj } = createNumber(0, { min: 0, max: 10 });
        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;

        input.value = '99';
        input.dispatchEvent(new Event('change'));
        expect(obj.value).toBe(10);
        expect(input.value).toBe('10');

        input.value = '-5';
        input.dispatchEvent(new Event('change'));
        expect(obj.value).toBe(0);
        expect(input.value).toBe('0');
    });

    it('falls back to 0 when the input is emptied', () => {
        const { number, obj } = createNumber(3);
        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;

        input.value = '';
        input.dispatchEvent(new Event('change'));

        expect(obj.value).toBe(0);
    });

    it('reflects prop changes set programmatically', () => {
        const { number, obj } = createNumber(1);
        obj.value = 7;

        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;
        expect(input.value).toBe('7');
    });

    it('increments and decrements the value via the stepper arrows', () => {
        const { number, obj } = createNumber(5, { step: 2 });
        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;
        const upArrow = number.element.querySelector<HTMLElement>('.p-gui__number-arrow--up')!;
        const downArrow = number.element.querySelector<HTMLElement>('.p-gui__number-arrow--down')!;

        upArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(obj.value).toBe(7);
        expect(input.value).toBe('7');

        downArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        downArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(obj.value).toBe(3);
    });

    it('preserves the starting value decimals when the step is a whole number', () => {
        const { number, obj } = createNumber(0.1, { min: 0.1, max: 4.1, step: 1 });
        const upArrow = number.element.querySelector<HTMLElement>('.p-gui__number-arrow--up')!;

        const values = [0.1];
        for (let i = 0; i < 5; i++) {
            upArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            values.push(obj.value);
        }

        expect(values).toEqual([0.1, 1.1, 2.1, 3.1, 4.1, 4.1]);
    });

    it('avoids floating-point drift when stepping with decimal steps', () => {
        const { number, obj } = createNumber(1, { step: 0.1 });
        const upArrow = number.element.querySelector<HTMLElement>('.p-gui__number-arrow--up')!;

        upArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(obj.value).toBe(1.1);

        upArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(obj.value).toBe(1.2);
    });

    it('clamps stepper increments to min/max', () => {
        const { number, obj } = createNumber(9, { min: 0, max: 10, step: 5 });
        const upArrow = number.element.querySelector<HTMLElement>('.p-gui__number-arrow--up')!;

        upArrow.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        expect(obj.value).toBe(10);
    });

    it('steps the value with the ArrowUp/ArrowDown keys', () => {
        const { number, obj } = createNumber(0, { step: 1 });
        const input = number.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        expect(obj.value).toBe(1);

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        expect(obj.value).toBe(0);
    });

    it('keeps two number fields bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { value: 1 };
        const number1 = new NumberInput(gui, obj, 'value');
        const number2 = new NumberInput(gui, obj, 'value');

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        number1.onChange(onChange1);
        number2.onChange(onChange2);

        const input1 = number1.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;
        const input2 = number2.element.querySelector<HTMLInputElement>('.p-gui__number-input')!;

        input1.value = '9';
        input1.dispatchEvent(new Event('change'));

        expect(obj.value).toBe(9);
        expect(onChange1).toHaveBeenCalledWith(9);
        expect(onChange2).toHaveBeenCalledWith(9);
        expect(input2.value).toBe('9');
    });
});
