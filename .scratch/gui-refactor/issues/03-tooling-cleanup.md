# 03: Tooling cleanup — ESLint flat config, `three.js` rewrite, document `onChange` (P8)

**What to build:** The project's lint tooling matches its actual stack (ESLint 9, TypeScript, ESM `"type": "module"`), the `three.js` plugin is a working TypeScript module again instead of dead code against an old API, and the single-callback semantics of `onChange` (decided 2026-09-25) are documented for library users.

Decision (confirmed): rewrite `src/plugins/three.js` in TypeScript against the current perfect-gui API, rather than deleting it.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `.eslintrc.js` replaced by `eslint.config.js` (flat config) using `typescript-eslint`.
- [x] `npm run lint` script added and passing.
- [x] `src/plugins/three.js` rewritten as a typed `.ts` module against the current component/API surface, exported properly, and covered by at least a smoke test.
- [x] README documents that calling `onChange` again replaces the previous callback (only one callback per Component).
