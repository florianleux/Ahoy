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
              placeholder="Votre nom de Pirate"
              v-model="playerName"
              :rules="nameRules"
              class="name-input"
              required
            />
          </v-col>
          <v-col cols="12">
            <div class="label">Vous êtes :</div>
            <v-radio-group class="identity-input" v-model="playerIdentity" row>
              <v-col cols="6">
                <v-radio label="Un homme" value="male"></v-radio>
              </v-col>
              <v-col cols="6">
                <v-radio label="Une femme" value="female"></v-radio>
              </v-col>
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-btn
              :disabled="!valid"
              color="primary"
              class="start-game"
              @click="newGame"
            >
              Nouvelle Partie
            </v-btn>
            <v-btn
              :disabled="!savedGame"
              color="primary"
              class="load-game"
              @click="loadGame"
            >
              Continuer
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
    newGame() {
      if (this.savedGame) {
        let savedGameDetected = confirm(
          "Il semblerait que vous avez déja commencé une partie de Ahoy! Si vous commencez une nouvelle partie, la sauvegarde existante sera écrasée !"
        );

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
    },
    loadGame() {
      this.$game.loadGame(JSON.parse(this.savedGame));
      let homeAudio = new Audio("/music/home.wav");
      this.$game.clickSound.play();
      homeAudio.loop = true;
      homeAudio.play();
      homeAudio.volume = 0.15;
      this.$router.push({ name: "PreFight" });
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
}

.player-img {
  position: fixed;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 10%;
}
.game-title {
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
