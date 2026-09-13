<template>
  <!--
    The Vuetify classes and data-app are kept without <v-app>: every Vuetify
    rule is prefixed with .v-application, and its dialogs look up [data-app] to
    detach themselves. The remaining Vuetify components (dialogs, cards,
    buttons, inputs) still need both. They go away with Vuetify itself.
  -->
  <div
    id="app"
    class="v-application v-application--is-ltr theme--light"
    data-app="true"
  >
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
      class="ko-dialog"
      aria-labelledby="ko-title"
      @cancel.prevent
    >
      <div id="ko-title" class="ko-title">
        Oups...
      </div>
      <div class="ko-text">
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
  // Vuetify's .v-application set this, and the page's vertical rhythm depends
  // on it: without it every line box shrinks to the font's natural height.
  line-height: 1.5;
  // Both were Vuetify's: the height of .v-application, and the padding of
  // .v-application--wrap.
  padding: 15px 30px;
}

#app .primary {
  background-color: #dcb570 !important;
  box-shadow: 0px 2px 0px 0px #debc72;
  border-color: #debc72 !important;
  border: 2px solid;
  color: #893522 !important;
}

h1,
.v-btn {
  text-align: center;
  font-family: "Space Comics";
  text-transform: uppercase;
  * {
    font-family: "Space Comics";
    text-transform: uppercase;
  }
}
.v-btn {
  padding: 30px 15px 20px 15px !important;
  display: flex !important;

  * {
    font-size: 12px;
  }

  &.v-btn--disabled {
    box-shadow: 0px 2px 0px 0px #bca680 !important;
    border: 2px solid #bca680 !important;
    color: rgb(0 0 0 / 13%) !important;
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
// Replaces Vuetify's .v-overlay__scrim, which was rgb(33, 33, 33) at .46.
dialog::backdrop {
  background: rgba(33, 33, 33, 0.46);
}

// The geometry v-dialog gave this modal: 500px wide, centred, 24px minimum
// gutter, and the elevation-24 shadow of a Vuetify dialog.
.ko-dialog {
  width: 500px;
  max-width: calc(100% - 48px);
  // Vuetify's reset zeroes the margin the UA stylesheet uses to centre a modal
  // <dialog>, and the 24px gutter v-dialog kept is in the max-width above.
  margin: auto;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: #fff;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
}

// What .v-card__title.headline resolved to: Roboto rather than the global
// Roman Antique, which the Vuetify typography class forced with !important.
.ko-title {
  padding: 16px 24px 10px;
  font-family: Roboto, sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

// .v-card__text: its own padding, and the muted colour the two lines inherit.
.ko-text {
  padding: 0 24px 20px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 22px;
}

.page-title {
  font-size: 35px;
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
}
</style>
