<template>
  <v-row
    id="map"
    v-if="playerMap.hoverMap[9]"
    @wheel.prevent="throttledRotateBoat"
    @click.right.prevent="throttledRotateBoat"
  >
    <div class="canvas">
      <div class="frame"></div>
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
        >
        </div>
      </div>
    </div>
  </v-row>
</template>

<script>
import _ from "lodash";
import $ from "jquery";

export default {
  name: "MapVue",
  data: function() {
    return {
      game: this.$game,
      playerFleet: this.$game.player.fleet,
      playerMap: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      enemyFleet: this.$game.player.enemy.fleet,
      target: null,
      publicPath: process.env.BASE_URL
    };
  },
  methods: {
    hoverSquare: function(event) {
      this.target = event.target;
      this.playerMap.hoverSquare(event.target, this.$game.player.fleet);
    },
    clickSquare: function(event) {
      this.playerMap.putBoat(event.target, this.$game.player.fleet);
      if (_.find(this.$game.player.fleet.boats, ["placed", false])) {
        this.$game.player.fleet.selectBoat(
          _.find(this.$game.player.fleet.boats, ["placed", false])
        );
      }
    },
    rotateBoat: function() {
      if (this.playerFleet.selectedBoat) {
        this.playerFleet.selectedBoat.horizontal = !this.playerFleet
          .selectedBoat.horizontal;
        this.playerMap.hoverSquare(this.target, this.$game.player.fleet);
      }
    },
    onResize() {
      var target = { x: 500, y: 215, width: 475, height: 475 };
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      // Get largest dimension increase
      var xScale = windowWidth / 1920;
      var yScale = windowHeight / 1080;
      var scale;
      var yOffset = 0;
      var xOffset = 0;

      if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - 1080 * scale) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - 1920 * scale) / 2;
      }

      $(".canvas").css("top", target.y * scale + yOffset);
      $(".canvas").css("left", target.x * scale + xOffset);
      $(".canvas").css("width", target.width * scale);
      $(".canvas").css("height", target.height * scale);
      $(".line").css("height", (target.height * scale) / 10);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.dispatchEvent(new Event("resize"));
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
@grid-size: 420px;

.canvas {
  transform: rotate(-6deg);
  position: absolute;
  background: url("/placement/map.png") no-repeat center center ;
  background-size:contain;
  /*border: 1px solid black;*/
  &:hover {
    cursor: pointer;
  }
  .frame{
    background: url("/placement/frame.png") no-repeat center center ;
    background-size:contain;
    position: absolute;
    display: block;
    pointer-events: none;
    top:-15px;
    bottom:-15px;
    left:-15px;
    right:-15px;
  }
}

.line {
  height: @grid-size / 10;
}

.square {
  float: left;
  width: 10%;
  /*border: 1px solid black;*/
  height: 100%;

  &.hovered {
    background: url("/boats/player/hover.png") no-repeat center center ;
    background-size:contain;
    &.koClick {
      background: url("/boats/player/ko.png") no-repeat center center ;
      background-size:contain;
    }
  }
  &.placed {
    background: url("/boats/player/ok.png") no-repeat center center ;
    background-size:contain;
  }
}
</style>
