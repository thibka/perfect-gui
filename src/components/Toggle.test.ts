import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import Toggle from './Toggle.js';

describe('Toggle', () => {
    it('reflects the initial value and toggles the active class on click', () => {
        const gui = new GUI();
        const obj = { enabled: false };
        const toggle = new Toggle(gui, obj, 'enabled');

        const checkbox = toggle.element.querySelector('.p-gui__toggle-checkbox')!;
        expect(checkbox.classList.contains('p-gui__toggle-checkbox--active')).toBe(false);

        toggle.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(obj.enabled).toBe(true);
        expect(checkbox.classList.contains('p-gui__toggle-checkbox--active')).toBe(true);
    });

    it('invokes onChange when the bound property is set programmatically', () => {
        const gui = new GUI();
        const obj = { enabled: false };
        const toggle = new Toggle(gui, obj, 'enabled');

        const values: boolean[] = [];
        toggle.onChange((value) => values.push(value));

        obj.enabled = true;

        expect(values).toEqual([true]);
    });
});
