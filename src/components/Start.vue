<template>
  <v-row class="start-page">
    <img
      class="player-img"
      :src="publicPath + 'home/players/' + playerIdentity + '.png'"
    />

    <v-card class="home-card rounded-lg" outlined elevation="24">
      <v-card-title><h1 class="game-title">AHOY !</h1></v-card-title>
      <v-form class="start-form" v-model="valid">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :placeholder="$t('votre_nom_de_pirate')"
              v-model="playerName"
              :rules="nameRules"
              class="name-input"
              required
            />
          </v-col>
          <v-col cols="12">
            <div class="label">{{ $t("vous_etes") }}</div>
            <v-radio-group class="identity-input" v-model="playerIdentity" row>
              <v-col cols="6">
                <v-radio :label="$t('un_homme')" value="male"></v-radio>
              </v-col>
              <v-col cols="6">
                <v-radio :label="$t('une_femme')" value="female"></v-radio>
              </v-col>
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-btn
              :disabled="!valid"
              color="primary"
              class="start-game"
              id="startButton"
              @click="newGame"
            >
              {{ $t("nouvelle_partie") }}
            </v-btn>
            <v-btn
              :disabled="!savedGame"
              color="primary"
              class="load-game"
              id="loadButton"
              @click="loadGame"
            >
              {{ $t("continuer") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      playerName: "",
      playerIdentity: "male",
      nameRules: [
        v => v.length > 1 || "Votre nom doit comporter au minimum 1 caractère",
        v =>
          v.length < 15 || "Votre nom doit comporter au maximum 15 caractères"
      ],
      publicPath: process.env.BASE_URL,
      savedGame: localStorage.ahoyGame
    };
  },
  methods: {
    newGame(event) {
      var _this = this;
      if (this.savedGame) {
        let savedGameDetected = confirm(_this.$t("alert_partie_existante"));

        if (!savedGameDetected) {
          return false;
        }
      }
      let homeAudio = new Audio("/music/home.wav");
      this.$game.clickSound.play();
      homeAudio.loop = true;
      homeAudio.play();
      homeAudio.volume = 0.15;
      this.$game.newGame(this.playerName, this.playerIdentity);
      this.$router.push({ name: "PreFight" });
      this.toggleFullscreen(event);
    },
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
    },
    loadGame(event) {
      this.$game.loadGame(JSON.parse(this.savedGame));
      let homeAudio = new Audio("/music/home.wav");
      this.$game.clickSound.play();
      homeAudio.loop = true;
      homeAudio.play();
      homeAudio.volume = 0.15;
      this.$router.push({ name: "PreFight" });
      this.toggleFullscreen(event);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.home-card {
  margin: auto;
  position: fixed;
  top: 50%;
  margin-top: -250px;
  left: 75%;
  margin-left: -196px;
  background: #ffe4b4;
  border: 3px solid #d09c5f;
  color: #502218 !important;

  * {
    color: #502218 !important;
  }
}

#startButton {
  width: 250px;
  margin-bottom: 15px;
}
#loadButton {
  width: 250px;
}

.player-img {
  position: fixed;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 10%;
}
.game-title {
  -webkit-text-fill-color: #ffffff;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #dcb570;
  font-size: 50px;
  margin-top: 35px;
  line-height: 1;
  color: black;
}
.start-form {
  max-width: 390px;
  margin: auto;

  .name-input,
  .identity-input {
    max-width: 300px;
    display: block;
    margin: auto;

    &::v-deep input {
      text-align: center;
    }

    &::v-deep .v-text-field__details * {
      text-align: center;
    }
  }

  .label {
    text-align: center;
  }
  .identity-input {
    padding-left: 25px;
  }

  .v-btn {
    margin: auto;
    display: block;
  }
}
</style>
