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

    it('keeps two vector2 controls bound to the same props in sync in both directions', () => {
        const gui = new GUI();
        const obj = { x: 0, y: 0 };
        const vector2a = new Vector2(gui, obj, 'x', 'y', { min: 0, max: 10 });
        const vector2b = new Vector2(gui, obj, 'x', 'y', { min: 0, max: 10 });

        const areaA = vector2a.element.querySelector<HTMLElement>('.p-gui__vector2-area')!;
        Object.defineProperty(areaA, 'clientWidth', { value: 100, configurable: true });
        Object.defineProperty(areaA, 'clientHeight', { value: 100, configurable: true });

        const valueA = vector2a.element.querySelector('.p-gui__vector-value')!;
        const valueB = vector2b.element.querySelector('.p-gui__vector-value')!;

        clickAt(areaA, 25, 25);

        expect(obj.x).toBe(2.5);
        expect(obj.y).toBe(7.5);
        expect(valueA.textContent).toBe('2.5, 7.5');
        expect(valueB.textContent).toBe('2.5, 7.5');

        obj.x = 6;
        obj.y = 1;

        expect(valueA.textContent).toBe('6, 1');
        expect(valueB.textContent).toBe('6, 1');
    });

    it('ignores clicks when readonly, but still reflects external changes', () => {
        const { vector2, obj, area } = createVector2({ min: 0, max: 10, readonly: true });

        expect(area.getAttribute('tabindex')).toBe('-1');
        expect(vector2.element.getAttribute('data-readonly')).toBe('true');

        clickAt(area, 25, 25);
        expect(obj.x).toBe(0);
        expect(obj.y).toBe(0);

        obj.x = 3;
        obj.y = 4;
        const value = vector2.element.querySelector('.p-gui__vector-value')!;
        expect(value.textContent).toBe('3, 4');
    });
});
