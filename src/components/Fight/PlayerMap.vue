<template>
  <v-row id="map" v-if="playerMap.boatMap[9]">
    <div
      class="tooltip"
      v-if="game.help"
      style="transform: rotate(10deg);
    transition: auto;
    top: 90%;
    right: 15%;"
    >
      <span class="text"
        >Sur la carte de droite, vous voyez les cases sur lesquelles votre
        adversaire vous a attaqué.</span
      >
    </div>
    <div
      class="player canvas"
      :class="{ disabled: !enemy.turn }"
      :style="canvasStyle"
    >
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
      <div class="frame"></div>
      <div class="line" v-for="n in 10" :key="n" :style="lineStyle">
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
import { responsivePositionMixin } from "@/mixins/responsivePosition";

export default {
  name: "MapVue",
  mixins: [responsivePositionMixin],
  data: function() {
    return {
      game: this.$game,
      fleet: this.$game.player.fleet,
      player: this.$game.player,
      enemy: this.$game.player.enemy,
      playerMap: this.$game.player.map,
      enemyMap: this.$game.player.enemy.map,
      target: null,
      baseCoords: { x: 1065, y: 290, width: 340, height: 340 },
      canvasStyle: {},
      lineStyle: {}
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
  }
};
</script>

<style scoped lang="less">
@grid-size: 230px;

.attack-result {
  position: absolute;
  bottom: -70px;
  width: 100px;
  right: 50%;

  text-align: center;
  margin-right: -50px;
  * {
    font-size: 27px;
  }
}

.canvas {
  transform: rotate(10deg);
  position: absolute;
  position: absolute;
  background: url("/placement/map.png") no-repeat center center;
  background-size: contain;

  &.disabled {
    opacity: 0.5;
  }
}

.frame {
  background: url("/placement/frame.png") no-repeat center center;
  background-size: contain;
  position: absolute;
  display: block;
  pointer-events: none;
  top: -10px;
  bottom: -10px;
  left: -10px;
  right: -9px;
}

.line {
  height: @grid-size / 10;
}

.square {
  float: left;
  width: 10%;
  height: 100%;

  &.placed {
    background: url("/boats/player/ok.png") no-repeat center center;
    background-size: contain;
  }

  &.hit {
    background: url("/boats/player/hit.png") no-repeat center center;
    background-size: contain;

    &.destroyed {
      background: url("/boats/player/destroyed.png") no-repeat center center;
      background-size: contain;
    }
  }

  &.missed {
    background: #007ce64d;
  }
}
</style>
