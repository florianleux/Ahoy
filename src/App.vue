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
