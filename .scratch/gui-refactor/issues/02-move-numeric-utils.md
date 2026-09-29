# 02: Move `_mapLinear`/`_countDecimals` to `utils.ts` (P5)

**What to build:** `_mapLinear` and `_countDecimals` live in `src/utils.ts` as standalone functions instead of being reached through `parent._mapLinear`/`parent._countDecimals` on `GUI`. Every component that used them (Slider, Angle, etc.) imports them directly. This removes one of the internal couplings components have on `GUI`, which the base-class work in ticket 04 depends on.

If these are considered part of the public API (used externally, not just internally despite the `_` prefix), keep deprecated aliases on `GUI` until v7 — record this in the "Impact sur l'API publique" table in `REFACTORING.md`.

**Blocked by:** 01

**Status:** done

- [x] `_mapLinear` and `_countDecimals` exist in `src/utils.ts`, fully tested (existing tests for these should keep passing, relocated as needed).
- [x] Slider, Angle, and any other component using these functions import from `utils.ts` instead of `parent._mapLinear`/`parent._countDecimals`.
- [x] `GUI` no longer defines these methods itself (aliases only if the API-impact decision requires them).
- [x] `npm run build` is green.

## Comments

Implemented: moved the logic into `src/utils.ts` (exported `_mapLinear`/`_countDecimals`), with tests relocated to `src/utils.test.ts`. Slider, Vector2, Number, and Angle now import directly from `utils.ts` instead of going through `this.parent._mapLinear`/`this.parent._countDecimals`. Since `REFACTORING.md`'s API-impact table already commits to the "keep deprecated alias until v7" mitigation for these (prefixed `_` but potentially used externally), `GUI._mapLinear`/`GUI._countDecimals` remain as thin `@deprecated` forwarding methods; `index.test.ts` now tests them as aliases rather than duplicating the logic tests. `npm run build`: 92 passed, 1 expected fail (unchanged from ticket 01's baseline).
