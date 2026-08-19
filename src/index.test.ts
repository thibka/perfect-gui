import { describe, expect, it } from 'vitest';
import GUI from './index.js';

describe('GUI._mapLinear', () => {
    it('maps a value linearly between two ranges', () => {
        const gui = new GUI();
        expect(gui._mapLinear(5, 0, 10, 0, 100)).toBe(50);
        expect(gui._mapLinear(0, 0, 10, 0, 100)).toBe(0);
        expect(gui._mapLinear(10, 0, 10, 0, 100)).toBe(100);
    });

    it('supports an inverted output range', () => {
        const gui = new GUI();
        expect(gui._mapLinear(5, 0, 10, 100, 0)).toBe(50);
        expect(gui._mapLinear(0, 0, 10, 100, 0)).toBe(100);
    });
});

describe('GUI._countDecimals', () => {
    it('counts the digits after the decimal point', () => {
        const gui = new GUI();
        expect(gui._countDecimals(1)).toBe(0);
        expect(gui._countDecimals(1.5)).toBe(1);
        expect(gui._countDecimals(0.001)).toBe(3);
        expect(gui._countDecimals(-2.25)).toBe(2);
    });
});
