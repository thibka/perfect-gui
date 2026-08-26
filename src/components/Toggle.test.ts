import { describe, expect, it, vi } from 'vitest';
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

    it('keeps two toggles bound to the same prop in sync in both directions', () => {
        const gui = new GUI();
        const obj = { enabled: false };
        const toggle1 = new Toggle(gui, obj, 'enabled');
        const toggle2 = new Toggle(gui, obj, 'enabled');

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        toggle1.onChange(onChange1);
        toggle2.onChange(onChange2);

        toggle1.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(obj.enabled).toBe(true);
        expect(onChange1).toHaveBeenCalledWith(true);
        expect(onChange2).toHaveBeenCalledWith(true);
        expect(
            toggle2.element
                .querySelector('.p-gui__toggle-checkbox')!
                .classList.contains('p-gui__toggle-checkbox--active'),
        ).toBe(true);

        toggle2.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(obj.enabled).toBe(false);
        expect(onChange1).toHaveBeenCalledWith(false);
        expect(onChange2).toHaveBeenCalledWith(false);
        expect(
            toggle1.element
                .querySelector('.p-gui__toggle-checkbox')!
                .classList.contains('p-gui__toggle-checkbox--active'),
        ).toBe(false);
    });

    it('ignores clicks when readonly, but still reflects external changes', () => {
        const gui = new GUI();
        const obj = { enabled: false };
        const toggle = new Toggle(gui, obj, 'enabled', { readonly: true });

        expect(toggle.element.getAttribute('data-readonly')).toBe('true');
        expect(toggle.element.getAttribute('tabindex')).toBe('-1');

        toggle.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(obj.enabled).toBe(false);

        obj.enabled = true;
        expect(
            toggle.element
                .querySelector('.p-gui__toggle-checkbox')!
                .classList.contains('p-gui__toggle-checkbox--active'),
        ).toBe(true);
    });
});
