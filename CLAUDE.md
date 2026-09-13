# CLAUDE.md

Guide pour travailler sur **Ahoy!** — bataille navale au thème pirate.

## Le projet

SPA **Vue 3.5 + Vite 8**, sans framework UI, déployée sur Netlify (`netlify.toml` : publish `dist`, redirect SPA `/* → /index.html`).

Le jeu est **desktop uniquement** : `src/App.vue` affiche une modale bloquante en dessous de 1100px de large. Ne pas supposer qu'il est responsive.

## Commandes

```bash
npm run dev         # dev server Vite
npm run build       # build prod → dist/
npm run preview     # sert le build
npm test            # vitest run
npm run test:watch  # vitest en watch
```

**Pas de lint pour l'instant** : ESLint 6 ne comprend pas les SFC Vue 3 et a été retiré avec Vue CLI. ESLint 9 en flat config revient avec #63. D'ici là, aucune barrière de formatage automatique.

- Tests : **Vitest** (`vitest.config.mjs`, specs dans `tests/**/*.spec.js`, alias `@` identique à celui de vue-cli). Environnement `jsdom`. Couverture volontairement minimale au départ — les classes de `src/classes/` sont du JS pur sans dépendance Vue, ce sont les seams naturels ; les composants demandent `@vue/test-utils` et le valent rarement ici.
- **Pas de typecheck** : JS pur, pas de TypeScript.
- **Node 24** (`.nvmrc`, `netlify.toml`). Le socle l'exige : `vue-i18n` 11 demande Node >= 22, Node 20 est EOL et Node 22 en maintenance.
- **Pas de `.npmrc`** : `npm install` réussit sans `legacy-peer-deps`. S'il se met à échouer, l'arbre de dépendances est faux — le corriger, pas remettre le drapeau.

## Architecture

