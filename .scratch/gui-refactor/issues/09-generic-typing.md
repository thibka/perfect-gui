# 09: Generic typing of factory methods (Phase 5 / P7)

**What to build:** Factory methods on `Container` are generic over the bound object's keys, so passing a nonexistent or wrong-typed property name is a compile error for library consumers, instead of everything being typed `obj: any`.

```ts
slider<T extends object, K extends KeysOfType<T, number>>(obj: T, prop: K, options?: SliderOptions): Slider
```

Same pattern for `toggle` (constrained to `boolean` keys), `text`/`color` (constrained to `string` keys), and `vector2`.

**Blocked by:** 08

**Status:** ready-for-agent

- [ ] `slider`, `toggle`, `text`, `color`, `vector2` (and other bound factory methods) are generic and reject a property name that doesn't exist or doesn't match the expected type, at compile time.
- [ ] `any` replaced by `unknown` or generics throughout the components and `shared-prop.ts`.
- [ ] Type tests added with Vitest's `expectTypeOf`: a nonexistent or mistyped property is rejected by `tsc`.
- [ ] Changelog note added per the "Impact sur l'API publique" table: this may surface new TS errors for consumers who were passing invalid props.
