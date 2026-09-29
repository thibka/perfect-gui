# 02: Move `_mapLinear`/`_countDecimals` to `utils.ts` (P5)

**What to build:** `_mapLinear` and `_countDecimals` live in `src/utils.ts` as standalone functions instead of being reached through `parent._mapLinear`/`parent._countDecimals` on `GUI`. Every component that used them (Slider, Angle, etc.) imports them directly. This removes one of the internal couplings components have on `GUI`, which the base-class work in ticket 04 depends on.

If these are considered part of the public API (used externally, not just internally despite the `_` prefix), keep deprecated aliases on `GUI` until v7 — record this in the "Impact sur l'API publique" table in `REFACTORING.md`.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `_mapLinear` and `_countDecimals` exist in `src/utils.ts`, fully tested (existing tests for these should keep passing, relocated as needed).
- [ ] Slider, Angle, and any other component using these functions import from `utils.ts` instead of `parent._mapLinear`/`parent._countDecimals`.
- [ ] `GUI` no longer defines these methods itself (aliases only if the API-impact decision requires them).
- [ ] `npm run build` is green.
