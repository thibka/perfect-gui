# 05: Migrate remaining bound components onto `BoundComponent`

**What to build:** Text, Number, Color, List, Slider, Angle, and Vector2 all extend `BoundComponent` instead of duplicating label/tooltip/`onUpdate`/`readonly` logic. Each component keeps working exactly as before from the library consumer's point of view; only the internal implementation changes.

Migrate one component at a time, in this order (matches ascending complexity per `REFACTORING.md`): Text, Number, Color, List, Slider, Angle, Vector2. Keep `npm run build` green after each one.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Text migrated onto `BoundComponent`.
- [ ] Number migrated onto `BoundComponent`.
- [ ] Color migrated onto `BoundComponent`.
- [ ] List migrated onto `BoundComponent`.
- [ ] Slider migrated onto `BoundComponent`.
- [ ] Angle migrated onto `BoundComponent`.
- [ ] Vector2 migrated onto `BoundComponent`.
- [ ] Duplicated `onUpdate`/label/tooltip/`readonly` blocks removed from all seven components.
- [ ] `npm run build` green after each component migration.
