<template>
  <div v-if="player.map.boatMap[9]" id="map" class="grid-row">
    <div
      v-if="game.help"
      class="tooltip"
      style="transform: rotate(10deg); transition: auto; top: 90%; right: 15%"
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
      <div v-for="n in 10" :key="n" class="line" :style="lineStyle">
        <div
          v-for="m in 10"
          :key="m"
          class="square"
          :data-y="n"
          :data-x="m"
          :class="{
            placed: player.map.boatMap[n - 1][m - 1],
            hit: enemy.map.hitMap[n - 1][m - 1] == 'hit',
            missed: enemy.map.hitMap[n - 1][m - 1] == 'missed',
            destroyed: isDestroyed(n, m)
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { currentEnemy, currentPlayer, game } from "@/game";
import { useResponsivePosition } from "@/composables/useResponsivePosition";
import type { BoxStyle } from "@/composables/useResponsivePosition";

const player = computed(currentPlayer);
const enemy = computed(currentEnemy);

const BASE_COORDS = { x: 1065, y: 290, width: 340, height: 340 };

const canvasStyle = ref<Partial<BoxStyle>>({});
const lineStyle = ref<{ height?: string }>({});

const { calculatePosition, calculateLineHeight } = useResponsivePosition(() => {
  canvasStyle.value = calculatePosition(BASE_COORDS);
  lineStyle.value = { height: calculateLineHeight(BASE_COORDS.height) };
});

function isDestroyed(n: number, m: number): boolean {
  const boatId = currentPlayer().map.boatMap[n - 1][m - 1];
  return typeof boatId === "number"
    ? currentPlayer().fleet.boats[boatId - 1].destroyed
    : false;
}
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
  background: url("/placement/map.webp") no-repeat center center;
  background-size: contain;

  &.disabled {
    opacity: 0.5;
  }
}

.frame {
  background: url("/placement/frame.webp") no-repeat center center;
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
    background: url("/boats/player/ok.webp") no-repeat center center;
    background-size: contain;
  }

  &.hit {
    background: url("/boats/player/hit.webp") no-repeat center center;
    background-size: contain;

    &.destroyed {
      background: url("/boats/player/destroyed.webp") no-repeat center center;
      background-size: contain;
    }
  }

  &.missed {
    background: #007ce64d;
  }
}
</style>
