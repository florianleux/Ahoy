<template>
  <div
    class="grid-row"
    id="map"
    v-if="player.map.hoverMap[9]"
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
            hovered: player.map.hoverMap[n - 1][m - 1],
            placed: player.map.boatMap[n - 1][m - 1],
            koClick: !player.map.okClick
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import _ from "lodash";
import { currentEnemy, currentPlayer, game } from "@/game";
import { useResponsivePosition } from "@/composables/useResponsivePosition";
import type { BoxStyle } from "@/composables/useResponsivePosition";

const player = computed(currentPlayer);

const BASE_COORDS = { x: 500, y: 215, width: 475, height: 475 };

const canvasStyle = ref<Partial<BoxStyle>>({});
const lineStyle = ref<{ height?: string }>({});
// The last square the pointer was over, so a rotation can redraw the preview
// where the boat already is.
let target: HTMLElement | null = null;

const { calculatePosition, calculateLineHeight } = useResponsivePosition(() => {
  canvasStyle.value = calculatePosition(BASE_COORDS);
  lineStyle.value = { height: calculateLineHeight(BASE_COORDS.height) };
});

// The enemy lays its fleet out once, when this board appears.
currentEnemy().map.generateRandomMap(currentEnemy().fleet);

function hoverSquare(event: MouseEvent) {
  target = event.target as HTMLElement;
  currentPlayer().map.hoverSquare(target, currentPlayer().fleet);
}

function clickSquare(event: MouseEvent) {
  const square = event.target as HTMLElement;
  currentPlayer().map.putBoat(square, currentPlayer().fleet);

  const nextUnplaced = _.find(currentPlayer().fleet.boats, ["placed", false]);
  if (nextUnplaced) {
    currentPlayer().fleet.selectBoat(nextUnplaced);
  }
  currentPlayer().map.hoverSquare(square, currentPlayer().fleet);
}

function rotateBoat() {
  const selected = currentPlayer().fleet.selectedBoat;
  if (selected) {
    selected.horizontal = !selected.horizontal;
    currentPlayer().map.hoverSquare(target, currentPlayer().fleet);
  }
}

function leaveMap() {
  currentPlayer().map.hoverMap = currentPlayer().map._resetHoverMap();
}

const throttledRotateBoat = _.throttle(rotateBoat, 200, {
  leading: true,
  trailing: false
});

onBeforeUnmount(() => throttledRotateBoat.cancel());
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
