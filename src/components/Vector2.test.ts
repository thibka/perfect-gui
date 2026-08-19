import { describe, expect, it } from 'vitest';
import GUI from '../index.js';
import Vector2 from './Vector2.js';
import type { Options } from './Vector2.js';

function createVector2(options: Options = {}) {
    const gui = new GUI();
    const obj = { x: 0, y: 0 };
    const vector2 = new Vector2(gui, obj, 'x', 'y', options);
    const area = vector2.element.querySelector<HTMLElement>('.p-gui__vector2-area')!;

    // jsdom does no layout, so the drag/click math (which reads clientWidth
    // and clientHeight) needs those dimensions stubbed to be meaningful.
    Object.defineProperty(area, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(area, 'clientHeight', { value: 100, configurable: true });

    return { vector2, obj, gui, area };
}

function clickAt(area: HTMLElement, offsetX: number, offsetY: number) {
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'offsetX', { value: offsetX });
    Object.defineProperty(event, 'offsetY', { value: offsetY });
    area.dispatchEvent(event);
}

describe('Vector2', () => {
    it('reflects prop changes in the displayed value', () => {
        const { vector2, obj } = createVector2({ min: 0, max: 10 });
        obj.x = 3;
        obj.y = 4;

        const value = vector2.element.querySelector('.p-gui__vector-value')!;
        expect(value.textContent).toBe('3, 4');
    });

    it('maps a click on the area to clamped x/y values and invokes onChange', () => {
        const { vector2, obj, area } = createVector2({ min: 0, max: 10 });
        const changes: Array<[number, number]> = [];
        vector2.onChange((x, y) => changes.push([x, y]));

        clickAt(area, 25, 25);

        expect(obj.x).toBe(2.5);
        expect(obj.y).toBe(7.5);
        expect(changes).toEqual([[2.5, 7.5]]);
    });
});
