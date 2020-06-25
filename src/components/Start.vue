<template>
  <div>
      <header>AHOY !</header>

      <v-form v-model="valid">
         <v-row>
             <v-col cols="6">
                 <v-text-field
                         v-model="playerName"
                         :rules="nameRules"
                         required
                 />
             </v-col>
             <v-col cols="6">
                 <v-btn
                     :disabled="!valid"
                     color="success"
                     class="mr-4"
                     @click="newGame"
                 >
                     Play!
                 </v-btn>
             </v-col>
         </v-row>
      </v-form>

    <!--<input :value="playerName" type="text" />-->
    <!--<button @click="newGame">Play !</button>-->
    {{ phrase }}
  </div>
</template>

<script>
import { Game } from "@/classes/Game.js";

export default {
  data() {
    return {
      game: null,
      phrase: "Jeu non lancé",
        valid: false,
        playerName: '',
        nameRules: [
            v => v.length > 3 || 'Votre nom doit comporter au minimum 4 caractères',
        ],
    };
  },
  methods: {
    newGame() {
      this.game = new Game(this);
      this.game.player.name = this.playerName;
      this.phrase = "Coucou " + this.game.player.name;
      this.$router.push({ name: 'Placement', params: { game: this.game } });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
