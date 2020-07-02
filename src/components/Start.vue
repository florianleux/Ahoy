<template>
  <v-row class="start-page">
    <v-col cols="12"><h1 class="game-title">AHOY !</h1></v-col>
    <v-col cols="12">
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
            <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="start-game"
                    @click="newGame"
            >
              Play!
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

  </v-row>
</template>

<script>
import { Player } from "@/classes/Player.js";
import { Enemy } from "@/classes/Enemy.js";

export default {
  data() {
    return {
      valid: false,
      playerName: "",
      nameRules: [
        v => v.length > 1 || "Votre nom doit comporter au minimum 1 caractère",
        v =>
          v.length < 15 || "Votre nom doit comporter au maximum 15 caractères"
      ]
    };
  },
  methods: {
    newGame() {
      this.$game.player = new Player(this.playerName);
      this.$game.player.enemy = new Enemy("Captain Bob");
      this.$router.push({ name: "Placement" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .start-page{
    padding-top:150px;
  }
  .game-title{
    font-size:100px;
    color: #ffbf00;
  }
  .start-form{
    width :40%;
    max-width :500px;
    margin: auto;
    padding-top:50px;

    .name-input{
      max-width: 300px;
      display:block;
      margin: auto;

      &::v-deep input{
        text-align: center;
      }

      &::v-deep .v-text-field__details *{
        text-align : center;
      }
    }

    .v-btn{
      margin:auto;
      display:block;
    }
  }
</style>
