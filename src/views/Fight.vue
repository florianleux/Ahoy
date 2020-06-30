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
      <v-col>
        <v-btn @click="randomize">
          RANDOM
        </v-btn>
      </v-col>
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
  },
  methods: {
    randomize: function() {
      this.enemy.map.boatMap = this.enemy.map._resetMap();
      this.enemy.map.generateRandomMap(this.enemy.fleet);
    }
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
</style>
