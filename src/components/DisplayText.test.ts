import { describe, expect, it, vi } from 'vitest';
import GUI from '../index.js';
import DisplayText from './DisplayText.js';

function createDisplayText(initial?: string) {
    const gui = new GUI();
    const obj: { name?: string } = { name: initial };
    const displayText = new DisplayText(gui, obj, 'name');
    return { displayText, obj, gui };
}

describe('DisplayText', () => {
    it('reflects the initial value in the display', () => {
        const { displayText } = createDisplayText('hello');
        expect(displayText.element.textContent).toBe('hello');
    });

    it('defaults to an empty string when the initial value is undefined', () => {
        const { displayText } = createDisplayText(undefined);
        expect(displayText.element.textContent).toBe('');
    });

    it('reflects prop changes set programmatically', () => {
        const { displayText, obj } = createDisplayText('a');
        obj.name = 'b';

        expect(displayText.element.textContent).toBe('b');
    });

    it('invokes onChange when the bound value changes programmatically', () => {
        const { displayText, obj } = createDisplayText('a');
        const changes: string[] = [];
        displayText.onChange((value) => changes.push(value));

        obj.name = 'b';

        expect(changes).toEqual(['b']);
    });

    it('keeps two displayText fields bound to the same prop in sync', () => {
        const gui = new GUI();
        const obj = { name: 'a' };
        const displayText1 = new DisplayText(gui, obj, 'name');
        const displayText2 = new DisplayText(gui, obj, 'name');

        const onChange1 = vi.fn();
        const onChange2 = vi.fn();
        displayText1.onChange(onChange1);
        displayText2.onChange(onChange2);

        obj.name = 'b';

        expect(displayText1.element.textContent).toBe('b');
        expect(displayText2.element.textContent).toBe('b');
        expect(onChange1).toHaveBeenCalledWith('b');
        expect(onChange2).toHaveBeenCalledWith('b');
    });

    it('applies the heading style variant', () => {
        const gui = new GUI();
        const displayTextHeading = new DisplayText(gui, { name: 'Title' }, 'name', { style: 'heading' });

        expect(displayTextHeading.element.classList.contains('p-gui__displaytext--heading')).toBe(true);
    });

    it('applies the code style variant', () => {
        const gui = new GUI();
        const displayTextCode = new DisplayText(gui, { name: 'code' }, 'name', { style: 'code' });

        expect(displayTextCode.element.classList.contains('p-gui__displaytext--code')).toBe(true);
    });

    it('applies the normal style variant by default', () => {
        const { displayText } = createDisplayText('normal');

        expect(displayText.element.classList.contains('p-gui__displaytext--normal')).toBe(false);
        expect(displayText.element.classList.contains('p-gui__displaytext--heading')).toBe(false);
        expect(displayText.element.classList.contains('p-gui__displaytext--code')).toBe(false);
    });

    it('applies tooltip when tooltip option is a string', () => {
        const gui = new GUI();
        const displayTextWithTooltip = new DisplayText(gui, { name: 'test' }, 'name', { tooltip: 'Custom tooltip' });

        expect(displayTextWithTooltip.element.getAttribute('title')).toBe('Custom tooltip');
    });

    it('applies tooltip when tooltip option is true (uses prop name)', () => {
        const gui = new GUI();
        const displayTextWithTooltip = new DisplayText(gui, { name: 'test' }, 'name', { tooltip: true });

        expect(displayTextWithTooltip.element.getAttribute('title')).toBe('name');
    });

    it('does not apply tooltip when tooltip option is false or undefined', () => {
        const gui = new GUI();
        const displayTextNoTooltip = new DisplayText(gui, { name: 'test' }, 'name', { tooltip: false });

        expect(displayTextNoTooltip.element.getAttribute('title')).toBeNull();
    });
});
