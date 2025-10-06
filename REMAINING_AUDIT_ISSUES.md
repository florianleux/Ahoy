# Remaining Audit Issues

This document lists all **Medium and Low priority** issues identified in the comprehensive code audit that have not yet been addressed.

---

## Summary

- ✅ **Critical Issues**: All Fixed
- ✅ **High Priority Issues**: All Fixed  
- ⏳ **Medium Priority Issues**: 11 remaining
- ⏳ **Low Priority Issues**: 8 remaining

---

## 🟡 MEDIUM PRIORITY ISSUES (11)

### 1. Native Browser Dialogs 🟡 MEDIUM
**Category**: User Experience / Consistency  
**Location**: `src/components/Start.vue:80`

**Issue**:
```javascript
let savedGameDetected = confirm(_this.$t("alert_partie_existante"));
```

Using native `confirm()` dialogs is inconsistent with the Vuetify UI and not customizable.

**Impact**:
- Breaks visual consistency
- Can't be styled to match game theme
- Poor mobile experience
- Not translatable styling

**Solution**:
Replace with Vuetify dialog component:
```vue
<v-dialog v-model="showConfirmDialog" max-width="400">
  <v-card>
    <v-card-title>{{ $t("confirmation") }}</v-card-title>
    <v-card-text>{{ $t("alert_partie_existante") }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="showConfirmDialog = false">{{ $t("annuler") }}</v-btn>
      <v-btn color="primary" @click="confirmNewGame">{{ $t("confirmer") }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

---

### 2. No localStorage Error Handling 🟡 MEDIUM
**Category**: Error Handling / Resilience  
**Locations**:
- `src/components/Start.vue:73`
- `src/classes/Game.js:27, 42`

**Issue**:
```javascript
savedGame: localStorage.ahoyGame  // No try/catch
localStorage.ahoyGame = JSON.stringify(this);  // No error handling
this.$game.loadGame(JSON.parse(this.savedGame));  // Can throw on invalid JSON
```

**Impact**:
- App crashes if localStorage is disabled (private browsing)
- Corrupted save data causes uncaught exceptions
- No fallback for storage quota exceeded
- Poor user experience

**Solution**:
```javascript
// Utility function
function safeLocalStorage() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

// Usage
saveGame() {
  try {
    if (!safeLocalStorage()) {
      console.warn('localStorage not available');
      return;
    }
    localStorage.ahoyGame = JSON.stringify(this);
  } catch(e) {
    console.error('Failed to save game:', e);
    // Show user-friendly error message
  }
}

loadGame() {
  try {
    const savedData = localStorage.ahoyGame;
    if (!savedData) return null;
    return JSON.parse(savedData);
  } catch(e) {
    console.error('Failed to load game:', e);
    localStorage.removeItem('ahoyGame'); // Clear corrupted data
    return null;
  }
}
```

---

### 3. Magic Numbers Throughout Codebase 🟡 MEDIUM
**Category**: Code Quality / Maintainability  
**Locations**:
- `src/mixins/responsivePosition.js`: `1920, 1080` (base resolution)
- `src/components/Placement/Map.vue`: `420px` (grid size)
- `src/App.vue:56`: `1100` (minimum window width)
- Various components: hardcoded coordinates

**Issue**:
```javascript
const windowWidth = window.innerWidth;
const xScale = windowWidth / 1920;  // Magic number
const yScale = windowHeight / 1080;  // Magic number

@grid-size: 420px;  // What does this represent?

