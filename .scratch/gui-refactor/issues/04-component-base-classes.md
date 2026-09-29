# 04: `Component`/`BoundComponent` base classes + Toggle migration (Phase 2 start)

**What to build:** The shared behaviour duplicated across every component (label/tooltip resolution, `onUpdate` propagation, bound-value handling, `readonly` state) moves into two internal, non-exported abstract base classes. Toggle is migrated onto the new base as a proof that the shape works end-to-end, with the build green throughout.

Decisions already made (see Journal in `REFACTORING.md`, 2026-09-25): two-level base (`Component`, `BoundComponent`), neither exported (no public API change). Components no longer read `wrapper`, `onUpdate`, `firstParent`, `isFolder`, `imageContainer`, `_mapLinear`/`_countDecimals` off their parent — only a minimal Container interface (`append(el)`, `notifyUpdate()`).

**Blocked by:** 01, 02

**Status:** done

- [x] `src/components/Component.ts`: abstract base with `element`, `notifyUpdate()` (calls `parent.notifyUpdate()`, replacing the duplicated `onUpdate` block), and label/tooltip resolution.
- [x] `src/components/BoundComponent.ts extends Component`: adds `obj`, `prop`, `bindSharedProp`, `onChange(cb)` (single callback, replaced on each call), and `readonly` handling (`data-readonly`, `aria-readonly`, `tabindex`).
- [x] Minimal Container interface (`append(el)`, `notifyUpdate()`) defined and used in place of the full `GUI` type.
- [x] `append(el)` resets `imageContainer` to `null` in one place instead of in every factory method.
- [x] Toggle migrated onto `BoundComponent`, `npm run build` green.
- [x] Unit tests for `Component`/`BoundComponent` against a fake two-member Container.

## Comments

Implemented: `src/components/Component.ts` (abstract base — `element`, `notifyUpdate()` delegating to `container.notifyUpdate()`, `resolveLabel`/`resolveTooltip`) and `src/components/BoundComponent.ts` (extends `Component` — `obj`/`prop`/`propEntry` via `bindSharedProp`, single-callback `onChange`/`emitChange`, `applyReadonlyAttributes` covering `data-readonly`/`aria-readonly`/`tabindex`, and a per-concrete-class `[GUI] <name>() invalid parameters...` error derived from `new.target.name`). `Container` interface (`append`, `notifyUpdate`) lives in `Component.ts`; `GUI` now `implements Container` with `append()` (resets `imageContainer` then appends to `wrapper`) and `notifyUpdate()` (the same `onUpdate`/`firstParent` fallback previously duplicated per component). `Toggle` migrated onto `BoundComponent`, dropping its local `onUpdate` fan-out block and readonly-attribute lines in favour of the base. Only `toggle()`'s factory method in `index.ts` had its `this.imageContainer = null` line removed (the other factory methods still set it directly, since only Toggle migrated onto the new `append()` path — full removal is for later components' migration). Unit tests: `Component.test.ts` and `BoundComponent.test.ts`, both against a fake two-member `Container`. `npm run build`: 105 passed, 1 expected fail (unchanged baseline from ticket 01).
