<template>
  <v-row
    id="map"
    v-if="playerMap.hoverMap[9]"
    @wheel.prevent="throttledRotateBoat"
    @click.right.prevent="throttledRotateBoat"
  >
    <div
      class="tooltip"
      v-if="game.help"
      style="right: 50%;bottom: 50%;margin-bottom: 25px;"
    >
      <span class="text"
        >Cliquez sur la carte pour placer le bateau sélectionné.</span
      >
    </div>

    <div
      class="tooltip"
      style="
    bottom: 10%;
    left: 20%;
"
      v-if="game.help"
    >
      <span class="text"
        >Une fois votre flotte placée, cliquez sur le bouton pour démarrer le
        combat !</span
      >
    </div>

    <div class="canvas" :style="canvasStyle">
      <div class="frame"></div>
      <div class="line" v-for="n in 10" :key="n" :style="lineStyle">
        <div
          class="square"
          :data-y="n"
          :data-x="m"
          v-for="m in 10"
          :key="m"
          @mouseover="hoverSquare"
          @mouseleave="leaveMap"
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
import { responsivePositionMixin } from "@/mixins/responsivePosition";

export default {
  name: "MapVue",
  mixins: [responsivePositionMixin],
  data: function() {
    return {
      game: this.$game,
      playerFleet: this.$game.player.fleet,
      playerMap: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      enemyFleet: this.$game.player.enemy.fleet,
      target: null,
      publicPath: process.env.BASE_URL,
      baseCoords: { x: 500, y: 215, width: 475, height: 475 },
      canvasStyle: {},
      lineStyle: {}
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
      this.playerMap.hoverSquare(event.target, this.$game.player.fleet);
    },
    rotateBoat: function() {
      if (this.playerFleet.selectedBoat) {
        this.playerFleet.selectedBoat.horizontal = !this.playerFleet
          .selectedBoat.horizontal;
        this.playerMap.hoverSquare(this.target, this.$game.player.fleet);
      }
    },
    leaveMap() {
      this.playerMap.hoverMap = this.playerMap._resetMap();
    },
    handleResize() {
      this.canvasStyle = this.calculatePosition(this.baseCoords);
      this.lineStyle = {
        height: this.calculateLineHeight(this.baseCoords.height)
      };
    }
  },
  mounted() {
    this.setupResponsive();
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
  background: url("/placement/map.webp") no-repeat center center;
  background-size: contain;
  /*border: 1px solid black;*/
  &:hover {
    cursor: pointer;
  }
  .frame {
    background: url("/placement/frame.webp") no-repeat center center;
    background-size: contain;
    position: absolute;
    display: block;
    pointer-events: none;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
  }
}

#mapHelp {
  right: 50%;
  top: 50%;
  span {
    text-align: center;
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
    background: url("/boats/player/hover.webp") no-repeat center center;
    background-size: contain;
    &.koClick {
      background: url("/boats/player/ko.webp") no-repeat center center;
      background-size: contain;
    }
  }
  &.placed {
    background: url("/boats/player/ok.webp") no-repeat center center;
    background-size: contain;
  }
}
</style>
