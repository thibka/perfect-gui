# 07: Component lifecycle & `destroy()` (Phase 3 / P1)

**What to build:** Every Component and Container can be torn down cleanly: global event listeners are removed, `ResizeObserver`s disconnect, `bindSharedProp` subscriptions unregister (restoring a plain data property when the last listener leaves), and DOM nodes are removed. `kill()` on a `GUI` recursively destroys its whole tree, closing the memory-leak gaps described as P1 in `REFACTORING.md`.

**Blocked by:** 05, 06

**Status:** ready-for-agent

- [ ] `Component.destroy()` removes global listeners (via one `AbortController` per component, passed as `{ signal }` to `addEventListener`), disconnects any `ResizeObserver`, unregisters from `bindSharedProp`, and removes `element` from the DOM.
- [ ] Slider only attaches its `pointermove`/`pointerup` window listeners on `pointerdown` (matching how Angle and Vector2 already behave), instead of at construction time.
- [ ] `bindSharedProp` returns an `unbind()` function; when the last listener on a property is removed, the property is restored to a plain data property holding the current value.
- [ ] Containers track their children (Components and Folders); `kill()` destroys them recursively.
- [ ] `folder.destroy()` exists (name confirmed in the plan's Journal) and destroys the folder and its children.
- [ ] Tests: after `kill()`, no listeners remain (spy on `window.addEventListener`/`removeEventListener`), bound properties are plain data properties again, and the DOM subtree is empty.
