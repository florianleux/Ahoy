# Vuetify 3 ou pas de Vuetify : ce que chaque voie coûte

Recherche pour l'issue [#38](https://github.com/florianleux/Ahoy/issues/38). Date des relevés : **12 septembre 2026**.

Ce document ne tranche pas. Il établit ce que chaque voie coûte, sources à l'appui, pour que le ticket prototype (#42) décide sur pièce.

## Comment lire ce document

Le contexte d'Ahoy déforme complètement le calcul habituel « framework UI vs natif », et il faut l'avoir en tête avant chaque chiffre ci-dessous :

- Le jeu est **desktop uniquement** (modale bloquante sous 1100px dans `src/App.vue`). Tout l'appareillage responsive de Vuetify est mort-né.
- Le design est **fixe en 1920×1080**, positionné au pixel via `src/mixins/responsivePosition.js`. Les composants sont posés en `position: fixed` avec des coordonnées calculées, pas coulés dans un flux.
- **991 lignes de LESS** dans les blocs `<style>` des SFC font l'essentiel du rendu, en écrasant Vuetify à coups de `!important`.
- **Zéro usage de `$vuetify`** : pas de thème consommé, pas de breakpoint, pas de `$vuetify.display`. Le thème déclaré dans `src/plugins/vuetify.js` (7 couleurs Material) n'est lu nulle part — les couleurs réelles sont en dur dans le LESS (`#dcb570`, `#502218`, `#893522`…).

Autrement dit : Ahoy n'utilise pas Vuetify comme design system. Il l'utilise comme une boîte de cinq ou six primitives DOM, puis repeint tout par-dessus.

## Surface réelle, revérifiée dans le code

Le décompte du ticket (« 88 tags, 16 composants ») est confirmé. Répartition vérifiée fichier par fichier :

| Composant | Occurrences | Où |
|---|---|---|
| `v-col` | 29 | `CurrentEnemy.vue` (14), `Start.vue` (5), `Placement.vue` (3), `Fight.vue` (2), `EnemyMap.vue` (1), `EnemiesList.vue` (1), etc. |
| `v-row` | 21 | idem, + les 4 racines de grille de `PlayerMap`/`EnemyMap`/`Fleet`/`Map` |
| `v-btn` | 7 | `Start.vue` (2), `Fight.vue` (2), `EnemyMap.vue` (1, commenté), `Placement.vue` (1), `PreFight.vue` (1) |
| `v-card` | 5 | `App.vue`, `Settings.vue`, `Start.vue`, `Fight.vue` (2) |
| `v-card-title` | 5 | idem |
| `v-card-text` | 4 | `App.vue`, `Settings.vue`, `Fight.vue` (2) |
| `v-dialog` | 4 | `App.vue`, `Settings.vue`, `Fight.vue` (2) |
| `v-radio` | 4 | `Start.vue` (2), `Settings.vue` (2) |
| `v-card-actions` | 2 | `Fight.vue` |
| `v-icon` | 2 | `App.vue` |
| `v-radio-group` | 2 | `Start.vue`, `Settings.vue` |
| `v-spacer` | 2 | `Fight.vue` |
| `v-app` | 1 | `App.vue` |
| `v-form` | 1 | `Start.vue` |
| `v-switch` | 1 | `Settings.vue` |
| `v-text-field` | 1 | `Start.vue` |

Deux observations qui n'apparaissaient pas au charting :

1. **Quatre des 21 `v-row` ne contiennent aucun `v-col`.** Dans `PlayerMap.vue:2`, `EnemyMap.vue:2`, `Map.vue:2` et `Fleet.vue:5`, le `v-row` n'est qu'un `display:flex; flex-wrap:wrap` avec une marge négative de -12px — il sert de conteneur de grille de jeu, pas de rangée de mise en page. Ces quatre-là sont les plus faciles à supprimer.
2. **Le CSS accroche du DOM Vuetify en huit endroits**, pas deux : `App.vue:91` (`#app.v-application .primary`), `App.vue:99` (`.v-label`), `App.vue:104` et `113` et `124` (`.v-btn`, `.v-btn--disabled`), `App.vue:141` (`.v-application--wrap`), `Start.vue:157` (`.v-text-field__details`), `Start.vue:169` (`.v-btn`). Les deux `::v-deep` de `Start.vue` sont juste les seuls à franchir une frontière `scoped`. C'est cette liste-là, et non le nombre de tags, qui porte le vrai risque sur les deux voies.