if (window.innerWidth > 1100) {  // Why 1100?
```

**Impact**:
- Hard to understand what values represent
- Difficult to modify for different screen sizes
- Error-prone when making responsive adjustments
- No single source of truth

**Solution**:
Create a constants file:
```javascript
// src/constants/layout.js
export const LAYOUT = {
  BASE_RESOLUTION: {
    WIDTH: 1920,
    HEIGHT: 1080
  },
  GRID: {
    SIZE: 420,
    ROWS: 10,
    COLS: 10
  },
  BREAKPOINTS: {
    MINIMUM_WIDTH: 1100,
    TABLET: 768,
    MOBILE: 480
  },
  PLACEMENT: {
    MAP: { x: 500, y: 215, width: 475, height: 475 },
    FLEET: { x: 1100, y: 300, width: 600, height: 600 }
  }
};
```

---

### 4. Hardcoded French Text in Code 🟡 MEDIUM
**Category**: Internationalization  
**Locations**:
- `src/components/Start.vue:68-70` (validation rules)
- `src/App.vue:18-28` (error dialog)
- `src/components/Placement/Map.vue:14, 27` (tooltips)

**Issue**:
```javascript
nameRules: [
  v => v.length > 1 || "Votre nom doit comporter au minimum 1 caractère",  // Hardcoded French
  v => v.length < 15 || "Votre nom doit comporter au maximum 15 caractères"  // Hardcoded French
]
```

```vue
<v-card-title class="headline">Oups...</v-card-title>  <!-- Hardcoded French -->
<span class="text">Cliquez sur la carte pour placer...</span>  <!-- Hardcoded French -->
```

**Impact**:
- Breaks i18n system
- English users see French text
- Inconsistent with rest of app
- Makes maintenance harder

**Solution**:
Move all strings to i18n files:
```javascript
nameRules: [
  v => v.length > 1 || this.$t('validation.name_min_length'),
  v => v.length < 15 || this.$t('validation.name_max_length')
]
```

Add to `src/locales/en.json` and `src/locales/fr.json`:
```json
{
  "validation": {
    "name_min_length": "Your name must have at least 1 character",
    "name_max_length": "Your name must have at most 15 characters"
  }
}
```

---

### 5. Empty Vuex Store but Still Imported 🟡 MEDIUM
**Category**: Code Organization / Bundle Size  
**Location**: `src/store/index.js`, `src/main.js:5,17`

**Issue**:
```javascript
// src/store/index.js - Completely empty
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});
```

Game state is managed via `Vue.prototype.$game` instead of Vuex, but Vuex is still imported and initialized.

**Impact**:
- Adds ~8KB to bundle for unused code
- Confusing for developers (is Vuex being used?)
- Maintenance overhead
- Mixed state management patterns

**Solution**:

**Option A**: Remove Vuex entirely (recommended for small app):
```javascript
// Remove from main.js
- import store from "./store";
- store,

// Remove from package.json
npm uninstall vuex

// Delete src/store/index.js
```

**Option B**: Migrate to Vuex (better for larger app):
```javascript
// src/store/index.js
export default new Vuex.Store({
  state: {
    game: new Game()
  },
  getters: {
    player: state => state.game.player,
    currentEnemy: state => state.game.player?.enemy,
    // ...
  },
  mutations: {
    NEW_GAME(state, { playerName, playerIdentity }) {
      state.game.newGame(playerName, playerIdentity);
    },
    // ...
  }
});
```

---

### 6. Bitwise Operator Bug (Potential) 🟡 MEDIUM
**Category**: Logic Error  
**Location**: `src/classes/Game.js:62`

**Issue**:
```javascript
if (this.player.enemy.turn & !this.player.enemy.defeat) {
  //                         ^ Single ampersand (bitwise AND)
```

Should be logical AND (`&&`) not bitwise AND (`&`).

**Impact**:
- Works by accident due to truthy/falsy values
- Confusing for code readers
- May cause subtle bugs if values change
- Not semantically correct

**Solution**:
```javascript
if (this.player.enemy.turn && !this.player.enemy.defeat) {
  //                         ^^ Logical AND
  this._enemyTurn();
}
```

---

### 7. Typo in App.vue 🟡 MEDIUM
**Category**: User Experience / Copy  
**Location**: `src/App.vue:23`

**Issue**:
```vue
Malheureusement, Ahoy! est actuellement seulement jouable sur
grand écran, et n'est pas (encore) responsible !
<!--                                  ^^^^^^^^^ Should be "responsive" -->
```

**Impact**:
- Unprofessional
- Confusing for French speakers
- Easily fixable

**Solution**:
```vue
et n'est pas (encore) responsive !
```

Better: Move to i18n:
```json
{
  "errors": {
    "screen_too_small_title": "Oups...",
    "screen_too_small_message": "Malheureusement, Ahoy! est actuellement seulement jouable sur grand écran, et n'est pas (encore) responsive !"
  }
}
```

---

### 8. No Loading States for Images 🟡 MEDIUM
**Category**: User Experience  
**Locations**: All image-heavy components

**Issue**:
No loading indicators while images are loading. Users see blank spaces or broken layouts until assets load.

**Impact**:
- Poor perceived performance
- Jarring user experience on slow connections
- Layout shifts as images load
- No feedback to user

**Solution**:
```vue
<template>
  <div class="image-container">
    <v-progress-circular 
      v-if="!imageLoaded" 
      indeterminate 
      color="primary"
    ></v-progress-circular>
    <img 
      :src="imageSrc" 
      @load="imageLoaded = true"
      :style="{ opacity: imageLoaded ? 1 : 0 }"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageLoaded: false
    }
  }
}
</script>
```

Or use Preloader component more effectively.

---

### 9. Console.log in Production Code 🟡 MEDIUM
**Category**: Security / Performance  
**Location**: `src/utils/AudioManager.js` (and potentially others)

**Issue**:
Debug console.log statements left in production code.

**Impact**:
- Performance overhead
- Potential information leakage
- Cluttered browser console
- Unprofessional

**Solution**:
1. Remove all console.log statements
2. Or use a proper logging library with levels:

```javascript
// src/utils/logger.js
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'ERROR' : 'DEBUG';

