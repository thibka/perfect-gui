# 08: Container hierarchy — `Container`/`GUI`/`Folder`/`Tabs` + style/position fixes (Phase 4 / P2, P3, P6)

**What to build:** `GUI`, `Folder`, and `Tabs` each become their own class built on a shared `Container` base, instead of `Folder` inheriting unrelated `GUI` behaviour (drag, resize, `toggleClose`) and `Tabs` being monkey-patched onto `GUI`. Style/position bugs affecting multi-instance usage (P6) are fixed at the same time since they live in this same area of the code.

Decision (confirmed): `tabs(...).slider(...)` and similar chaining is **forbidden**. `Tabs` exposes only `getTab(i)`, `setActiveTab(i)`, `getActiveTab()`, and `element` — no factory methods — so there is no ambiguity about which tab a control would land in.

**Blocked by:** 07

**Status:** ready-for-agent

- [ ] `Container` base class holds `wrapper`, `parent`, `children`, the factory methods (`slider`, `toggle`, `folder`, `tabs`, …), `append`, and `notifyUpdate` (which bubbles to its own parent up to the Panel — only the Panel fires `onUpdate`).
- [ ] `GUI extends Container`: root panel with position, drag, resize, `toggleClose`, `kill`, and styles.
- [ ] `Folder extends Container`: collapsible header, `open()`, `close()`, `remove()`. No longer inherits `kill`, `toggleClose`, drag, or resize.
- [ ] `Tabs` exposes `getTab(i)`, `setActiveTab(i)`, `getActiveTab()`, `element` only; no monkey-patched optional properties left on `GUI`; `tabs(...).slider(...)` is not possible (type-level and/or runtime).
- [ ] `options.isFolder` / `_folderConstructor` code path and the constructor's `isFolder` parameter are removed.
- [ ] Common styles are injected idempotently, keyed on the presence of a `<style data-p-gui>` element in `document.head`, not on `instanceId == 0`.
- [ ] Per-instance `position` (fixed/absolute) is carried by a class or attribute (e.g. `.p-gui--absolute`) rather than baked into the shared stylesheet.
- [ ] `window.perfectGUI.instanceCounter` replaced by a module-level counter; `_styleInstance` and `_handleResize`'s position math merged into a single `_computeOffset()`.
- [ ] The P6 regression test from ticket 01 (`it.fails`) now passes and is flipped to a normal `it`.
