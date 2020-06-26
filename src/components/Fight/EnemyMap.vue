<template>
  <v-row id="map" v-if="map.boatMap[9]">
    <div class="canvas">
      <div class="line" v-for="n in 10" :key="n">
        <div
          class="square"
          :data-y="n"
          :data-x="m"
          v-for="m in 10"
          :key="m"
          @mouseover="hoverSquare"
          @click="clickSquare"
          v-bind:class="{
            placed: map.boatMap[n - 1][m - 1]
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
      map: this.$game.player.enemy.map
    };
  },
  methods: {
    hoverSquare: function() {},
    clickSquare: function() {
      console.log("hover square");
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

  &:hover {
    background: violet;
    cursor: pointer;
  }
}
</style>
