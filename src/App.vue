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
    <v-icon id="help" @click="game.help = !game.help">mdi-help-circle</v-icon>
    <v-icon id="settings" @click="game.settings = !game.settings"
      >mdi-cog</v-icon
    >
    <div
      v-if="game.help"
      @click="game.help = !game.help"
      class="help-mask"
    ></div>
    <Settings v-if="game.settings"></Settings>
    <Preloader></Preloader>
    <v-dialog v-model="displayKO" persistent width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          Oups...
        </v-card-title>
        <v-card-text>
          <div>
            Malheureusement, Ahoy! est actuellement seulement jouable sur grand
            écran, et n'est pas (encore) responsible !
          </div>
          <div>
            Augmentez la taille de votre fenêtre ou revenez jouer depuis un PC !
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <router-view />
    <!--      <pre>{{ game }}</pre>-->
  </div>
</template>

<script>
import Preloader from "@/components/Preloader.vue";
import Settings from "@/components/Settings.vue";

export default {
  name: "App",
  components: {
    Preloader,
    Settings
  },
  data: function() {
    return {
      game: this.$game,
      displayKO: this.onResize()
    };
  },
  methods: {
    onResize() {
      if (window.innerWidth > 1100) {
        this.displayKO = false;
      } else {
        this.displayKO = true;
      }
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style lang="less">
@import "./styles/layout.less";

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

.v-label {
  font-size: 22px !important;
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
#settings {
  z-index: 100000000;
  position: fixed;
  right: 7px;
  top: 5px;
  font-size: 30px;
  color: white !important;
}
#help {
  z-index: 100000000;
  position: fixed;
  right: 42px;
  top: 5px;
  font-size: 30px;
  color: white !important;
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
