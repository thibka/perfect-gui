import { describe, expect, it } from 'vitest';
import { _countDecimals, _mapLinear } from './utils.js';

describe('_mapLinear', () => {
    it('maps a value linearly between two ranges', () => {
        expect(_mapLinear(5, 0, 10, 0, 100)).toBe(50);
        expect(_mapLinear(0, 0, 10, 0, 100)).toBe(0);
        expect(_mapLinear(10, 0, 10, 0, 100)).toBe(100);
    });

    it('supports an inverted output range', () => {
        expect(_mapLinear(5, 0, 10, 100, 0)).toBe(50);
        expect(_mapLinear(0, 0, 10, 100, 0)).toBe(100);
    });
});

describe('_countDecimals', () => {
    it('counts the digits after the decimal point', () => {
        expect(_countDecimals(1)).toBe(0);
        expect(_countDecimals(1.5)).toBe(1);
        expect(_countDecimals(0.001)).toBe(3);
        expect(_countDecimals(-2.25)).toBe(2);
    });
});
