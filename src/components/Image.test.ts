import { describe, expect, it } from 'vitest';
import GUI from '../index.js';

describe('Image', () => {
    it('marks the clicked image as selected and clears the previous selection', () => {
        const gui = new GUI();
        const imageA = gui.image('a.png');
        const imageB = gui.image('b.png');

        imageA.element.dispatchEvent(new MouseEvent('click'));
        expect(imageA.element.classList.contains('p-gui__image--selected')).toBe(true);

        imageB.element.dispatchEvent(new MouseEvent('click'));
        expect(imageA.element.classList.contains('p-gui__image--selected')).toBe(false);
        expect(imageB.element.classList.contains('p-gui__image--selected')).toBe(true);
    });

    it('invokes onClick with the path and label', () => {
        const gui = new GUI();
        const image = gui.image('folder/icon.png', { label: 'Icon' });

        const clicks: Array<{ path: string; text: string }> = [];
        image.onClick((payload) => clicks.push(payload));

        image.element.dispatchEvent(new MouseEvent('click'));

        expect(clicks).toEqual([{ path: 'folder/icon.png', text: 'Icon' }]);
    });
});
