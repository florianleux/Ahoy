<template>
  <v-row id="map" v-if="playerMap.boatMap[9]">
    <div class="attack-result">
      <transition
        name="enemyAttackMessage"
        enter-to-class="animate__animated animate__tada"
        leave-to-class="animate__animated animate__fadeOut"
      >
        <div v-if="enemy.attackMessage">{{ enemy.attackMessage }}</div>
      </transition>
      <div v-if="!enemy.attackMessage">&nbsp;</div>
    </div>
    <div class="canvas" :class="{ disabled: !enemy.turn }">
      <div class="line" v-for="n in 10" :key="n">
        <div
          class="square"
          :data-y="n"
          :data-x="m"
          v-for="m in 10"
          :key="m"
          v-bind:class="{
            placed: playerMap.boatMap[n - 1][m - 1],
            hit: enemyMap.hitMap[n - 1][m - 1] == 'hit',
            missed: enemyMap.hitMap[n - 1][m - 1] == 'missed',
            destroyed: isDestroyed(n, m)
          }"
        ></div>
      </div>
    </div>
  </v-row>
</template>

<script>
export default {
  name: "MapVue",
  data: function() {
    return {
      game: this.$game,
      fleet: this.$game.player.fleet,
      player: this.$game.player,
      enemy: this.$game.player.enemy,
      playerMap: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      target: null
    };
  },
  methods: {
    isDestroyed(n, m) {
      if (this.playerMap.boatMap[n - 1][m - 1]) {
        return this.player.fleet.boats[this.playerMap.boatMap[n - 1][m - 1] - 1]
          .destroyed;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped lang="less">
@grid-size: 230px;

#map {
  transform: rotate(10deg);
  float: left;
  margin-top: @grid-size / 5 + 120px;
  position: relative;
  margin-left: 110px;
}
.attack-result {
  position: absolute;
  top: -25px;
  width: 100px;
  right: 50%;
  text-align: center;
  margin-right: -50px;
  font-size: 13px;
}

.canvas {
  margin: auto;
  width: @grid-size;
  height: @grid-size;
  border: 1px solid red;

  &.disabled {
    opacity: 0.5;
  }
}

.line {
  height: @grid-size / 10;
}

.square {
  float: left;
  width: 10%;
  border: 1px solid red;
  height: 100%;

  &.placed {
    background: green;
  }

  &.hit {
    background: orangered;

    &.destroyed {
      background: black;
    }
  }

  &.missed {
    background: blue;
  }
}
</style>
