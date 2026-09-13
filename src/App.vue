<template>
  <div id="app">
    <i
      id="help"
      class="mdi mdi-help-circle"
      @click="game.help = !game.help"
    ></i>
    <i
      id="settings"
      class="mdi mdi-cog"
      @click="game.settings = !game.settings"
    ></i>
    <div
      v-if="game.help"
      @click="game.help = !game.help"
      class="help-mask"
    ></div>
    <Settings v-if="game.settings"></Settings>
    <Preloader></Preloader>
    <!--
      The small-screen guard is modal and unescapable, which is what <v-dialog
      persistent> was: @cancel.prevent drops the Escape key, and nothing closes
      it but widening the window.
    -->
    <dialog
      ref="ko"
      class="game-dialog"
      aria-labelledby="ko-title"
      @cancel.prevent
    >
      <div id="ko-title" class="game-dialog-title">
        Oups...
      </div>
      <div class="game-dialog-text">
        <div>
          Malheureusement, Ahoy! est actuellement seulement jouable sur grand
          écran, et n'est pas (encore) responsible !
        </div>
        <div>
          Augmentez la taille de votre fenêtre ou revenez jouer depuis un PC !
        </div>
      </div>
    </dialog>
    <router-view />
    <!--      <pre>{{ game }}</pre>-->
  </div>
</template>

<script>
import Preloader from "@/components/Preloader.vue";
import Settings from "@/components/Settings.vue";

const MIN_PLAYABLE_WIDTH = 1100;

export default {
  name: "App",
  components: {
    Preloader,
    Settings
  },
  data: function() {
    return {
      game: this.$game,
      displayKO: window.innerWidth <= MIN_PLAYABLE_WIDTH
    };
  },
  watch: {
    displayKO: "syncKO"
  },
  methods: {
    onResize() {
      this.displayKO = window.innerWidth <= MIN_PLAYABLE_WIDTH;
    },
    // A <dialog> only opens through showModal(), and both calls throw when the
    // element is already in the state they ask for.
    syncKO() {
      const dialog = this.$refs.ko;
      if (this.displayKO === dialog.open) {
        return;
      }
      if (this.displayKO) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  // A watcher never fires for the initial value, so the first open is ours.
  mounted() {
    this.syncKO();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style lang="less">
@import "./styles/layout.less";
@import "./styles/button.less";
@import "./styles/dialog.less";

// Reset. It used to arrive with vuetify/styles, not with <v-app>, and four
// things in it were load-bearing for a game positioned to the pixel:
//
//   - border-box, which every width and padding in this project assumes;
//   - the permanent scrollbar, which keeps the viewport 15px narrower and so
//     fixes what the 1920-wide reference design converts against;
//   - zeroed margins, without which the UA's own margins move every heading
//     and paragraph;
//   - `font: inherit` on form controls, which is what stops buttons and inputs
//     from falling back to the system font.
//
// The rest of Vuetify's reset was normalize.css for browsers this game does
// not target, and is deliberately not carried over.
html {
  box-sizing: border-box;
  // Always present, so the page never jumps and the width never changes.
  overflow-y: scroll;
  // The game is laid out in fixed pixels with negative margins; Vuetify hid
  // the horizontal overflow that produces, and so must we.
  overflow-x: hidden;
  // Explicit because the `*` rule below would otherwise set the root to 25px
  // and take every rem with it. Vuetify was quietly holding this at 16.
  font-size: 16px;
  // Vuetify set both; the antialiasing visibly thins the pirate fonts.
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

* {
  margin: 0;
  padding: 0;
}

button,
input,
select,
textarea {
  font: inherit;
}

@baseFontSize: 25px;

//Fonts Déclaration
@font-face {
  font-family: "Roman Antique";
  src: url("assets/fonts/EnchantedLand.otf") format("opentype");
}

@font-face {
  font-family: "Space Comics";
  src: url("assets/fonts/SpaceComics.ttf") format("truetype");
}

* {
  font-family: "Roman Antique";
  font-size: @baseFontSize;
}

#app {
  min-height: 100vh;
  // .theme--light.v-application's text colour, which everything that sets none
  // of its own inherits.
  color: rgba(0, 0, 0, 0.87);
  // The last of .v-application's own box. It reads as vestigial -- Vuetify laid
  // out a drawer and a main pane with it -- but it is load-bearing here: as a
  // flex container it makes every .grid-row shrink to its content instead of
  // filling the page, and the placement row wraps onto two lines because of it.
  display: flex;
  position: relative;
  // Vuetify's .v-application set this, and the page's vertical rhythm depends
  // on it: without it every line box shrinks to the font's natural height.
  line-height: 1.5;
  // Both were Vuetify's: the height of .v-application, and the padding of
  // .v-application--wrap.
  padding: 15px 30px;
}

// The button half of these rules moved to styles/button.less with the last
// v-btn; what is left is the page titles, which were only ever sharing the
// declaration block.
h1 {
  text-align: center;
  font-family: "Space Comics";
  text-transform: uppercase;
  * {
    font-family: "Space Comics";
    text-transform: uppercase;
  }
}

h1 {
  -webkit-text-fill-color: black;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: white;
  margin: 10px auto;
  z-index: 9999;
  position: relative;
  pointer-events: none;
}

.tooltip {
  position: absolute;
  background-color: #f3daa4 !important;
  border-color: #debc72 !important;
  border: 2px solid;
  color: #c34a29 !important;
  padding: 8px 11px;
  border-radius: 5px;
  z-index: 100000;
  line-height: 1;
  max-width: 430px;
  text-align: center;

  .text {
    font-family: "Space Comics";
    text-transform: uppercase;
    font-size: 7px;
  }
}
// The MDI glyph lives on ::before and inherits font-size from here, so the
// 30px still drives it. The rest is what .v-icon used to bring: the flex box
// centring the glyph, line-height 1 against the 1.5 inherited from #app -- it
// alone would push the icon 7px down -- and the pointer it got from
// .v-icon--link. The colour no longer needs !important: it only fought
// .theme--light.v-icon, which no longer matches.
#settings,
#help {
  z-index: 100000000;
  position: fixed;
  top: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 30px;
  color: white;
  cursor: pointer;
  user-select: none;
}
#settings {
  right: 7px;
}
#help {
  right: 42px;
}
.help-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #ca559b8f;
  z-index: 10000;
}
.page-title {
  font-size: 35px;
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
}
</style>
