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
  </div>
</template>

<script>
    import {Player} from '@/classes/Player.js';

    export default {
  data() {
    return {
        valid: false,
        playerName: '',
        nameRules: [
            v => v.length > 3 || 'Votre nom doit comporter au minimum 4 caractères',
        ],
    };
  },
  methods: {
    newGame() {
      this.$game.player = new Player(this.playerName);
      this.$router.push({ name: 'Placement'});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
