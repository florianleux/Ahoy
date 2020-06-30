<template>
  <v-row id="map" v-if="map.boatMap[9]">
    <div class="canvas" :class="{ disabled: !enemy.turn }">
      <div class="line" v-for="n in 10" :key="n">
        <div
          class="square"
          :data-y="n"
          :data-x="m"
          v-for="m in 10"
          :key="m"
          v-bind:class="{
            placed: map.boatMap[n - 1][m - 1],
            hit: enemyMap.hitMap[n - 1][m - 1] == 'hit',
            missed: enemyMap.hitMap[n - 1][m - 1] == 'missed'
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
      enemy: this.$game.player.enemy,
      map: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      target: null
    };
  }
};
</script>

<style scoped lang="less">
@grid-size: 280px;

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
    background: black;
  }
  &.missed {
    background: blue;
  }
}
</style>