- La logique de jeu est en **classes JS pures** dans `src/classes/`, en dehors du système de réactivité Vue.
- L'instance unique est créée dans `src/main.js` et injectée via `Vue.prototype.$game`. Les composants la récupèrent avec `data() { return { game: this.$game } }`.
- **Pas de store.** Vuex a été retiré (le store était vide et jamais lu) : tout l'état passe par `$game`.
- Persistance : `localStorage.ahoyGame` (JSON de l'objet `Game`), écrit par `newGame()` / `nextLevel()` et relu par `loadGame()` dans `src/classes/Game.js`. Aucune gestion d'erreur (mode privé Safari, quota dépassé).
- Router (`src/router/index.js`) : 4 routes — `/`, `/placement`, `/pre-fight`, `/fight`. Deux `beforeEach` :
  1. pose/retire une classe sur `<body>` depuis `meta.bodyClass` (le CSS des vues cible `body.home`, `body.fight`…) ;
  2. redirige vers Home si `window.vueApp.$game.player` est absent. C'est la raison pour laquelle `main.js` expose `window.vueApp`.

### Hiérarchie des classes

```
Character (map, fleet, health=20, mood, attack())
├── Player   (identity, phrase via PlayerProfileHelper)
└── Enemy    (IA de ciblage : _strategy / _postAttack, powers)
    └── SimpleSam, ChisanaKaizoku, JackTheBurned, MamanBrigitte, Z
```

Supports : `Map` (trois grilles 10×10 — `boatMap`, `hitMap`, `hoverMap`), `Fleet` → `Boat`, `Power`, et les helpers de `src/classes/helpers/`.

L'IA par défaut d'`Enemy` cherche en croix autour du premier touché (`firstHit`, `direction`, `hitStrike`). Un ennemi la spécialise en surchargeant `_strategy()` — ex. `SimpleSam` retourne `_randomHit()`, donc tir purement aléatoire.

## Ajouter un ennemi

Modèle de référence : `src/classes/enemies/SimpleSam/`.

1. `src/classes/enemies/<Nom>/<Nom>.js` — classe étendant `Enemy`, avec `name` / `phrase` / `nature` contenant des **clés i18n** (pas du texte), un `className` littéral, et ses `Power` construits dans le constructeur.
2. `<Nom>Fleet.js` (optionnel) — étendre `Fleet` et surcharger `_populateFleet()` pour une composition différente.
3. Ajouter les clés dans `src/locales/fr.json` **et** `en.json` (préfixe court, ex. `ss_*` pour Simple Sam).
4. Instancier dans `enemyList` de `src/classes/Game.js` — **l'ordre du tableau = l'ordre des niveaux**.
5. Images : `public/players/<ClassName>/` (`default`, `joy`, `despair`, `mocking`, `wanted` en `.webp`), `public/boats/<ClassName>/`, et `public/fight/<ClassName>/` si le décor change.
6. Ajouter le `className` aux tableaux `enemyClasses` de `src/main.js` **et** `src/router/index.js` (nettoyage des classes body).
7. Tour spécial : ajouter un `case` dans `_enemyTurn()` de `Game.js`. Sinon `_defaultEnemyTurn()` s'applique.

## Conventions

- **i18n** : clés en snake_case français (`nouvelle_partie`, `ss_main_power_name`). Les classes stockent la clé, le template fait `$t(...)`. Jamais de texte en dur dans `src/classes/`. Locale détectée depuis le navigateur, fallback `en`.
- **Styles** : LESS dans les SFC (`<style scoped lang="less">`, ou non-scoped pour cibler `body.<page>`). Pas de Sass, malgré la présence de `sass-loader` dans les devDependencies.
- **Positionnement** : design de référence **1920×1080**, converti à l'exécution par le mixin `src/mixins/responsivePosition.js`. Ne pas réintroduire jQuery : il a été retiré des dépendances.
- **Assets** : servis depuis `public/`, référencés en **chemin absolu** (`/home/bg.webp`) — pas d'import webpack. Images en `.webp` (migration faite). Audio via le singleton `src/utils/AudioManager.js` : toujours passer par lui, ne jamais instancier `new Audio()`.
- Tout listener `window` ajouté dans `created()` / `mounted()` doit être retiré dans `beforeDestroy()` — des fuites mémoire ont déjà été corrigées sur 6 composants.

## Pièges

- `Game._enemyTurn()` dispatche sur `this.enemyList[this.level].className`, **pas** sur `constructor.name` : ce dernier est mangé par la minification en production. Ne jamais « simplifier » vers `constructor.name`.
- `Game.js` contient `this.player.enemy.turn & !this.player.enemy.defeat` — un ET **bit-à-bit**, pas logique. Bug potentiel connu ; ne pas corriger à l'aveugle sans tester le cycle de tours.
- Les tours ennemis sont une cascade de `setTimeout` imbriqués : toute modification du timing doit être vérifiée en jeu.
- **Migration Vue 3 en cours** : les composants sont encore en Options API, la conversion en `<script setup>` est un ticket à part. La branche d'intégration est `migration/vue3` ; le jeu n'est pas promis vert avant #64.
- **Réactivité cassée pour l'instant** : `src/game.js` exporte une instance `Game` brute. Vue 3 n'observe plus un objet sur place comme Vue 2, donc deux composants en obtiennent des proxies distincts et une mutation faite dans un composant ne relance pas le rendu d'un autre. Symptôme vu : les cinq bateaux posés, `putBoats === size`, et le bouton « A l'abordage » qui reste désactivé. Corrigé par la racine `reactive()` unique de #56.
- `animate.css` est importé pour son CSS seul dans `main.js` — les transitions de combat utilisent ses classes `animate__*`. Ne pas le passer à `Vue.use()` : il n'expose pas d'`install`.

## Workflow et skills

Ce repo embarque le jeu de skills et de commandes de `la-haute-tour`, adapté à Ahoy. Le point d'entrée est **`/ask-matt`** : il route vers le bon skill selon la situation et documente le flux complet.

Flux principal : `/grilling` (affûter l'idée) → `/to-tickets` (découper en issues GitHub) → `/deliver` par issue (qui pilote `/tdd`, `/code-review`, `/simplify`, puis `/commit`). Rampes d'accès : `/diagnosing-bugs` quand quelque chose casse, `/wayfinder` pour un chantier trop gros pour une seule session.

- Les commandes (`.claude/commands/*.md`) sont des wrappers d'une ligne sur les skills (`.claude/skills/*/SKILL.md`).
- Conventions du tracker : `.claude/rules/issue-tracker.md` — GitHub Issues sur `florianleux/Ahoy`, via `gh`.
- `/deliver` travaille dans un worktree `../Ahoy-<numéro-issue>` et merge en `--ff-only` sur `main`.
- Ce repo n'a **pas de `specs/`** : la référence domaine, c'est ce fichier. Créer `specs/` seulement si un chantier multi-sessions en a vraiment besoin.

## Dette connue

- `REFACTORING_SUMMARY.md` — ce qui a déjà été corrigé (critical + high).
- `REMAINING_AUDIT_ISSUES.md` — 11 issues medium et 8 low **non traitées**.

Ne pas réattaquer ces sujets sans demande explicite.
