<template>
  <div>
    <div class="page-title">
      Phase de BAGARRE
    </div>
    <v-row>
      <v-col cols="6">
        <EnemyMap></EnemyMap>
      </v-col>
      <v-col cols="6">
        <PlayerMap></PlayerMap>
      </v-col>
    </v-row>
    <v-row class="turn-indication">
      <div v-if="player.turn">C'est votre tour !</div>
      <div v-if="enemy.turn">C'est au tour de votre adversaire !</div>
    </v-row>
    <div v-if="player.status" class="endgame popin ">
      <div class="victory" v-if="player.status === 'VICTORY'">
        <span>VICTORY</span>
      </div>

      <div class="defeat" v-if="player.status === 'DEFEAT'">
        DEFEAT
      </div>

      <div class="mask"></div>
    </div>
  </div>
</template>

<script>
import PlayerMap from "@/components/Fight/PlayerMap.vue";
import EnemyMap from "@/components/Fight/EnemyMap.vue";

export default {
  name: "Fight",
  components: {
    PlayerMap,
    EnemyMap
  },
  data: function() {
    return {
      game: this.$game,
      enemy: this.$game.player.enemy,
      player: this.$game.player
    };
  }
};
</script>

<style scoped lang="less">
.mask {
  display: block;
  position: absolute;
  background: black;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.popin {
  color: white;
}
.turn-indication {
  text-align: center;
}
</style>
