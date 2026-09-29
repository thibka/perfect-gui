# 04: `Component`/`BoundComponent` base classes + Toggle migration (Phase 2 start)

**What to build:** The shared behaviour duplicated across every component (label/tooltip resolution, `onUpdate` propagation, bound-value handling, `readonly` state) moves into two internal, non-exported abstract base classes. Toggle is migrated onto the new base as a proof that the shape works end-to-end, with the build green throughout.

Decisions already made (see Journal in `REFACTORING.md`, 2026-09-25): two-level base (`Component`, `BoundComponent`), neither exported (no public API change). Components no longer read `wrapper`, `onUpdate`, `firstParent`, `isFolder`, `imageContainer`, `_mapLinear`/`_countDecimals` off their parent — only a minimal Container interface (`append(el)`, `notifyUpdate()`).

**Blocked by:** 01, 02

**Status:** ready-for-agent

- [ ] `src/components/Component.ts`: abstract base with `element`, `notifyUpdate()` (calls `parent.notifyUpdate()`, replacing the duplicated `onUpdate` block), and label/tooltip resolution.
- [ ] `src/components/BoundComponent.ts extends Component`: adds `obj`, `prop`, `bindSharedProp`, `onChange(cb)` (single callback, replaced on each call), and `readonly` handling (`data-readonly`, `aria-readonly`, `tabindex`).
- [ ] Minimal Container interface (`append(el)`, `notifyUpdate()`) defined and used in place of the full `GUI` type.
- [ ] `append(el)` resets `imageContainer` to `null` in one place instead of in every factory method.
- [ ] Toggle migrated onto `BoundComponent`, `npm run build` green.
- [ ] Unit tests for `Component`/`BoundComponent` against a fake two-member Container.
