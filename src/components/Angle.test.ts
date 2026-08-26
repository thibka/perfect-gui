import { describe, expect, it, vi } from 'vitest';
import GUI from '../index.js';
import Angle from './Angle.js';
import type { Options } from './Angle.js';

function createAngle(options: Options = {}) {
    const gui = new GUI();
    const obj = { rotation: 0 };
    const angle = new Angle(gui, obj, 'rotation', options);
    return { angle, obj, gui };
}

describe('Angle._mod', () => {
    it('always returns a non-negative remainder', () => {
        const { angle } = createAngle();
        expect(angle._mod(-10, 360)).toBe(350);
        expect(angle._mod(370, 360)).toBe(10);
        expect(angle._mod(0, 360)).toBe(0);
    });
});

describe('Angle._resolveDeg', () => {
    it('wraps values back into range when the range spans a full turn', () => {
        const { angle } = createAngle(); // default min 0, max 360 -> wraps
        expect(angle._resolveDeg(370)).toBeCloseTo(10);
        expect(angle._resolveDeg(-10)).toBeCloseTo(350);
    });

    it('clamps to the nearest bound when the range does not span a full turn', () => {
        const { angle } = createAngle({ min: 0, max: 90 });
        expect(angle._resolveDeg(180)).toBe(90); // closer to max
        expect(angle._resolveDeg(-1)).toBe(0); // closer to min
    });

    it('quantizes on the configured step', () => {
        const { angle } = createAngle({ min: 0, max: 360, step: 10 });
        expect(angle._resolveDeg(24)).toBe(20);
        expect(angle._resolveDeg(26)).toBe(30);
    });
});

describe('Angle shared prop binding', () => {
    it('keeps two controllers bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { rotation: 0 };
        const angle1 = new Angle(gui, obj, 'rotation', { label: 'Degrees' });
        const angle2 = new Angle(gui, obj, 'rotation', { label: 'Degrees2' });

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        angle1.onChange(onChange1);
        angle2.onChange(onChange2);

        const input1 = angle1.element.querySelector(
            '.p-gui__angle-value',
        ) as HTMLInputElement;
        const input2 = angle2.element.querySelector(
            '.p-gui__angle-value',
        ) as HTMLInputElement;

        input1.value = '45';
        input1.dispatchEvent(new Event('change'));

        expect(obj.rotation).toBe(45);
        expect(onChange1).toHaveBeenCalledWith(45);
        expect(onChange2).toHaveBeenCalledWith(45);
        expect(input2.value).toBe('45');

        input2.value = '90';
        input2.dispatchEvent(new Event('change'));

        expect(obj.rotation).toBe(90);
        expect(onChange1).toHaveBeenCalledWith(90);
        expect(onChange2).toHaveBeenCalledWith(90);
        expect(input1.value).toBe('90');
    });
});

describe('Angle unit conversion', () => {
    it('converts between degrees and radians when unit is "rad"', () => {
        const { angle } = createAngle({ unit: 'rad' });
        expect(angle._toDeg(Math.PI)).toBeCloseTo(180);
        expect(angle._fromDeg(180)).toBeCloseTo(Math.PI);
    });

    it('is a no-op when unit is "deg"', () => {
        const { angle } = createAngle({ unit: 'deg' });
        expect(angle._toDeg(45)).toBe(45);
        expect(angle._fromDeg(45)).toBe(45);
    });
});

describe('Angle readonly mode', () => {
    it('ignores edits when readonly, but still reflects external changes', () => {
        const { angle, obj } = createAngle({ readonly: true });
        const input = angle.element.querySelector<HTMLInputElement>('.p-gui__angle-value')!;

        expect(input.readOnly).toBe(true);
        expect(angle.element.getAttribute('data-readonly')).toBe('true');

        input.value = '45';
        input.dispatchEvent(new Event('change'));
        expect(obj.rotation).toBe(0);

        obj.rotation = 90;
        expect(input.value).toBe('90');
    });
});
