<template>
  <v-row justify="center">
    <v-dialog v-model="game.settings" max-width="400">
      <v-card>
        <v-card-title class="settings-title">{{
          $t("parametres")
        }}</v-card-title>
        <v-card-text>
          <v-radio-group v-model="$i18n.locale" row>
            <v-radio
              :label="$t('anglais')"
              value="en"
              :checked="{ checked: $i18n.locale == 'en' }"
            ></v-radio>
            <v-radio
              :label="$t('francais')"
              :checked="{ checked: $i18n.locale == 'fr' }"
              value="fr"
            ></v-radio>
          </v-radio-group>
          <v-switch v-model="fullScreen" :label="$t('plein_ecran')"></v-switch>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "Settings",
  data: function() {
    return {
      game: this.$game,
      fullScreen: document.webkitIsFullScreen || document.mozFullScreen || false
    };
  },
  watch: {
    fullScreen() {
      this.toggleFullscreen();
    }
  },
  methods: {
    toggleFullscreen(event) {
      var element = document.body;

      if (event instanceof HTMLElement) {
        element = event;
      }

      var isFullscreen =
        document.webkitIsFullScreen || document.mozFullScreen || false;

      element.requestFullScreen =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        function() {
          return false;
        };
      document.cancelFullScreen =
        document.cancelFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        function() {
          return false;
        };

      isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.settings-title {
  font-family: "Space Comics" !important;
  text-transform: uppercase;
  font-size: 18px !important;
  display: block;
  text-align: center;
}
</style>
