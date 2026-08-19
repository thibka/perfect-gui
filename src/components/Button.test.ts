import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import Button from './Button.js';

describe('Button', () => {
    it('renders the label and invokes onClick when clicked', () => {
        const gui = new GUI();
        const button = new Button(gui, { label: 'Save' });

        expect(button.element.textContent).toBe('Save');

        let clicked = 0;
        button.onClick(() => clicked++);
        button.element.dispatchEvent(new MouseEvent('click'));

        expect(clicked).toBe(1);
    });

    it('calls the parent onUpdate callback on click', () => {
        const updates: number[] = [];
        const gui = new GUI({ onUpdate: () => updates.push(1) });
        const button = new Button(gui, {});

        button.element.dispatchEvent(new MouseEvent('click'));

        expect(updates).toEqual([1]);
    });
});
