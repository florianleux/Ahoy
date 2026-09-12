# Socle d'outillage Vue 3 + Vite + TypeScript

Recherche pour l'issue [#37](https://github.com/florianleux/Ahoy/issues/37) (parent : #36). Relevé factuel au **12 septembre 2026**. Aucune décision n'est prise ici : le document sert d'entrée aux tickets de stratégie.

Les numéros de version proviennent du registre npm interrogé le 12/09/2026 (`npm view <paquet> version engines peerDependencies`). Le registre est la source qui fait foi sur « ce qui est publié » ; les docs officielles sont citées pour tout ce qui relève du comportement.

---

## 1. Versions courantes et compatibilité mutuelle

| Paquet | `latest` au 12/09/2026 | Publié le | Contraintes de pairs déclarées |
| --- | --- | --- | --- |
| `vue` | 3.5.42 | 2026-08-27 | — (3.6.0-rc.8 existe, publié le 2026-09-11, toujours en RC) |
| `vite` | 8.3.0 | 2026-09-10 | — |
| `@vitejs/plugin-vue` | 6.0.8 | 2026-07-14 | `vue ^3.2.25`, `vite ^5 \|\| ^6 \|\| ^7 \|\| ^8` |
| `vitest` | 5.0.0 | 2026-09-03 | `vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0` |
| `vue-tsc` | 3.3.11 | 2026-08-21 | `typescript >=5.0.0` |
| `typescript` | 7.0.2 | 2026-07-08 | — (voir §4 : **7.x n'est pas utilisable avec `vue-tsc`**) |
| `vue-router` | 5.3.1 | 2026-09-02 | `vue ^3.5.34 \|\| ^4.0.0` |
| `vue-i18n` | 11.4.10 | 2026-08-25 | `vue ^3.0.0` |
| `eslint` | 10.10.0 | 2026-09-04 | — |
| `eslint-plugin-vue` | 10.11.0 | — | `eslint ^8.57 \|\| ^9 \|\| ^10`, `vue-eslint-parser ^10.3.0` |
| `prettier` | 3.9.6 | — | — |
| `@vue/test-utils` | 2.5.0 | — | `vue 3.x` |
| `@vue/tsconfig` | 0.9.1 | — | — |
| `create-vue` | 3.23.0 | 2026-07-21 | — |

Deux points où l'énoncé du ticket est en retard sur la réalité publiée :

- **`vue-router` n'est plus en 4 mais en 5.** La ligne 4 est encore accessible via le tag `next` (4.0.13) et la ligne 3 via `legacy` (3.6.5), mais `latest` est `5.3.1`. La v5 déclare `vue ^3.5.34 || ^4.0.0` : c'est bien la ligne Vue 3 courante, et elle impose un plancher `vue >= 3.5.34`, ce qui exclut d'appairer vue-router 5 avec un Vue 3.4 ou antérieur.
- **`vue-i18n` n'est plus en 9 mais en 11.** Les tags du paquet montrent la stratification : `legacy` = 8.28.2 (la ligne Vue 2, celle installée ici), `legacy9` / `stable9` = 9.14.5, `legacy10` = 10.0.8, `stable` = 11.1.10, `latest` = 11.4.10, `next` = 12.0.0-alpha.4. La doc d'installation officielle confirme que v11 est la version documentée, qu'elle « continue d'être maintenue », et qu'elle exige Vue 3.0.0+ ([vue-i18n.intlify.dev/guide/installation](https://vue-i18n.intlify.dev/guide/installation)).

Deux compléments non listés au ticket mais imposés par le contenu du dépôt :

- `@intlify/unplugin-vue-i18n` 11.2.5 est le remplaçant Vite de `@kazupon/vue-i18n-loader` (le loader webpack actuellement en devDependencies). Ses pairs : `vite ^6 || ^7 || ^8`, `vue ^3.2.25`. Son `engines.node` est `>= 22.13`.
- `less` 4.9.1. Vite n'a pas besoin de `less-loader` : la doc dit explicitement qu'« il n'est pas nécessaire d'installer de plugin Vite spécifique pour [les préprocesseurs], mais le préprocesseur lui-même doit être installé » ([vite.dev/guide/features](https://vite.dev/guide/features)). `less-loader` et `sass-loader` disparaissent donc purement et simplement.

Vue 3.6 est en `rc.8` depuis le 11/09/2026 : elle est proche mais pas sortie. Tout ce qui suit se lit sur la ligne 3.5.

---

## 2. Version minimale de Node exigée par le socle

C'est le point le plus dur du dossier : le dépôt est épinglé sur **Node 16** (`.nvmrc`, `netlify.toml` `NODE_VERSION = "16"`), et **aucun** élément du socle Vue 3 + Vite ne tourne sur Node 16.

Champs `engines` déclarés, tels que publiés :

| Paquet | `engines.node` |
| --- | --- |
| `vite@8.3.0` | `^20.19.0 \|\| >=22.12.0` |
| `@vitejs/plugin-vue@6.0.8` | `^20.19.0 \|\| >=22.12.0` |
| `vitest@5.0.0` | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
| `vitest@4.1.11` | `^20.0.0 \|\| ^22.0.0 \|\| >=24.0.0` |
| `eslint@10.10.0` | `^20.19.0 \|\| ^22.13.0 \|\| >=24` |
| `eslint-plugin-vue@10.11.0` | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` |
| `vue-i18n@11.4.10` | `>= 22` |
| `@intlify/unplugin-vue-i18n@11.2.5` | `>= 22.13` |
| `jsdom@29.1.1` | `^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0` |
| `jsdom@30.0.1` | `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0` |
| `create-vue@3.23.0` | `^22.18.0 \|\| >=24.12.0` |
| `oxlint@1.82.0` | `^20.19.0 \|\| >=22.12.0` |
| `prettier@3.9.6` | `>=14` |
| `less@4.9.1` | `>=18` |
| `typescript@7.0.2` | `>=16.20.0` |

La doc Vite énonce la contrainte en toutes lettres : « Vite requires Node.js version 20.19+, 22.12+ » ([vite.dev/guide](https://vite.dev/guide/)). La doc de migration ESLint v10 énonce la sienne : v20.19+, v22.13+, v24+ ([eslint.org/docs/latest/use/migrate-to-10.0.0](https://eslint.org/docs/latest/use/migrate-to-10.0.0)).

**Le contraignant, c'est `vue-i18n` 11 (`>= 22`), qui à lui seul élimine toute la ligne Node 20.** Une fois Node 20 hors jeu, le plancher réel dépend des deux paquets de test :

- avec `vitest` 4 + `jsdom` 29 (le couple que `create-vue` scaffolde aujourd'hui) : **Node 22.13** ;
- avec `vitest` 5 + `jsdom` 30 (les `latest`) : **Node 22.22.2**.

Calendrier officiel des lignes Node ([nodejs/Release `schedule.json`](https://github.com/nodejs/Release/blob/main/schedule.json)) :

| Ligne | Statut | Fin de support |
| --- | --- | --- |
| v16 « Gallium » | terminée | 2023-09-11 |
| v18 « Hydrogen » | terminée | 2025-04-30 |
| v20 « Iron » | terminée | 2026-04-30 |
| v22 « Jod » | maintenance depuis 2025-10-21 | 2027-04-30 |
| v24 « Krypton » | **LTS active**, maintenance à partir du 2026-10-20 | 2028-04-30 |
| v26 | courante, LTS le 2026-10-28 | 2029-04-30 |

Node 16 est mort depuis trois ans ; Node 20 l'est depuis avril 2026. Node 22 n'est plus qu'en maintenance et sort du support dans dix-neuf mois. **La seule ligne à la fois LTS active et compatible avec tout le socle, y compris `create-vue`, est Node 24** (`>= 24.12` pour exécuter `create-vue`, `>= 24.15` si l'on prend `jsdom` 30). Netlify devra donc passer de `NODE_VERSION = "16"` à `"24"`, et `.nvmrc` avec.

---

## 3. État réel de `@vue/compat`

**Toujours publié et toujours maintenu, contrairement à ce que laisse croire sa documentation.**

Faits vérifiables :

- `@vue/compat@latest` = **3.5.42**, publié le **2026-08-27**, c'est-à-dire le même jour et le même numéro que `vue@3.5.42`. Le paquet suit la ligne Vue au version-for-version (son `peerDependencies` est `vue: "3.5.42"`, épinglé exact).
- Il est aussi publié sur toute la ligne 3.6 en préparation : `3.6.0-alpha.*`, `3.6.0-beta.1` à `beta.17`, `3.6.0-rc.1` à **`3.6.0-rc.8`**. Il n'est donc pas abandonné à la sortie de 3.6.
- Le paquet **n'est pas marqué `deprecated`** sur npm.
- Le dossier `packages/vue-compat` est toujours présent dans la branche `main` de [vuejs/core](https://github.com/vuejs/core) (vérifié via l'API GitHub sur `repos/vuejs/core/contents/packages`).

**La documentation, elle, est périmée.** [v3-migration.vuejs.org/migration-build](https://v3-migration.vuejs.org/migration-build) et le README de `packages/vue-compat` portent toujours la phrase d'origine : le build de migration « sera fourni à partir de la 3.1 et continuera d'être publié avec la ligne 3.2 », avec l'intention d'« arrêter de le publier dans une future version mineure, pas avant fin 2021 ». Cette annonce a cinq ans et n'a jamais été exécutée. Il faut donc lire l'état du paquet dans le registre, pas dans la doc — mais il faut aussi acter qu'aucun engagement formel de support n'existe.

### Limites documentées

La doc liste trois situations où le build de migration ne suffit pas :

1. **Les dépendances qui touchent aux internes de Vue 2.** La doc nomme explicitement **Vuetify**, Quasar et ElementUI comme exemples : un composant qui s'appuie sur des propriétés privées de VNode ou sur les internes de Vue 2 ne fonctionne pas sous `@vue/compat`. C'est le point qui compte ici — le projet dépend de `vuetify@^2.2.11`, et Vuetify 2 est exactement le cas cité.
2. **IE11** : Vue 3 a abandonné le support, sans recours.
3. **Les setups SSR sur mesure** : non concerné ici (SPA pure, publiée statiquement sur Netlify).

S'y ajoute la limite de principe énoncée par le README : le build ne couvre « que les API et comportements Vue 2 publiquement documentés ». Tout ce qui reposait sur du non-documenté n'est pas couvert.

Enfin, le tableau de référence des fonctionnalités classe quelques points comme franchement **incompatibles** (pas seulement « avertis ») : le changement de priorité `v-if` / `v-for`, l'emplacement de `key` dans les templates, et les composants fonctionnels déclarés en SFC.

### Comment il se branche sous Vite

La doc donne la configuration exacte : aliaser `vue` vers `@vue/compat` et passer le mode de compat au compilateur de templates.

```js
// vite.config.js
export default {
  resolve: {
    alias: { vue: '@vue/compat' }
  },
  plugins: [
    vue({
      template: { compilerOptions: { compatConfig: { MODE: 2 } } }
    })
  ]
}
```

Le mode se raffine ensuite globalement (désactiver les features une par une) ou composant par composant via l'option `compatConfig`. Les features préfixées `COMPILER_` se règlent obligatoirement au niveau du build, pas dans le composant. La doc précise qu'une application sous build de migration « peut être mise en production avant que la migration soit terminée », au prix d'un léger surcoût de taille et de performance.

**Conclusion opérationnelle pour le ticket de stratégie :** `@vue/compat` est techniquement disponible, mais la dépendance Vuetify 2 est le cas d'exclusion nommément cité par sa propre documentation. La question « bascule progressive possible ? » se ramène donc à « que fait-on de Vuetify 2 ? ». Pour information, `vuetify@latest` est **4.2.1**, avec `peerDependencies.vue: "^3.5.0 || ^3.6.0-0"` — c'est un autre paquet, pas une montée de version en place.

---

## 4. TypeScript : le piège de la version 7

`typescript@latest` est **7.0.2** (publié le 2026-07-08). **Il ne faut pas le prendre.**

`create-vue` 3.23.0 épingle `typescript: "~6.0.0"` dans le `package.json` qu'il génère, alors que 7.0.2 est disponible depuis deux mois. La raison est donnée par le mainteneur de `vuejs/language-tools` dans l'[issue #5381](https://github.com/vuejs/language-tools/issues/5381) (fermée le 2026-07-23) : les paquets publiés — `vue-tsc`, le serveur de langage, le plugin tsserver — « requièrent tous l'API JS de TypeScript 6, parce que TS 7.0 ne livre aucune API programmatique ni mécanisme de plugin ». Le support natif est conditionné à l'API prévue pour TS 7.1 (microsoft/TypeScript#63800), encore en conception.

`vue-tsc@3.3.11` déclare pourtant `typescript: ">=5.0.0"` en pair et son README dit « Requires TypeScript 5.0.0 or higher » : **cette borne est trop laxiste et ne protège pas contre TS 7**. La contrainte réelle à retenir est `typescript ~6.0.x` (dernière publiée : 6.0.3). Une piste de contournement existe (`typescript-native-bridge`, ~2,7x de gain mesuré sur le typecheck du dépôt language-tools), mais elle n'est pas dans les paquets publiés.

La doc Vue confirme par ailleurs le partage des rôles : sous Vite, « le serveur de dev et le bundler ne font que transpiler et n'effectuent aucun typecheck », le typecheck passe par `vue-tsc` en ligne de commande ou par `vite-plugin-checker`. Et, textuellement : « Vue CLI fournit aussi le support TypeScript, mais n'est plus recommandé » ([vuejs.org/guide/typescript/overview](https://vuejs.org/guide/typescript/overview)).

---

## 5. Ce que Vite attend là où Vue CLI faisait autrement

Chaque point ci-dessous est confronté à l'état réel du dépôt.

### `process.env.BASE_URL` → `import.meta.env.BASE_URL`

Vite expose ses constantes via `import.meta.env`, remplacées statiquement au build : `MODE`, `BASE_URL`, `PROD`, `DEV`, `SSR`. Les variables utilisateur doivent être préfixées `VITE_` pour atteindre le code client ; les autres restent `undefined` côté navigateur ([vite.dev/guide/env-and-mode](https://vite.dev/guide/env-and-mode)). `BASE_URL` vaut la valeur de `base` dans la config, dont le défaut est `/` ([vite.dev/config/shared-options](https://vite.dev/config/shared-options)).

Dans le dépôt : **8 occurrences de `process.env`, toutes `process.env.BASE_URL`**, toutes dans un `data()` de composant sous la forme `publicPath: process.env.BASE_URL`. Fichiers concernés : `src/components/Start.vue`, `Preloader.vue`, `Fight/EnemyMap.vue`, `PreFight/CurrentEnemy.vue`, `Profiles/PlayerProfile.vue`, `Profiles/EnemyProfile.vue`, `Placement/Fleet.vue`, `Placement/Map.vue`. Aucune autre variable d'environnement n'est lue. C'est une substitution mécanique, sans cas particulier.

### `public/index.html` → `index.html` à la racine, sans EJS

Vite fait de `index.html` l'entrée de l'application, à la racine du projet : « les fichiers HTML sont au centre d'un projet Vite, ils servent de points d'entrée » ([vite.dev/guide/features](https://vite.dev/guide/features)). `publicDir` vaut `public` par défaut, et son contenu est « copié tel quel à la racine de `dist` », servi sur `/` en dev, sans hash ni optimisation — les assets s'y référencent en chemin absolu ([vite.dev/guide/assets](https://vite.dev/guide/assets)).

Dans le dépôt : `public/index.html` contient **trois interpolations EJS** que Vite ne traite pas — `<%= BASE_URL %>` sur l'icône (ligne 7) et `<%= htmlWebpackPlugin.options.title %>` deux fois (lignes 8 et 14, dont le message `<noscript>`). Le fichier doit remonter à la racine et ces trois expressions doivent devenir du HTML littéral. Le reste de `public/` (`boats/`, `fight/`, `home/`, `music/`, `placement/`, `players/`, `favicon.ico`) est déjà conforme au modèle Vite : le projet référence ses assets en chemin absolu, sans import webpack, et n'utilise **aucun `require.context` ni `require()`** — vérifié par grep sur `src/`.

### LESS

Aucun plugin, aucun loader : installer `less` suffit, et Vite « améliore la résolution des `@import` pour Sass et Less de sorte que les alias Vite soient respectés » ([vite.dev/guide/features](https://vite.dev/guide/features)). Le dépôt a **16 blocs `<style lang="less">`** et **zéro `lang="scss"` / `lang="sass"`** : `sass` et `sass-loader`, présents en devDependencies, sont du poids mort confirmé (le `CLAUDE.md` le notait déjà). `less-loader` disparaît, `less` passe de `^3.0.4` à `4.9.1`.

### `transpileDependencies`

Le `vue.config.js` du dépôt tient en une ligne : `transpileDependencies: ["vuetify"]`. **Vite n'a pas d'équivalent** et n'en a pas besoin : il ne transpile pas les dépendances de la même façon, et Vuetify 2 ne survit de toute façon pas à Vue 3 (§3). Le fichier `vue.config.js` disparaît entièrement.

### `build.target` vs `.browserslistrc`

`build.target` vaut par défaut `'baseline-widely-available'`, ce qui se résout en `['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4']` — les navigateurs Baseline Widely Available au 2026-01-01 pour Vite 8, soit un décalage d'environ 2,5 ans ([vite.dev/config/build-options](https://vite.dev/config/build-options)). Le guide de migration Vite 8 note le relèvement depuis Vite 7 : Chrome/Edge 107→111, Firefox 104→114, Safari 16.0→16.4 ([vite.dev/guide/migration](https://vite.dev/guide/migration)).

**La doc Vite ne mentionne nulle part `.browserslistrc`** : ce n'est pas une source que Vite lit. Le `.browserslistrc` du dépôt (`> 1%`, `last 2 versions`, `not dead`) devient donc inerte et doit être soit supprimé, soit traduit à la main en `build.target`. Pour du legacy plus ancien, il existe `@vitejs/plugin-legacy`, séparé. À noter aussi pour Vite 8 : Rolldown et Oxc remplacent esbuild et Rollup, et « le build émet un avertissement si le code contient des fonctionnalités qu'Oxc ne peut pas transpiler sûrement ». Les formats de sortie AMD et SystemJS ne sont plus supportés.

### ESLint : `.eslintrc.js` n'est plus lu du tout

ESLint 10 **a supprimé le système eslintrc**, pas seulement déprécié. Les fichiers `.eslintrc.*` et `.eslintignore` ne sont plus honorés, les options CLI `--no-eslintrc`, `--env`, `--resolve-plugins-relative-to`, `--rulesdir`, `--ignore-path` n'existent plus, les commentaires `eslint-env` sont désormais des erreurs, et `Linter` n'accepte plus que `configType: "flat"` ([eslint.org/docs/latest/use/migrate-to-10.0.0](https://eslint.org/docs/latest/use/migrate-to-10.0.0)). Les noms de config reconnus sont `eslint.config.{js,mjs,cjs,ts,mts,cts}` ([eslint.org/docs/latest/use/configure/configuration-files](https://eslint.org/docs/latest/use/configure/configuration-files)).

Le dépôt a un `.eslintrc.js` et `eslint@^6.7.2` / `prettier@^1.19.1` : c'est une réécriture complète du lint, pas une montée de version.

---

## 6. Ce que `create-vue` scaffolde en 2026

Vérifié en exécutant réellement `npx create-vue@latest --typescript --router --vitest --eslint --prettier --bare` avec `create-vue@3.23.0`.

### Arborescence générée

```
.editorconfig      .gitattributes     .gitignore
.oxlintrc.json     .prettierrc.json   .vscode/{extensions,settings}.json
env.d.ts           eslint.config.ts   index.html
package.json       public/favicon.ico
src/App.vue        src/main.ts        src/router/index.ts
src/__tests__/App.spec.ts
tsconfig.json      tsconfig.app.json  tsconfig.node.json  tsconfig.vitest.json
vite.config.ts     vitest.config.ts
```

Points notables : `index.html` **à la racine**, pas dans `public/` ; `public/` ne contient plus que le favicon ; `"type": "module"` dans le `package.json` ; **quatre** fichiers tsconfig en project references (racine vide + app + node + vitest) ; **`vite.config.ts` et `vitest.config.ts` séparés**, le second faisant un `mergeConfig` du premier ; `env.d.ts` réduit à `/// <reference types="vite/client" />`.

### Versions épinglées par le scaffold

```
dependencies:    vue ^3.5.40 · vue-router ^5.2.0
devDependencies: vite ^8.1.5 · @vitejs/plugin-vue ^6.0.8 · vitest ^4.1.10
                 typescript ~6.0.0 · vue-tsc ^3.3.7 · @vue/tsconfig ^0.9.1
                 @vue/test-utils ^2.4.11 · jsdom ^29.1.1
                 eslint ^10.7.0 · eslint-plugin-vue ~10.9.2 · vue-eslint-parser ^10.4.1
                 @vue/eslint-config-typescript ^14.9.0 · @vitest/eslint-plugin ^1.6.23
                 eslint-config-prettier ^10.1.8 · prettier 3.9.5
                 oxlint ~1.74.0 · eslint-plugin-oxlint ~1.73.0
                 @tsconfig/node24 ^24.0.4 · @types/node ^24.13.3 · @types/jsdom ^28.0.3
                 jiti ^2.7.0 · npm-run-all2 ^9.0.2 · vite-plugin-vue-devtools ^8.1.5
engines: { "node": "^22.18.0 || >=24.12.0" }
```

Trois surprises par rapport à ce qu'on attendrait :

- **`oxlint` est ajouté à côté d'ESLint**, pas à la place : le script `lint` enchaîne `lint:oxlint` puis `lint:eslint`, et `eslint.config.ts` importe `pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')` pour désactiver dans ESLint les règles déjà couvertes par oxlint.
- **`@vue/eslint-config-prettier` n'est pas utilisé** ; le scaffold importe directement `eslint-config-prettier/flat`. (Le paquet `@vue/eslint-config-prettier` existe toujours, en 10.2.0.)
- `@tsconfig/node24` confirme que la cible Node de référence de `create-vue` est bien la ligne 24.

### Scripts générés

```json
"dev": "vite",
"build": "run-p type-check \"build-only {@}\" --",
"build-only": "vite build",
"preview": "vite preview",
"type-check": "vue-tsc --build",
"test:unit": "vitest",
"lint": "run-s \"lint:*\"",
"format": "prettier --write --experimental-cli src/"
```

Le `build` fait tourner typecheck et bundling **en parallèle** via `npm-run-all2`, ce qui rend le typecheck bloquant pour la prod sans ralentir le dev — c'est le pendant de « Vite ne typecheck pas » du §4.

### Config Vite de référence

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

L'alias `@` est fait exactement comme dans le `vitest.config.mjs` déjà présent dans le dépôt : `fileURLToPath(new URL('./src', import.meta.url))`. C'est la seule pièce du socle cible déjà en place.

---

## 7. Cohérence des versions déjà déclarées dans `package.json`

Le `package.json` du dépôt déclare `vite ^8.3.0`, `vitest ^5.0.0`, `@vitejs/plugin-vue2 ^2.3.4`, `jsdom ^29.1.1`, `@vue/test-utils ^1.3.6`, sans que rien n'ait jamais été installé. Verdict paquet par paquet.

**`vite ^8.3.0` — la version existe (8.3.0, sortie le 10/09/2026, soit deux jours avant cette recherche) mais est incompatible avec le plugin déclaré à côté.** `@vitejs/plugin-vue2@2.3.4` déclare `peerDependencies.vite: "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"` — **`^8` n'y figure pas**. Et 2.3.4 est bien la dernière version publiée du plugin (sortie le 2025-10-04, aucune 2.4 ni 3.x). Le `.npmrc` du dépôt force `legacy-peer-deps=true`, donc npm installerait l'ensemble sans broncher : l'incompatibilité serait silencieuse à l'installation et ne se manifesterait qu'à l'exécution. **C'est la première chose à corriger si quelqu'un tente de faire tourner le setup Vue 2 + Vite actuel** : il faut redescendre Vite en `^7` pour rester dans les pairs de `plugin-vue2`. Pour mémoire, `vite@7.3.6` est publié sous le tag `previous`.

**`vitest ^5.0.0` — la version existe (5.0.0, sortie le 03/09/2026), elle est compatible avec Vite 8 (`peerDependencies.vite: "^6.4.0 || ^7.0.0 || ^8.0.0"`), mais elle est en avance d'un majeur sur la référence.** `create-vue` scaffolde `vitest ^4.1.10` ; le tag `V4` pointe sur 4.1.11, toujours maintenu. Deux conséquences concrètes : Vitest 5 exige `node ^22.12.0 || ^24.0.0 || >=26.0.0`, ce qui **supprime la ligne Node 20** que Vitest 4 tolérait encore, et le couple Vitest 5 + Vite 7 (nécessaire pour `plugin-vue2`, cf. ci-dessus) fonctionne mais sort du chemin balisé. Rien n'est cassé, mais on est hors du socle de référence.

**`@vitejs/plugin-vue2 ^2.3.4` — paquet de la ligne Vue 2, à supprimer le jour de la bascule.** Ses pairs sont `vue ^2.7.0-0`. Il faut noter au passage que le dépôt est sur `vue@^2.6.11` et non 2.7 : le plugin exige 2.7 minimum. Le remplaçant côté Vue 3 est `@vitejs/plugin-vue@6.0.8`.

**`jsdom ^29.1.1` — aligné avec ce que scaffolde `create-vue`** (`^29.1.1` également). Cohérent, rien à faire. Passer en 30.0.1 relèverait le plancher Node à 22.22.2 / 24.15 sans bénéfice identifié ici.

**`@vue/test-utils ^1.3.6` — ligne Vue 2.** La ligne Vue 3 est `2.5.0` (`peerDependencies.vue: "3.x"`). Bascule mécanique le moment venu, mais l'API diffère entre v1 et v2.

**Le reste du `package.json` est intégralement de la ligne Vue 2** et n'a pas de correspondance directe : `vue@^2.6.11`, `vue-router@^3.2.0`, `vue-i18n@^8.21.0`, `vuex@^3.4.0`, `vuetify@^2.2.11`, `vue-loader@^15.9.3`, `vue-template-compiler`, `vuetify-loader`, toute la famille `@vue/cli-*@~4.4.0`, `babel-eslint`, `@kazupon/vue-i18n-loader`. À signaler : `jquery@^3.5.1` et `vuex@^3.4.0` sont déclarés mais, d'après le `CLAUDE.md`, respectivement plus utilisés dans `src/` et pointant sur un store vide — deux suppressions gratuites avant même de parler de migration.

**Résumé de la cohérence :** sur les trois versions « déjà déclarées » que le ticket demande de vérifier, une est franchement fausse (`vite ^8` avec `plugin-vue2`, qui ne déclare pas `^8`), une est valide mais en avance sur la référence `create-vue` et rétrécit les Node supportés (`vitest ^5` au lieu de `^4`), et la troisième est correcte pour Vue 2 mais destinée à disparaître (`@vitejs/plugin-vue2`).

---

## 8. Écarts à retenir, en une liste

Pour alimenter les tickets aval, sans rien décider ici :

1. **Node 16 → 24.** Aucun élément du socle ne tourne sur 16. `vue-i18n` 11 (`>= 22`) élimine aussi Node 20. `.nvmrc` et `netlify.toml` (`NODE_VERSION`) à changer ensemble.
2. **`@vue/compat` est vivant** (publié jusqu'en 3.6.0-rc.8), mais sa doc affiche une intention d'arrêt datée de 2021, jamais exécutée, et **Vuetify est le cas d'incompatibilité qu'il nomme lui-même**. La question de la bascule progressive est d'abord une question Vuetify.
3. **TypeScript 6, pas 7.** `vue-tsc` dépend de l'API JS de TS 6 ; TS 7.0 n'en expose aucune. Le pair `>=5.0.0` de `vue-tsc` est trompeur.
4. **`vue-router` 5 et `vue-i18n` 11**, pas 4 et 9 comme le supposait l'énoncé. vue-router 5 impose `vue >= 3.5.34`.
5. **8 `process.env.BASE_URL`**, **3 interpolations EJS** dans `public/index.html`, **16 blocs LESS**, **0 SCSS**, **0 `require.context`**. Périmètre mécanique connu et borné.
6. **`.browserslistrc` devient inerte** — Vite ne le lit pas ; traduire à la main en `build.target` ou supprimer.
7. **`.eslintrc.js` devient inerte** — ESLint 10 a supprimé eslintrc. Réécriture en flat config.
8. **`vue.config.js` disparaît** ; `less-loader`, `sass`, `sass-loader`, `vuetify-loader`, `@kazupon/vue-i18n-loader`, `babel-eslint` et la famille `@vue/cli-*` avec.
9. **`vite ^8` + `@vitejs/plugin-vue2 ^2.3.4` est une combinaison non supportée** aujourd'hui déclarée dans le `package.json`, masquée par `legacy-peer-deps=true`.

---

## Sources

Registre npm interrogé le 2026-09-12 (`npm view`), et :

- [vite.dev/guide](https://vite.dev/guide/) — exigence Node de Vite
- [vite.dev/guide/features](https://vite.dev/guide/features) — préprocesseurs CSS, `index.html` comme entrée
- [vite.dev/guide/assets](https://vite.dev/guide/assets) — répertoire `public`
- [vite.dev/guide/env-and-mode](https://vite.dev/guide/env-and-mode) — `import.meta.env`, `BASE_URL`, préfixe `VITE_`
- [vite.dev/config/build-options](https://vite.dev/config/build-options) — `build.target`, défaut `baseline-widely-available`
- [vite.dev/config/shared-options](https://vite.dev/config/shared-options) — défauts `root`, `base`, `publicDir`
- [vite.dev/guide/migration](https://vite.dev/guide/migration) — changements Vite 8 (Rolldown/Oxc, cibles navigateurs)
- [v3-migration.vuejs.org/migration-build](https://v3-migration.vuejs.org/migration-build) — `@vue/compat` : config, workflow, limites
- [github.com/vuejs/core](https://github.com/vuejs/core) — présence de `packages/vue-compat` sur `main`
- [vuejs.org/guide/typescript/overview](https://vuejs.org/guide/typescript/overview) — `vue-tsc`, Vite ne typecheck pas, Vue CLI déconseillé
- [github.com/vuejs/language-tools/issues/5381](https://github.com/vuejs/language-tools/issues/5381) — statut TS 7 / tsgo, API JS de TS 6 requise
- [github.com/vuejs/language-tools — packages/tsc/README.md](https://github.com/vuejs/language-tools/tree/master/packages/tsc) — « Requires TypeScript 5.0.0 or higher »
- [vue-i18n.intlify.dev/guide/installation](https://vue-i18n.intlify.dev/guide/installation) — v11 maintenue, Vue 3.0.0+
- [eslint.org/docs/latest/use/migrate-to-10.0.0](https://eslint.org/docs/latest/use/migrate-to-10.0.0) — suppression eslintrc, Node requis
- [eslint.org/docs/latest/use/configure/configuration-files](https://eslint.org/docs/latest/use/configure/configuration-files) — noms de fichiers flat config
- [github.com/nodejs/Release — schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json) — calendrier des lignes Node
- `create-vue@3.23.0` exécuté localement avec `--typescript --router --vitest --eslint --prettier --bare`
