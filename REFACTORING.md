# Plan de refactoring — perfect-gui

Document de suivi issu de la revue d'architecture du 2026-09-24 (base : `v6.6.1`, commit `7c86708`).
On coche les cases au fil de l'avancement et on note ici toute décision prise en cours de route.

**Règles pour chaque étape**

- `npm run build` (tests + `tsc --noEmit` + build Vite) reste vert à la fin de chaque étape.
- Une étape = un commit, ou une petite série de commits cohérents.
- On ne change pas l'API publique sans le noter dans la section [Impact sur l'API publique](#impact-sur-lapi-publique).
- Le vocabulaire (Component, Panel, Container, Folder, Tabs/Tab, `onUpdate`, `onChange`) est défini dans [CONTEXT.md](CONTEXT.md).

---

## État des lieux

### Ce qu'on garde

- Le découpage par composant : `Xxx.ts`, `Xxx.test.ts` et `_xxx.css` injecté via `?inline`.
- `src/shared-prop.ts` : le registre `WeakMap` qui permet de lier plusieurs Components à une même propriété.
- L'API chaînable `gui.slider(obj, 'prop', opts).onChange(cb)` et les types d'options exportés.
- Le travail d'accessibilité : rôles ARIA et navigation clavier.
- L'absence de dépendance runtime.

### Problèmes identifiés

| # | Problème | Où | Gravité |
|---|---|---|---|
| P1 | `kill()` ne nettoie pas les composants : écouteurs `window`/`document` jamais retirés, `ResizeObserver` jamais déconnectés, accesseurs de `bindSharedProp` laissés sur les objets utilisateur, aucun moyen de supprimer un dossier ou un composant. | `index.ts` (`kill`), `Slider.ts:126-160`, `Vector2.ts`, `Angle.ts`, `shared-prop.ts` | Haute (fuites mémoire en SPA/HMR) |
| P2 | `Folder extends GUI` via `super({}, true)` : il hérite de `kill`, `toggleClose`, du drag et de `_handleResize` sans en avoir l'usage. Il existe un second chemin de construction, `options.isFolder` → `_folderConstructor`, qui n'est plus utilisé en interne. | `index.ts:141-153`, `291-301`, `829-841` | Moyenne |
| P3 | Les onglets sont monkey-patchés : `getTab?`, `setActiveTab?`… sont déclarés optionnels sur tout `GUI`. L'objet retourné par `tabs()` a pour `wrapper` le panneau actif *au moment de la création*, donc ajouter un contrôle directement sur cet objet donne un résultat ambigu. | `index.ts:130-135`, `579-728` | Moyenne |
| P4 | Du code est dupliqué dans les 10 composants : propagation de `onUpdate` (bloc `parent.onUpdate` / `firstParent.onUpdate`), résolution du label, du tooltip et du `readonly`. | `src/components/*.ts` | Moyenne |
| P5 | Les composants dépendent des internes de `GUI` : `parent._mapLinear`, `parent._countDecimals`, `parent.imageContainer`, `parent.wrapper`. `imageContainer = null` est répété dans chaque méthode de fabrique. | `index.ts:443-513`, `Slider.ts`, `Image.ts:82` | Moyenne |
| P6 | L'état global et les styles sont fragiles : `window.perfectGUI.instanceCounter` n'est jamais décrémenté, les styles communs ne sont injectés que si `instanceId == 0` (donc le `position: fixed/absolute` est figé par la 1ʳᵉ instance, et une 2ᵉ copie de la lib n'injecte rien), un `<style id="lm-gui-stylesheet">` est créé par instance (ids dupliqués), et le calcul de position est dupliqué entre `_styleInstance` et `_handleResize`. | `index.ts:194-289`, `326-396` | Moyenne |
| P7 | Le typage est faible : `obj: any` partout, donc les noms de propriétés ne sont pas vérifiés côté utilisateur. | méthodes de fabrique + composants | Basse |
| P8 | Code mort et outillage : `src/plugins/three.js` utilise une ancienne API (non typé, non exporté, non fonctionnel). `.eslintrc.js` est au format legacy alors que le projet est en ESLint 9, en CJS dans un package `"type": "module"`, et ne gère pas TS. `onChange` remplace le callback précédent sans que ce soit documenté. | `src/plugins/`, `.eslintrc.js`, composants | Basse |

---

## Phase 0 — Filet de sécurité

Objectif : pouvoir refactorer `index.ts` sans régression, alors qu'il n'est quasiment pas testé aujourd'hui (seulement `_mapLinear` et `_countDecimals`).

- [ ] Tests d'intégration de `GUI` : création, `label`, `position` (4 coins), `container` (sélecteur et élément), `closed`, `collapsible`, `toggleClose`, `kill`.
- [ ] Test de caractérisation de la propagation de `onUpdate` (à faire en premier, avant toute migration) : un Component dans le Panel, dans un Folder, dans un Folder imbriqué et dans un Tab déclenche chacun `onUpdate` exactement une fois ; un Component en lecture seule et un changement programmatique (`obj.prop = x`) ne déclenchent rien.
- [ ] Tests des dossiers : imbrication, `closed`, clavier (Enter/Espace).
- [ ] Tests des onglets : `getTab`, `setActiveTab`, `getActiveTab`, navigation clavier.
- [ ] Test de non-régression P6 : une 2ᵉ GUI avec `container` doit être en `position: absolute`. Il est attendu en échec ; le marquer `it.fails` jusqu'à la phase 4.

## Phase 1 — Nettoyages sans risque (P5, P8)

- [x] Déplacer `_mapLinear` et `_countDecimals` dans `src/utils.ts` et mettre à jour Slider, Angle, etc. Garder temporairement des alias sur `GUI` s'ils sont considérés comme publics (voir l'impact API).
- [ ] Supprimer `src/plugins/three.js`, ou le réécrire en TS avec l'API actuelle. **Décision à prendre.**
- [ ] Migrer ESLint vers `eslint.config.js` (flat config) avec `typescript-eslint`, et ajouter un script `npm run lint`.
- [ ] Documenter dans le README que `onChange` remplace le callback précédent (décision prise : un seul callback par Component, voir le [Journal](#journal)).

## Phase 2 — Base commune des Components (P4, P5)

Décisions prises : classes de base abstraites (pas de simples helpers), non exportées (aucun changement d'API publique). Voir le [Journal](#journal).

- [ ] Créer `src/components/Component.ts`, classe de base abstraite qui porte ce que tous les Components ont en commun :
  - `element` ;
  - `notifyUpdate()`, qui appelle `parent.notifyUpdate()` et remplace le bloc `onUpdate` dupliqué ;
  - la résolution du label et du tooltip.
- [ ] Créer `src/components/BoundComponent.ts`, `BoundComponent extends Component`, pour les Components liés à `obj[prop]` (Slider, Toggle, Number, Color, List, Vector2, Angle, Text). Il porte :
  - `obj`, `prop` et `bindSharedProp` ;
  - `onChange(cb)` : un seul callback, remplacé à chaque appel ;
  - la gestion de `readonly` (`data-readonly`, `aria-readonly`, `tabindex`).
  Button et Image étendent `Component` directement : ni `onChange` ni `readonly` n'ont de sens pour eux.
- [ ] Interface minimale du Container vue par un Component : `append(el)` et `notifyUpdate()`, à la place du `GUI` complet. Les Components ne lisent plus `wrapper`, `onUpdate`, `firstParent`, `isFolder`, `imageContainer` ni `_mapLinear`/`_countDecimals`.
- [ ] `append(el)` remet `imageContainer` à `null` en un seul endroit, plutôt que dans chaque méthode de fabrique.
- [ ] Migrer les Components un par un, avec `npm run build` vert après chacun, dans cet ordre : Toggle (valide la forme de la base), Text, Number, Color, List, Slider, Angle, Vector2, puis Button et Image (Components non liés).
- [ ] Tester `Component`/`BoundComponent` avec un faux Container à deux membres.

## Phase 3 — Cycle de vie et destruction (P1)

Traitée après la phase 2, pas en même temps : la base n'a pas de `destroy()` avant cette phase.

- [ ] Ajouter `destroy()` sur `Component`, qui :
  - retire les écouteurs globaux (idéalement via un `AbortController` par composant : `addEventListener(..., { signal })`) ;
  - déconnecte le `ResizeObserver` ;
  - désinscrit le listener de `bindSharedProp` ;
  - retire `element` du DOM.
- [ ] Slider : n'ajouter les écouteurs `pointermove`/`pointerup` sur `window` qu'au `pointerdown`, comme Angle et Vector2 le font déjà, au lieu de les ajouter à la construction.
- [ ] `bindSharedProp` : renvoyer une fonction `unbind()`. Quand le dernier listener d'une propriété est retiré, restaurer une propriété de données simple avec la valeur courante.
- [ ] Le Container garde la liste de ses enfants (Components et Folders). `kill()` les détruit récursivement.
- [ ] Ajouter `folder.destroy()` (nom retenu, voir le [Journal](#journal)).
- [ ] Tests : après `kill()`, il ne reste aucun écouteur (spy sur `window.addEventListener`/`removeEventListener`), `obj.prop` redevient une propriété de données et le DOM est vide.

## Phase 4 — Hiérarchie des conteneurs (P2, P3, P6)

- [ ] Extraire une classe de base `Container` qui porte :
  - `wrapper`, `parent` et `children` (plus de `firstParent` ni de `isFolder` exposés aux Components) ;
  - les méthodes de fabrique (`slider`, `toggle`, `folder`, `tabs`…) ;
  - `append` et `notifyUpdate`, qui transmet à son propre parent jusqu'au Panel, seul à déclencher `onUpdate`.
- [ ] `GUI extends Container` : panneau racine avec position, drag, resize, `toggleClose`, `kill` et styles.
- [ ] `Folder extends Container` : en-tête pliable, `open()`, `close()` et `remove()`.
- [ ] `Tabs extends Container`, ou une classe non-conteneur qui expose `getTab(i)`, `setActiveTab(i)`, `getActiveTab()` et `element`. Retirer les propriétés optionnelles monkey-patchées de `GUI`. **Décider** du comportement de `tabs(...).slider(...)` : interdit, ou ajout dans l'onglet actif courant.
- [ ] Supprimer le chemin `options.isFolder` / `_folderConstructor` et le second paramètre `isFolder` du constructeur.
- [ ] Styles :
  - injection idempotente des styles communs, basée sur la présence d'un `<style data-p-gui>` dans `document.head` plutôt que sur `instanceId == 0` ;
  - `position` porté par une classe ou un attribut par instance (`.p-gui--absolute`) plutôt que figé dans la feuille commune ;
  - une seule feuille de style pour les styles communs, et les styles d'instance posés en `style` inline ou via des variables CSS.
- [ ] Remplacer `window.perfectGUI.instanceCounter` par un compteur de module, et regrouper le calcul de position (`_styleInstance` + `_handleResize`) dans une seule fonction `_computeOffset()`.
- [ ] Le test `it.fails` de la phase 0 passe : le repasser en `it`.

## Phase 5 — Typage (P7)

- [ ] Rendre les méthodes de fabrique génériques. Par exemple :
  ```ts
  slider<T extends object, K extends KeysOfType<T, number>>(obj: T, prop: K, options?: SliderOptions): Slider
  ```
  Idem pour toggle (`boolean`), text et color (`string`), et vector2.
- [ ] Remplacer `any` par `unknown` ou par des génériques dans les composants et dans `shared-prop.ts`.
- [ ] Ajouter des tests de types (`expectTypeOf` de Vitest) : une propriété inexistante ou mal typée doit être refusée.

---

## Impact sur l'API publique

À tenir à jour. Tout changement cassant implique une version **7.0.0**.

| Changement | Phase | Cassant ? | Mitigation |
|---|---|---|---|
| `_mapLinear` / `_countDecimals` retirés de `GUI` | 1 | Oui, s'ils sont utilisés en externe (préfixe `_` = interne) | Alias `@deprecated` jusqu'à la v7 |
| Suppression de l'option `isFolder` du constructeur | 4 | Théoriquement (non documentée) | — |
| `Folder` n'hérite plus de `kill`, `toggleClose`… | 4 | Oui pour `Folder` (exporté) | Documenter dans le changelog |
| `tabs()` retourne un `Tabs` dédié | 4 | Selon la décision sur `tabs(...).slider(...)` | — |
| Méthodes de fabrique génériques | 5 | Peut faire apparaître des erreurs TS chez les utilisateurs qui passaient des props invalides | Changelog |

## Décisions en attente

- [ ] `src/plugins/three.js` : supprimer ou réécrire ?
- [x] `onChange` : un seul callback (documenté). Décidé le 2026-09-25.
- [ ] `tabs(...).slider(...)` : interdit ou ajout dans l'onglet actif ?
- [x] Nom de la méthode de suppression : `destroy()`. Décidé le 2026-09-25.
- [ ] Garder `dist/` versionné (unpkg/GitHub Pages) ou le générer uniquement à la publication ?

## Journal

| Date | Étape | Notes |
|---|---|---|
| 2026-09-24 | Revue d'architecture | Création de ce document |
| 2026-09-25 | Grilling de la phase 2 | « Controller » renommé « Component » (voir CONTEXT.md). Base en deux niveaux, `Component` et `BoundComponent`, non exportée. Interface Container réduite à `append` et `notifyUpdate`. `onUpdate` : changements utilisateur uniquement, réservé au Panel, remontée par `parent.notifyUpdate()`. `onChange` : un seul callback. `destroy()` : phase 3, nom retenu. Pas d'ADR. |
