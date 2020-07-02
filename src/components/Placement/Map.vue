<template>
  <v-row
    id="map"
    v-if="playerMap.hoverMap[9]"
    @wheel.prevent="throttledRotateBoat"
    @click.right.prevent="throttledRotateBoat"
  >
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
            hovered: playerMap.hoverMap[n - 1][m - 1],
            placed: playerMap.boatMap[n - 1][m - 1],
            koClick: !playerMap.okClick
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
      playerFleet: this.$game.player.fleet,
      playerMap: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      enemyFleet: this.$game.player.enemy.fleet,
      target: null
    };
  },
  methods: {
    hoverSquare: function(event) {
      this.target = event.target;
      this.playerMap.hoverSquare(event.target, this.$game.player.fleet);
    },
    clickSquare: function(event) {
      this.playerMap.putBoat(event.target, this.$game.player.fleet);
    },
    rotateBoat: function() {
      if (this.playerFleet.selectedBoat) {
        this.playerFleet.selectedBoat.horizontal = !this.playerFleet
          .selectedBoat.horizontal;
        this.playerMap.hoverSquare(this.target, this.$game.player.fleet);
      }
    }
  },
  created() {
    this.throttledRotateBoat = _.throttle(this.rotateBoat, 200, {
      leading: true,
      trailing: false
    });

    this.enemyMap.generateRandomMap(this.enemyFleet);
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