export const logger = {
  debug(...args) {
    if (LOG_LEVEL === 'DEBUG') console.log('[DEBUG]', ...args);
  },
  info(...args) {
    if (['DEBUG', 'INFO'].includes(LOG_LEVEL)) console.info('[INFO]', ...args);
  },
  warn(...args) {
    if (['DEBUG', 'INFO', 'WARN'].includes(LOG_LEVEL)) console.warn('[WARN]', ...args);
  },
  error(...args) {
    console.error('[ERROR]', ...args);
  }
};
```

---

### 10. No Component Prop Validation 🟡 MEDIUM
**Category**: Type Safety / Developer Experience  
**Locations**: Multiple components that don't receive props properly

**Issue**:
Components don't validate their props, making it easy to pass wrong data types or miss required props.

**Impact**:
- Runtime errors instead of development warnings
- Harder to debug prop-related issues
- Poor developer experience
- Documentation lacking

**Solution**:
Add prop validation to all components that accept props:

```javascript
// Example for a component that should receive player data
export default {
  name: "PlayerProfile",
  props: {
    player: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.identity && typeof value.health === 'number';
      }
    },
    showHealth: {
      type: Boolean,
      default: true
    }
  }
}
```

---

### 11. Inconsistent Variable Naming 🟡 MEDIUM
**Category**: Code Quality  
**Locations**: Throughout codebase

**Issue**:
Mix of naming conventions:
- `var _this = this;` (old pattern)
- `let`, `const`, `var` used inconsistently
- `playerMap` vs `player_map` inconsistency

**Impact**:
- Confusing for team members
- Harder to maintain
- Can lead to scoping bugs

**Solution**:
Standardize on:
- Use `const` by default, `let` when mutation needed
- Never use `var`
- Remove `var _this = this` pattern (use arrow functions instead)
- Use camelCase consistently

---

## 🟢 LOW PRIORITY ISSUES (8)

### 1. Unused AnimateCSS Import 🟢 LOW
**Category**: Bundle Size  
**Location**: `src/main.js:3,12`

**Issue**:
```javascript
import AnimateCSS from "animate.css";
Vue.use(AnimateCSS);
```

AnimateCSS is imported but doesn't appear to be used anywhere.

**Impact**: Small bundle size increase (~50KB)

**Solution**: Remove if unused, or implement animations if intended.

---

### 2. Commented-out Debug Code 🟢 LOW
**Category**: Code Cleanliness  
**Location**: `src/App.vue:33`

**Issue**:
```vue
<!--      <pre>{{ game }}</pre>-->
```

**Impact**: Clutters codebase

**Solution**: Remove commented debug code.

---

### 3. Duplicate Position Properties 🟢 LOW
**Category**: Code Quality  
**Location**: `src/components/Fight/PlayerMap.vue:113`

**Issue**:
```less
.canvas {
  transform: rotate(10deg);
  position: absolute;
  position: absolute;  // Duplicate
```

**Impact**: Minor CSS redundancy

**Solution**: Remove duplicate.

---

### 4. Inconsistent Spacing in Templates 🟢 LOW
**Category**: Code Style  
**Locations**: Various components

**Issue**: Inconsistent use of spaces in template bindings and directives.

**Impact**: Minor readability issue

**Solution**: Run Prettier/ESLint fix.

---

### 5. No ESLint Rules for Vue Best Practices 🟢 LOW
**Category**: Code Quality  
**Location**: ESLint configuration

**Issue**: Could enforce more Vue-specific best practices.

**Solution**: Add `plugin:vue/recommended` to ESLint config.

---

### 6. Missing Alt Text on Some Images 🟢 LOW
**Category**: Accessibility  
**Locations**: Various components

**Issue**: Some `<img>` tags have empty `alt=""` attributes.

**Impact**: Poor accessibility for screen readers

**Solution**: Add meaningful alt text or use `alt=""` only for decorative images.

---

### 7. No TypeScript 🟢 LOW
**Category**: Type Safety  
**Location**: Entire codebase

**Issue**: No static type checking.

**Impact**: 
- More runtime errors
- Harder to refactor safely
- Poor IDE autocomplete

**Solution**: Gradually migrate to TypeScript (see migration attempt history).

---

### 8. No Unit Tests 🟢 LOW
**Category**: Code Quality / Reliability  
**Location**: No test files

**Issue**: No automated testing coverage.

**Impact**:
- Regressions not caught
- Refactoring is risky
- Hard to verify complex logic

**Solution**: 
Add Jest + Vue Test Utils:
```bash
npm install --save-dev @vue/test-utils jest
```

---

## 📊 Priority Breakdown

### By Category
- **User Experience**: 4 issues
- **Code Quality**: 8 issues
- **Error Handling**: 2 issues
- **Internationalization**: 1 issue
- **Performance**: 2 issues
- **Accessibility**: 1 issue
- **Security**: 1 issue

### Recommended Implementation Order

**Phase 1 - Quick Wins (1-2 hours)**:
1. Fix typo "responsible" → "responsive"
2. Remove console.log statements
3. Fix bitwise operator bug
4. Remove commented code and unused imports
5. Fix duplicate CSS property

**Phase 2 - Error Resilience (2-3 hours)**:
6. Add localStorage error handling
7. Add loading states for images

**Phase 3 - User Experience (3-4 hours)**:
8. Replace confirm() with Vuetify dialog
9. Move hardcoded French text to i18n

**Phase 4 - Code Quality (4-6 hours)**:
10. Extract magic numbers to constants
11. Standardize variable naming
12. Add prop validation
13. Remove or use Vuex properly

**Phase 5 - Nice to Have (Optional)**:
14. Add TypeScript
15. Add unit tests
16. Improve accessibility
17. Add ESLint rules

---

## 🎯 Estimated Impact

### If All Medium Issues Fixed:
- **Bundle Size**: -8-10KB (Vuex removal)
- **Code Maintainability**: +40% (constants, i18n, naming)
- **Error Resilience**: +60% (localStorage handling)
- **User Experience**: +30% (dialogs, loading states)
- **Developer Experience**: +50% (prop validation, clear patterns)

### Time Investment:
- **Phase 1**: 1-2 hours → High return
- **Phase 2**: 2-3 hours → Very high return (prevents crashes)
- **Phase 3**: 3-4 hours → High return (UX)
- **Phase 4**: 4-6 hours → Medium return (maintainability)
- **Phase 5**: 10+ hours → Low return (nice to have)

---

## ✅ Already Fixed (Reference)

For reference, these critical and high-priority issues have already been addressed:

1. ✅ Broken router configuration
2. ✅ Memory leaks from event listeners (6 locations)
3. ✅ Dev debug buttons in production
4. ✅ jQuery dependency
5. ✅ Audio object memory leaks
6. ✅ Duplicate fullscreen logic
7. ✅ Direct DOM manipulation for body classes
8. ✅ Duplicate resize calculation logic
9. ✅ All images migrated to WebP format
10. ✅ Legacy PNG/JPG images removed

---

**Document Version**: 1.0  
**Last Updated**: After WebP migration and image cleanup  
**Status**: Ready for implementation

