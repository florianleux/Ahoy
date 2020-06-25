<template>
  <v-row id="map" v-if="map.hoverMap[9]">
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
          v-bind:class="{ hovered: map.hoverMap[n - 1][m - 1], placed : map.boatMap[n - 1][m - 1]}"
        >
        </div>
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
      player: this.$game.player,
      map: this.$game.player.map
    };
  },
  methods: {
    hoverSquare: function(event) {
      this.map.hoverSquare(event.target, this.$game.player.fleet.selectedBoat);
    },
    clickSquare: function(event) {
      this.map.placeBoat(event.target, this.$game.player.fleet.selectedBoat);
    }
  }
};
</script>

<style scoped lang="less">
@grid-size: 500px;

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

  &.hovered {
    background: mediumvioletred;
  }
  &.placed{
    background: green;
  }
}
</style>
