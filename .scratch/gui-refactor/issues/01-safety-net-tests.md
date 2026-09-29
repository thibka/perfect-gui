# 01: Safety-net tests for GUI (Phase 0)

**What to build:** A test suite that pins down current `GUI` behaviour (creation, layout, folders, tabs, `onUpdate` propagation, `kill()`) so that later phases of the refactor (see `REFACTORING.md`) can proceed without silently regressing behaviour that today has almost no test coverage.

Write the `onUpdate` propagation characterization test first, before anything else in this ticket: it captures the exact fan-out rule (Component → Panel, through Folder, nested Folder, and Tab) that later phases must preserve.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Characterization test: a Component directly in the Panel, one inside a Folder, one inside a nested Folder, and one inside a Tab each trigger `onUpdate` exactly once on user interaction.
- [x] Characterization test: a readonly Component and a programmatic change (`obj.prop = x`) do NOT trigger `onUpdate`.
- [x] Integration tests for `GUI`: construction, `label`, `position` (all 4 corners), `container` (CSS selector and element), `closed`, `collapsible`, `toggleClose`, `kill`.
- [x] Folder tests: nesting, `closed` state, keyboard interaction (Enter/Space).
- [x] Tabs tests: `getTab`, `setActiveTab`, `getActiveTab`, keyboard navigation.
- [x] Regression test for P6 (multi-instance positioning bug): a second `GUI` instance created with a `container` option must render with `position: absolute`. Write it as `it.fails` — it is expected to fail until ticket 08 fixes P6.

## Comments

Implemented: `src/on-update-propagation.test.ts` (fan-out characterization tests) and integration tests added to `src/index.test.ts` (GUI construction/toggleClose/kill, Folder, Tabs, P6 regression as `it.fails`). Added an `Element.prototype.scrollTo` stub to `test/setup.ts` since jsdom doesn't implement it and `toggleClose()` depends on it. Full suite (`npm run build`) passes: 90 passed, 1 expected fail.
