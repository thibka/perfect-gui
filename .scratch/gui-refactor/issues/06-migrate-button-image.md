# 06: Migrate Button and Image onto `Component`

**What to build:** Button and Image extend `Component` directly (not `BoundComponent`, since `onChange` and `readonly` have no meaning for them), removing their duplicated label/tooltip/`onUpdate` handling.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Button migrated onto `Component`.
- [ ] Image migrated onto `Component`; the `imageContainer = null` reset relied on by Image now comes from the shared `append(el)` (ticket 04), not a per-factory-method reset.
- [ ] Duplicated `onUpdate`/label/tooltip blocks removed from both components.
- [ ] `npm run build` green.
