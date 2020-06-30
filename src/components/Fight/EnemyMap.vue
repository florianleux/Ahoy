<template>
  <v-row id="map" v-if="enemyMap.boatMap[9]">
    <div class="canvas">
      <div class="line" v-for="n in 10" :key="n">
        <div
          class="square"
          :data-y="n"
          :data-x="m"
          v-for="m in 10"
          :key="m"
          @mouseover="hoverSquare"
          @click="attack(m, n)"
          v-bind:class="{
            // placed: enemyMap.boatMap[n - 1][m - 1],
            hit: playerMap.hitMap[n - 1][m - 1] == 'hit',
            missed: playerMap.hitMap[n - 1][m - 1] == 'missed'
          }"
        ></div>
      </div>
    </div>
  </v-row>
</template>

<script>
export default {
  name: "EnemyMap",
  data: function() {
    return {
      game: this.$game,
      enemyMap: this.$game.player.enemy.map,
      player: this.$game.player,
      playerMap: this.$game.player.map,
      enemy: this.$game.player.enemy
    };
  },
  methods: {
    hoverSquare: function() {},
    attack: function(x, y) {
      if (!this.player.map.hitMap[y - 1][x - 1] && this.player.turn) {
        this.player.attack(this.enemy, x, y);
        this.$game.nextRound();
      }
    }
  }
};
</script>

<style scoped lang="less">
@grid-size: 450px;

.canvas {
  margin: auto;
  width: @grid-size;
  height: @grid-size;
  border: 1px solid red;
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
    background: goldenrod;
  }

  &.hit {
    background: black;
  }
  &.missed {
    background: blue;
  }

  &:hover {
    background: violet;
    cursor: pointer;
  }
}
</style>
