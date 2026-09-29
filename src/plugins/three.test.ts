import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import { threeColor, threeMaterial } from './three.js';

function createColorLike(hex: string) {
    let value = hex;
    return {
        getHexString: () => value.slice(1),
        set: (val: string) => {
            value = val;
        },
    };
}

function createStandardMaterial() {
    return {
        isMeshStandardMaterial: true,
        color: createColorLike('#ff0000'),
        roughness: 0.5,
        metalness: 0,
        envMapIntensity: 1,
        transparent: false,
        opacity: 1,
        needsUpdate: false,
    };
}

describe('threeColor plugin', () => {
    it('adds a color control that updates the three.js color on change', () => {
        const gui = new GUI();
        const color = createColorLike('#00ff00');

        const control = threeColor.call(gui, { label: 'color', obj: color })!;
        const picker = control.element.querySelector<HTMLInputElement>('.p-gui__color-picker')!;

        expect(picker.value).toBe('#00ff00');

        picker.value = '#0000ff';
        picker.dispatchEvent(new Event('input'));

        expect(color.getHexString()).toBe('0000ff');
    });

    it('logs an error and returns nothing when no color object is provided', () => {
        const gui = new GUI();

        // @ts-expect-error - exercising the missing-color guard clause
        const result = threeColor.call(gui, { label: 'color' });

        expect(result).toBeUndefined();
    });
});

describe('threeMaterial plugin', () => {
    it('builds a folder of controls for a standard material', () => {
        const gui = new GUI();
        const material = createStandardMaterial();

        const folder = threeMaterial.call(gui, { label: 'material', obj: material })!;

        expect(folder.domElement?.classList.contains('p-gui__folder')).toBe(true);
        expect(folder.wrapper.querySelectorAll('.p-gui__color').length).toBe(1);
        expect(folder.wrapper.querySelectorAll('.p-gui__toggle').length).toBe(1);
    });

    it('logs an error for unsupported materials', () => {
        const gui = new GUI();

        const folder = threeMaterial.call(gui, {
            label: 'material',
            obj: { color: createColorLike('#ffffff') },
        });

        expect(folder).toBeUndefined();
    });
});