## Où en est Vuetify aujourd'hui

Relevé sur l'API GitHub des releases le 12/09/2026 :

- **Vuetify 4.2.1** publié le 09/09/2026 — c'est la ligne courante.
- **Vuetify 3.13.4** publié le 09/09/2026 également — la ligne 3 est toujours maintenue activement, et la documentation la qualifie de **« Vuetify 3.13 LTS »** ([guide de migration v3.13.4](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/getting-started/upgrade-guide.md)).

Ce point pèse sur la décision : viser Vuetify 3 en 2026, c'est viser une LTS maintenue mais déjà dépassée d'une majeure. Et Vuetify 4 apporte sa propre vague de ruptures — notamment sur la grille, qui est justement le gros du volume ici : le [guide d'upgrade v4](https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/pages/en/getting-started/upgrade-guide.md) indique que les marges négatives de `v-row`/`v-col` sont remplacées par `gap` CSS, que `align`/`justify`/`order` passent en classes utilitaires, que `dense` devient `density="compact"`, et que les classes typographiques `text-h1`…`text-h6` sont remappées sur les noms Material Design 3. Autrement dit, une migration vers Vuetify 3 aujourd'hui paie une partie du prix de la grille une première fois, et le repaiera en v4.

---

# Partie 1 — Le coût de la voie Vuetify 3

## Ce que l'installation exige

Source : [`package.json` de vuetify@3.13.4](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/package.json) et le [guide d'installation v3.13.4](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/getting-started/installation.md).

- **`vue: ^3.5.0`** en peerDependency. Non négociable : Vuetify 3 n'existe pas pour Vue 2. Tout le coût de la migration Vue 2→3 est donc un préalable, pas une conséquence.
- `Vuetify` en tant que classe disparaît, remplacé par **`createVuetify()`**. `src/plugins/vuetify.js` est à réécrire intégralement (une quinzaine de lignes, dont le bloc `theme` que personne ne lit — l'occasion de le supprimer).
- **`import ... from 'vuetify/lib'` interdit** : devient `'vuetify'` / `'vuetify/components'` / `'vuetify/directives'`.
- **Les styles globaux ne sont plus embarqués** : il faut `import 'vuetify/styles'` explicitement. Seuls les styles de composants viennent avec les composants.
- **`vuetify-loader` est renommé `webpack-plugin-vuetify`** (>= 3.1.0) ; `vite-plugin-vuetify` (>= 2.1.0) pour Vite. Les deux sont des peerDependencies *optionnelles* : sans elles, on importe le bundle complet, ce qui « inclut tous les composants et directives, qu'ils soient utilisés ou non ». Les plugins sont aussi ce qui « permet de personnaliser les variables SCSS ».
- **Chaîne Sass** : requise seulement si on veut personnaliser les variables SCSS via `styles.configFile`. Ahoy ne personnalise aucune variable Sass — il écrase en LESS après coup. Le `sass`/`sass-loader` déjà présent en devDependencies suffirait, et pourrait même rester inutilisé.

### Les icônes MDI : le ticket se trompe

Le ticket annonce « MDI en package plutôt qu'en CDN ». **C'est faux, vérification faite.** La [doc icon-fonts de v3.13.4](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/features/icon-fonts.md) documente explicitement le lien CDN comme une des deux options supportées : « It supports local installation with a build process or a CDN link », avec l'exemple `<link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">`.

Mieux : le [code de `createIcons`](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/icons.ts) montre que `defaultSet` vaut `'mdi'` par défaut et que le set `mdi` (à base de classes CSS) est câblé automatiquement si aucune config n'est fournie. **Le `<link>` MDI de `public/index.html` continue donc de fonctionner sans aucun changement, ni dans le HTML ni dans la config.** Coût : zéro.

### `v-app` / `v-main`

Le ticket signale qu'il faudrait ajouter `v-main`, absent aujourd'hui. En réalité `v-main` ne sert qu'à réserver la place des `v-app-bar`/`v-navigation-drawer` du système de layout — Ahoy n'en a aucun, et son contenu est en `position: fixed` de toute façon. `v-main` n'est pas obligatoire ; l'omettre ne casse rien.

En revanche, `v-app` change de DOM, et c'est là que ça fait mal. Comparaison des sources :

| | Vuetify 2 ([VApp.ts](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VApp/VApp.ts)) | Vuetify 3 ([VApp.tsx](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VApp/VApp.tsx)) |
|---|---|---|
| Racine | `<div id="app" class="v-application" data-app>` | `<div class="v-application">` — **plus d'`id`, plus de `data-app`** |
| Wrapper | `<div class="v-application--wrap">` | `<div class="v-application__wrap">` |
| Hauteur | `min-height: 100vh` | `min-height: 100vh; min-height: 100dvh` |

Deux conséquences directes et non négociables :

1. **`App.vue:141` (`.v-application--wrap { padding: 15px 30px; }`) cesse de s'appliquer.** La classe s'appelle `.v-application__wrap` en v3. Un padding de 15/30px qui disparaît silencieusement sur un design positionné au pixel : c'est exactement le genre de régression qu'on ne voit qu'en jeu.
2. **Le sens de `#app` change.** Aujourd'hui, `<v-app>` pose lui-même `id="app"` sur sa racine, *et* le template d'Ahoy contient un second `<div id="app">` à l'intérieur — il y a donc deux `#app` dans le DOM. En Vuetify 3, `v-app` n'en pose plus. Et en Vue 3, [`app.mount()` ne remplace pas le conteneur](https://vuejs.org/api/application.html) : « It will replace any existing DOM nodes inside the container », le `<div id="app">` de `public/index.html` survit donc comme conteneur. Le sélecteur `#app` — utilisé pour poser les fonds de page dans `Home.vue:21`, `Placement.vue:92`, `PreFight.vue:36`, `Fight.vue:122` et les quatre règles `body.fight.<Ennemi> #app` — désignera un autre élément qu'aujourd'hui, à un autre niveau de l'arbre. À revalider écran par écran.

Et `App.vue:91` (`#app.v-application .primary`) tombe deux fois : `#app` n'est plus la racine `v-application`, et `.primary` n'existe plus (voir ci-dessous).

## Tableau composant par composant

Références : [guide d'upgrade v2→v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/getting-started/upgrade-guide.md), complété par lecture directe des sources de `vuetify@3.13.4` quand le guide est muet.

| Composant | Usage dans Ahoy | Ce qui change concrètement | Effort |
|---|---|---|---|
| **`v-row`** (21) | Grille + 4 conteneurs de jeu | **Rien.** Les [mixins de grille v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VGrid/_mixins.sass) sont géométriquement identiques à [ceux de v2](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VGrid/_mixins.sass) : même `margin: -$gutter/2`, même gouttière de 24px, mêmes props `justify`/`align`. Le seul `justify="center"` du repo (`Settings.vue:2`) est inchangé. | nul |
| **`v-col`** (29) | `cols="12"`, `cols="6"`, `cols="7"`, `cols="8"`, `cols="4"`, `cols="5"` | **Rien.** `padding: $gutter/2`, `flex: 0 0 percentage($size/12)` identiques. Aucun `offset`, aucun breakpoint, aucun `dense` dans le repo. | nul |
| **`v-spacer`** (2) | `Fight.vue`, dans `v-card-actions` | **Rien.** Composant fonctionnel inchangé. | nul |
| **`v-card`** (5) | dont `Start.vue:8` : `outlined elevation="24"` | `outlined` → **`variant="outlined"`** (les props `flat`/`outlined`/`text`/`plain` fusionnent en `variant`). `elevation` reste. Nouveauté v3 : « v-card does not allow content to overflow or use higher z-index values to display on top of elements outside it » ([#17593](https://github.com/vuetifyjs/vuetify/issues/17593)) — **à surveiller de près** : `Start.vue` pose la carte en `position: fixed` avec des marges négatives, et le repo empile des `z-index` jusqu'à 100000000. Échappatoire documentée : `style="overflow: initial; z-index: initial"`. | 1 prop + vérif overflow |
| **`v-card-title`** (5) | `class="headline" primary-title` (×3), `class="settings-title"`, brut | En v2 comme en v3, `VCardTitle` est un `createSimpleFunctional` sans aucune prop ([v2](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VCard/index.ts), [v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VCard/VCardTitle.ts)). **`primary-title` est déjà un attribut mort aujourd'hui** — un vestige de Vuetify 1.5. Le supprimer ne change rien visuellement. En revanche la classe passe de `v-card__title` à `v-card-title` (voir « renommage BEM » plus bas). | suppression cosmétique |
| **`v-card-text`** (4) | brut | Classe `v-card__text` → `v-card-text`. Aucun CSS d'Ahoy ne la cible. | nul |
| **`v-card-actions`** (2) | `Fight.vue` | Idem. | nul |
| **`v-dialog`** (4) | `persistent width="500"` (×3), `max-width="400"` | Le ticket annonce `width`→`max-width` : **faux**. [VDialog v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VDialog/VDialog.tsx) passe `width` *et* `maxWidth` à l'overlay ; les deux existent. `persistent` existe toujours. Le vrai piège est ailleurs : **le contenu est détruit à la fermeture** (« Content is now destroyed after closing, use `eager` to keep it ») — sans conséquence ici, ces dialogues sont purement déclaratifs. | nul |
| **`v-btn`** (7) | `color="primary"` (×5), `text` (×2), `disabled` | `text` → **`variant="text"`**. `color="primary"` reste valide *mais* la couleur vient du thème Vuetify — que `App.vue:91` écrase aujourd'hui via `.primary`. Or **`.primary` n'existe plus comme classe** : les classes de couleur sont renommées, `.primary` devient `.bg-primary` (fond) et `.primary--text` devient `.text-primary`. La règle `App.vue:91` est donc à réécrire. Autre rupture silencieuse : « Disabled buttons use a faded variant of the specified color instead of grey » ([#15147](https://github.com/vuetifyjs/vuetify/issues/15147)) — `App.vue:124` (`.v-btn--disabled`) repeint déjà tout en dur, donc probablement neutralisé, mais à vérifier. | 2 props + 1 règle CSS |
| **`v-icon`** (2) | `<v-icon id="help">mdi-help-circle</v-icon>` + `@click` | Le ticket annonce « slot→prop » : **c'est une recommandation, pas une rupture**. [VIcon v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VIcon/VIcon.tsx) lit toujours `slots.default()` et en extrait le nom ; la doc confirme : « While it is still possible to supply the icon value through the default slot in Vuetify 3.0 (`<v-icon>mdi-home</v-icon>`), we recommend using the `icon` prop instead. » Le `@click` fonctionne toujours (classe `v-icon--clickable`). | nul (ou 2 lignes cosmétiques) |
| **`v-form`** (1) | `v-model="valid"` | `validate()` retourne maintenant `Promise<FormValidationResult>` — **non utilisé ici**. Le `v-model` reste la validité, mais [`modelValue` vaut `null` par défaut](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/composables/form.ts) au lieu d'un booléen, et `validateOn` vaut `'input'`. Pour l'usage d'Ahoy (`:disabled="!valid"`), `null` est falsy donc le bouton reste désactivé au départ : comportement préservé. | nul, à confirmer au clic |
| **`v-text-field`** (1) | `Start.vue:13`, avec `:rules`, `placeholder`, `required` | **La vraie rupture visuelle.** [VField v3](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VField/VField.tsx) déclare `variant: { default: 'filled' }`. En v2 le champ nu était souligné ; en v3 il arrive avec un fond gris Material et un label flottant. Il faut **`variant="underlined"`** pour retrouver l'apparence actuelle — et même là, le DOM interne diffère. `:rules` et `placeholder` sont inchangés. | 1 prop + reprise CSS |
| **`v-radio-group`** (2) | `row` | `row` → **`inline`**, confirmé dans [VSelectionControlGroup](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VSelectionControlGroup/VSelectionControlGroup.tsx) (`inline: Boolean`, classe `v-selection-control-group--inline`). Le guide v2→v3 ne le mentionne pas — il a fallu lire la source. | 1 prop ×2 |
| **`v-radio`** (4) | `:label`, `value`, `:checked` | `:label` et `value` inchangés. Le `:checked="{ checked: $i18n.locale == 'en' }"` de `Settings.vue:13,18` est **déjà du code mort aujourd'hui** (un objet passé à un attribut booléen, sur un contrôle piloté par le `v-model` du groupe) — à supprimer au passage. | nettoyage |
| **`v-switch`** (1) | `Settings.vue:22`, `v-model` + `:label` | Props inchangées pour cet usage (`input-value`→`model-value` ne concerne que l'écriture explicite). Mais **le DOM change** : « v-switch for example now uses an `<input type="checkbox" />` under the hood, which is why the `aria-checked` and `aria-role="switch"` attributes were removed ». Aucun CSS d'Ahoy ne le cible. | nul |
| **`v-app`** (1) | racine de `App.vue` | Voir section dédiée : `id` perdu, `data-app` perdu, `--wrap`→`__wrap`. **C'est le composant le plus coûteux du lot**, pour deux règles CSS et un sélecteur `#app` utilisé partout. | élevé, diffus |

## Les ruptures transversales, hors tableau

Ce sont elles qui coûtent, pas les props.

### Renommage BEM généralisé

Toutes les classes internes passent du double underscore au tiret simple : `v-card__title` → `v-card-title`, `v-application--wrap` → `v-application__wrap` (celle-là dans l'autre sens), et le DOM des champs est entièrement refait. Deux points de contact dans Ahoy :

- **`App.vue:141`** — `.v-application--wrap` : mort. Remplacer par `.v-application__wrap`.
- **`Start.vue:157`** — `.v-text-field__details` : **cet élément n'existe plus du tout**. En v3, la zone de messages sous un champ est rendue par [`VInput`](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VInput/VInput.tsx) sous la classe **`.v-input__details`**, partagée par tous les types d'input. C'est le seul des deux `::v-deep` qui cible réellement du DOM disparu.

Pour `Start.vue:153` (`&::v-deep input`), le sélecteur vise l'élément `<input>` natif : il survit, désormais niché dans un `.v-field__input`. Il continue de fonctionner tel quel.

### `::v-deep` : déprécié, mais pas cassé

Vérification dans le [compilateur SFC de Vue 3](https://github.com/vuejs/core/blob/main/packages/compiler-sfc/src/style/pluginScoped.ts) : `::v-deep` utilisé **comme combinateur** (`::v-deep .foo`, la forme employée dans `Start.vue`) compile toujours, avec un avertissement explicite — `"::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead."`. Seuls `>>>` et `/deep/` sont réellement supprimés. Les deux lignes deviennent :

```less
:deep(input) { text-align: center; }
:deep(.v-input__details *) { text-align: center; }
```

Coût : deux lignes. Le sujet est nettement moins grave que ne le laisse entendre le ticket — le problème n'est pas la syntaxe `::v-deep`, c'est le sélecteur `.v-text-field__details` qu'elle enveloppe.

### Classes de couleur et typographie

- `.primary` → `.bg-primary`, `.primary--text` → `.text-primary`. Concerne `App.vue:91`.
- `.headline` → **`.text-h5`**. Les classes typographiques sont toutes préfixées `text-` (« `.display-4` is now `.text-h1` »). Trois occurrences : `App.vue:17`, `Fight.vue:28`, `Fight.vue:46`. À noter que le LESS d'Ahoy impose de toute façon `font-family: "Roman Antique"` sur `*` (`App.vue:87`), donc l'impact visuel se limite à la taille et à la graisse.
- Le thème utilise désormais des variables CSS en liste RGB : `rgb(var(--v-theme-primary))` et non plus `var(--v-primary-base)`. Sans objet ici — Ahoy ne lit aucune variable de thème.

### Le reste du guide ne concerne pas Ahoy

`$vuetify.breakpoint`→`$vuetify.display`, les slots `activator`, `v-data-table`, `v-select`, `v-list`, `v-menu`, `v-tooltip`, les variables Sass : **aucun de ces sujets n'a de point de contact avec le code d'Ahoy.** C'est la bonne nouvelle de cette voie — le guide d'upgrade fait 349 lignes, dont moins de 15 % s'appliquent.

## Bilan de la voie Vuetify 3

Le travail purement Vuetify se réduit à :

- **4 props à renommer** (`text`→`variant="text"` ×2, `outlined`→`variant="outlined"` ×1, `row`→`inline` ×2, `variant="underlined"` ×1).
- **3 classes typographiques** (`headline`→`text-h5`).
- **3 attributs morts à supprimer** (`primary-title` ×3, plus les `:checked` de `Settings.vue`).
- **1 fichier de config à réécrire** (`src/plugins/vuetify.js`, dont on peut supprimer le bloc `theme` inutilisé).
- **8 règles CSS à revalider**, dont 3 certainement cassées (`.v-application--wrap`, `.v-text-field__details`, `#app.v-application .primary`).
- **2 `::v-deep` à moderniser** en `:deep()`.

C'est peu. **50 des 88 tags (les 21 `v-row` + 29 `v-col`) migrent sans toucher une ligne.** Le vrai coût n'est pas dans cette liste : il est dans le préalable Vue 2 → Vue 3, et dans la revalidation visuelle écran par écran d'un design positionné au pixel dont le conteneur racine (`#app`) change de nature.

---

# Partie 2 — Le coût de la voie sans Vuetify

## Remplacement composant par composant

| Composant | Remplacé par | Ce qui se perd |
|---|---|---|
| **`v-row`/`v-col`** (50) | `display: flex; flex-wrap: wrap` + `padding` sur les enfants, ou CSS Grid. Les `cols="n"` deviennent `flex: 0 0 (n/12*100%)` — ou disparaissent : `cols="6"`+`cols="6"` c'est `grid-template-columns: 1fr 1fr`, `cols="8"`+`cols="4"` c'est `2fr 1fr`. | Rien d'utile. Le système à 12 colonnes n'apporte de valeur qu'avec des breakpoints, qu'Ahoy n'utilise pas (0 prop `sm`/`md`/`lg` dans tout le repo). **Attention au piège de reprise :** la gouttière de 24px est implémentée par `margin: -12px` sur la rangée + `padding: 12px` sur les colonnes. En passant à `gap`, les marges négatives disparaissent et **tout ce qui est calé sur ces bords se décale de 12px**. Sur un design au pixel, c'est la source de régression n°1 de cette voie. |
| **`v-dialog`** (4) | `<dialog>` natif + `showModal()` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) : `showModal()` fournit **nativement** le top layer, l'inertage de l'arrière-plan (« Everything outside the modal dialog is inert and interactions outside the dialog are blocked »), le focus initial sur le premier élément focusable, la fermeture par Échap (avec gestion correcte de l'empilement), et le pseudo-élément `::backdrop`. [caniuse](https://caniuse.com/dialog) : **96,77 % de support global**, Chrome 37+, Edge 79+, Firefox 98+, Safari 15.4+. Sur un jeu desktop moderne, c'est acquis. Ce qui se perd : l'animation d'ouverture (transition Vuetify), et le binding `v-model` — il faut un `watch` qui appelle `showModal()`/`close()`. Le `persistent` se retrouve exactement avec `closedby="none"`, ou en `preventDefault()` sur l'événement `cancel`. Bilan : **le natif est ici au moins aussi bon que Vuetify, et gratuit.** |
| **`v-card`** + `title`/`text`/`actions` (16 tags) | `<div>` + `<h2>` + `<div>` | En v2, `v-card` apporte un fond `--material background`, `border-radius: 4px`, une élévation par `box-shadow`, et `v-card__title` une taille/graisse Material. **Or les 5 cartes d'Ahoy sont déjà repeintes en LESS** : `Start.vue:98-111` impose fond `#ffe4b4`, bordure `3px solid #d09c5f`, couleur `#502218 !important` et `rounded-lg`. Ce qui reste à reproduire : le `box-shadow` d'`elevation="24"` (une ligne de CSS copiée depuis la table d'élévation Material) et le padding interne de `v-card__text`. Coût faible, réel mais faible. |
| **`v-btn`** (7) | `<button>` | C'est le remplacement le plus coûteux, et pourtant pas pour les raisons habituelles. Vuetify 2 apporte ([VBtn.sass](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VBtn/VBtn.sass)) : `display: inline-flex` centré, `border-radius`, `text-transform: uppercase`, `letter-spacing`, `min-width`, les transitions, l'état `:focus-visible`, l'élévation, et **le ripple**. Mais `App.vue:104-129` et `Start.vue:169` écrasent déjà padding, display, font, couleurs et état désactivé à coups de `!important` — il ne reste vraiment à réimplémenter que le ripple (purement décoratif, supprimable) et le `min-width`. Ce qui se perd et qu'il ne faut **pas** oublier : `<button>` natif donne l'activation clavier (Entrée/Espace), le rôle ARIA et `:disabled` gratuitement, ce que `v-btn` émulait. Sur ce point, le natif est un gain. |
| **`v-text-field`** (1) | `<input type="text">` | Perdu : l'affichage automatique des messages de validation (`:rules` → il faut un `<span>` d'erreur et la logique de règles à la main, soit ~10 lignes dans `Start.vue`), le label flottant (non utilisé — Ahoy passe un `placeholder`), et le soulignement animé. Comme `Start.vue:153,157` centre déjà le texte de l'input *et* de la zone de messages via `::v-deep`, les deux `::v-deep` **disparaissent purement et simplement** : sur un input qu'on possède, plus de frontière à franchir. |
| **`v-radio-group`/`v-radio`** (6) | `<input type="radio" name="...">` + `<label>` | Perdu : l'apparence Material (cercle dessiné, animation), et le groupement automatique — qu'on retrouve avec l'attribut `name` partagé, qui fournit en prime l'exclusivité mutuelle et la navigation aux flèches, nativement. `v-model` fonctionne sur un `<input type="radio">` natif en Vue sans aucun adaptateur. Les deux `:checked` morts de `Settings.vue` disparaissent d'eux-mêmes. |
| **`v-switch`** (1) | `<input type="checkbox" role="switch">` + CSS | Perdu : l'apparence (piste + pastille, ~15 lignes de CSS à écrire), et l'animation. À noter que Vuetify 3 fait déjà exactement ça sous le capot (« v-switch now uses an `<input type="checkbox" />` under the hood ») : on ne descend pas d'un cran, on retire juste l'emballage. |
| **`v-icon`** (2) | `<i class="mdi mdi-cog">` | **Rien ne se perd.** `v-icon` avec un slot texte ne fait que produire `<i class="v-icon mdi mdi-cog">`. Le CDN MDI de `public/index.html` reste en place à l'identique, `@click` devient un `@click` sur le `<i>`, et `App.vue:99` (`.v-label`) n'est même pas concerné. |
| **`v-spacer`** (2) | `margin-left: auto` sur l'élément suivant, ou `justify-content: flex-end` sur le conteneur | Rien. `v-spacer` est un `<div>` avec `flex-grow: 1`. |
| **`v-form`** (1) | `<form>` + un `computed` de validité | Perdu : l'agrégation automatique de la validité des enfants, et `validate()`. Avec **un seul champ validé** dans toute l'application, l'agrégation revient à un `computed` de deux lignes sur `playerName`. |
| **`v-app`** (1) | `<div id="app">` — déjà présent | Ce que `v-app` apporte réellement, source en main : `display: flex` sur la racine, un fond et une couleur de thème, et un wrapper en `flex-direction: column; flex: 1 1 auto; min-height: 100vh`. **C'est tout.** Pas de reset CSS — le reset de Vuetify vient de `vuetify/styles`, pas de `v-app` — pas de couche applicative utile hors système de layout (app-bars, drawers), dont Ahoy n'a aucun composant. À réimplémenter : **six déclarations CSS**. Gain collatéral : le double `#app` du DOM actuel disparaît, et `#app` redevient sans ambiguïté le conteneur de `public/index.html`. |

## Ce qu'il faut aussi retirer, au-delà des composants

- **`src/plugins/vuetify.js` disparaît**, avec son bloc `theme` de 7 couleurs que personne ne lit. `main.js` perd un import et une option.
- **`vuetify`, `vue-cli-plugin-vuetify`, `vuetify-loader`** sortent de `package.json`. À vérifier : `vue.config.js` et `babel.config.js` peuvent référencer le plugin Vuetify.
- **Le reset CSS de `vuetify/styles` s'en va avec.** C'est le point aveugle de cette voie et il mérite d'être testé en premier dans le prototype : les marges par défaut de `<h1>`, de `<p>`, le `box-sizing`, le `line-height` de base changent tous. Le guide d'upgrade v2→v3 le signale d'ailleurs dans l'autre sens (« Global styles previously included as `.v-application p` or `.v-application ul` are no longer included »), preuve que ces styles globaux ont un effet mesurable. Sur un design au pixel, retirer un reset est plus risqué que renommer quarante props. Un reset minimal maison (`box-sizing: border-box`, marges à zéro) doit être écrit **avant** de retirer Vuetify, pas après.
- **`App.vue:99` (`.v-label`) et les règles `.v-btn`** deviennent des sélecteurs de classes qui n'existent plus. Il faut les rebrancher sur les nouveaux éléments — ce qui est mécanique, mais touche les 8 points de contact listés en partie 1.

## Bilan de la voie sans Vuetify

Ce qui ressort du relevé : **la plupart des « pertes » sont déjà perdues.** Le LESS d'Ahoy écrase à peu près tout ce que Vuetify apporte visuellement — fonds, bordures, couleurs, padding, typographie, état désactivé — et les couleurs du thème ne sont lues nulle part.

Ce qui se perd réellement, en une phrase : le ripple des boutons, l'animation d'ouverture des dialogues, l'apparence dessinée des radios et du switch, l'affichage automatique des messages de validation d'un champ, et le reset CSS global.

Ce qui se gagne : la suppression de trois dépendances, du `#app` en double, du fichier `plugins/vuetify.js` mort, des deux `::v-deep`, des `:checked` morts et de `primary-title` — et l'accès direct au DOM, ce qui compte quand 991 lignes de LESS doivent positionner au pixel des éléments qu'elles ne contrôlent pas aujourd'hui.

Le coût réel se concentre sur trois points, et aucun n'est une question de volume :

1. **Le reset CSS** retiré, dont l'effet se propage partout et ne se voit qu'à l'œil.
2. **Les 12px de gouttière** de la grille, dont tout le positionnement dépend implicitement.
3. **Le `<dialog>` natif**, seul endroit où il faut écrire du comportement (le pont `v-model` ↔ `showModal()`/`close()`) — et où, pour une fois, le natif rend plus que ce qu'il remplace.

---

## Ce que le prototype (#42) devrait mesurer en priorité

Les deux voies sont chiffrables sur le papier ; ce qui ne l'est pas, c'est le décalage visuel. Dans les deux cas, les mêmes trois zones décident :

1. **`Start.vue`** — la seule page qui concentre un `v-text-field`, un `v-form`, un `v-radio-group`, une `v-card` `outlined` et les deux `::v-deep`. C'est le cas le plus dur des deux voies ; si elle passe, le reste suit.
2. **Le conteneur racine** — `v-app` en v3 (perte de l'`id`, `--wrap`→`__wrap`) ou sa suppression pure ; dans les deux cas, `#app` change de sens et quatre fonds de page en dépendent.
3. **La gouttière de grille** — inchangée en Vuetify 3, à reproduire à l'identique en natif.

## Sources

Toutes consultées le 12 septembre 2026.

- [Guide d'upgrade Vuetify 2 → 3 (v3.13.4)](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/getting-started/upgrade-guide.md)
- [Guide d'upgrade Vuetify 4 (master)](https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/pages/en/getting-started/upgrade-guide.md)
- [Installation Vuetify 3 (v3.13.4)](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/getting-started/installation.md)
- [Icon Fonts, Vuetify 3 (v3.13.4)](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/docs/src/pages/en/features/icon-fonts.md)
- Sources `vuetify@3.13.4` : [VApp](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VApp/VApp.tsx), [VField](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VField/VField.tsx), [VInput](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VInput/VInput.tsx), [VDialog](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VDialog/VDialog.tsx), [VIcon](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VIcon/VIcon.tsx), [VSelectionControlGroup](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VSelectionControlGroup/VSelectionControlGroup.tsx), [VCardTitle](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VCard/VCardTitle.ts), [grid mixins](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/components/VGrid/_mixins.sass), [icons.ts](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/icons.ts), [composables/form.ts](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/src/composables/form.ts), [package.json](https://github.com/vuetifyjs/vuetify/blob/v3.13.4/packages/vuetify/package.json)
- Sources `vuetify@2.7.2` : [VApp](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VApp/VApp.ts), [VApp.sass](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VApp/VApp.sass), [VCard/index.ts](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VCard/index.ts), [VBtn.sass](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VBtn/VBtn.sass), [grid mixins](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/components/VGrid/_mixins.sass), [settings/_variables.scss](https://github.com/vuetifyjs/vuetify/blob/v2.7.2/packages/vuetify/src/styles/settings/_variables.scss)
- [Vue 3 — SFC CSS Features (`:deep()`)](https://vuejs.org/api/sfc-css-features.html) et [`compiler-sfc/pluginScoped.ts`](https://github.com/vuejs/core/blob/main/packages/compiler-sfc/src/style/pluginScoped.ts)
- [Vue 3 — Application API (`app.mount()`)](https://vuejs.org/api/application.html)
- [MDN — `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [caniuse — dialog](https://caniuse.com/dialog)
- [API GitHub des releases Vuetify](https://api.github.com/repos/vuetifyjs/vuetify/releases) (relevé du 12/09/2026)
