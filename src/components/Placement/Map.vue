<template>
  <v-row id="map" v-if="map.hoverMap[9]" @wheel.prevent="throttledRotateBoat">
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
            hovered: map.hoverMap[n - 1][m - 1],
            placed: map.boatMap[n - 1][m - 1],
            koClick: !map.okClick
          }"
        ></div>
      </div>
    </div>
  </v-row>
</template>

<script>
import _ from "lodash";

export default {
  name: "MapVue",
  data: function() {
    return {
      game: this.$game,
      fleet: this.$game.player.fleet,
      map: this.$game.player.map,
      target: null
    };
  },
  methods: {
    hoverSquare: function(event) {
      this.target = event.target;
      this.map.hoverSquare(event.target, this.$game.player.fleet);
    },
    clickSquare: function(event) {
      this.map.putBoat(event.target, this.$game.player.fleet);
    },
    rotateBoat: function() {
      if (this.fleet.selectedBoat) {
        this.fleet.selectedBoat.horizontal = !this.fleet.selectedBoat
          .horizontal;
        this.map.hoverSquare(this.target, this.$game.player.fleet);
      }
    }
  },
  created() {
    this.throttledRotateBoat = _.throttle(this.rotateBoat, 200, {
      leading: true,
      trailing: false
    });
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
    background: lightgreen;
    &.koClick {
      background: orangered;
    }
  }
  &.placed {
    background: green;
  }
}
</style>
