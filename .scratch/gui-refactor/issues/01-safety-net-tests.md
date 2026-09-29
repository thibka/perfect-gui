# 01: Safety-net tests for GUI (Phase 0)

**What to build:** A test suite that pins down current `GUI` behaviour (creation, layout, folders, tabs, `onUpdate` propagation, `kill()`) so that later phases of the refactor (see `REFACTORING.md`) can proceed without silently regressing behaviour that today has almost no test coverage.

Write the `onUpdate` propagation characterization test first, before anything else in this ticket: it captures the exact fan-out rule (Component → Panel, through Folder, nested Folder, and Tab) that later phases must preserve.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Characterization test: a Component directly in the Panel, one inside a Folder, one inside a nested Folder, and one inside a Tab each trigger `onUpdate` exactly once on user interaction.
- [ ] Characterization test: a readonly Component and a programmatic change (`obj.prop = x`) do NOT trigger `onUpdate`.
- [ ] Integration tests for `GUI`: construction, `label`, `position` (all 4 corners), `container` (CSS selector and element), `closed`, `collapsible`, `toggleClose`, `kill`.
- [ ] Folder tests: nesting, `closed` state, keyboard interaction (Enter/Space).
- [ ] Tabs tests: `getTab`, `setActiveTab`, `getActiveTab`, keyboard navigation.
- [ ] Regression test for P6 (multi-instance positioning bug): a second `GUI` instance created with a `container` option must render with `position: absolute`. Write it as `it.fails` — it is expected to fail until ticket 08 fixes P6.
