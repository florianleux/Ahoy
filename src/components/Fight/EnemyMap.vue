<template>
  <div
    v-if="enemy.map.boatMap[9]"
    id="map"
    class="grid-row"
    :class="{ disabled: !player.turn }"
  >
    <div class="grid-col grid-col-12">
      <div
        class="enemy canvas"
        :class="{ disabled: player.attackLock }"
        :style="canvasStyle"
      >
        <div class="attack-result">
          <transition
            name="enterMessage"
            enter-to-class="animate__animated animate__tada"
            leave-to-class="animate__animated animate__fadeOut"
          >
            <div v-if="attackMessage">{{ attackMessage }}</div>
          </transition>
          <div v-if="!attackMessage">&nbsp;</div>
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
              hit: player.map.hitMap[n - 1][m - 1] === 'hit',
              missed: player.map.hitMap[n - 1][m - 1] === 'missed',
              placed: enemy.map.boatMap[n - 1][m - 1],
              destroyed: destroyedMap[n - 1][m - 1]
            }"
            @mouseover="hoverSquare"
            @click="attack(m, n)"
          >
            <img
              v-if="isDestroyed(n, m)"
              rel="preload"
              :src="assetUrl('boats/' + enemy.className + '/destroyed.webp')"
              class="coin destroyed"
            />
            <img
              v-if="
                player.map.hitMap[n - 1][m - 1] == 'hit' && !isDestroyed(n, m)
              "
              rel="preload"
              :src="assetUrl('boats/' + enemy.className + '/hit.webp')"
              class="coin hit"
            />
          </div>
        </div>
      </div>
      <div
        v-if="game.help"
        class="tooltip"
        style="top: 90%; left: 19%; transform: rotate(-6deg)"
      >
        <span class="text"
          >Durant votre tour, cliquez dans une case de la carte pour attaquer
          votre adversaire.</span
        >
      </div>
    </div>
    <!--    <v-btn @click="randomMap">-->
    <!--      RANDOM-->
    <!--    </v-btn>-->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { assetUrl } from "@/utils/assets";
import { currentEnemy, currentPlayer, game } from "@/game";
import { useResponsivePosition } from "@/composables/useResponsivePosition";
import type { BoxStyle } from "@/composables/useResponsivePosition";
import type { AttackResult } from "@/classes/types";

const player = computed(currentPlayer);
const enemy = computed(currentEnemy);

const BASE_COORDS = { x: 370, y: 180, width: 500, height: 500 };

const ATTACK_MESSAGES: Record<AttackResult, string> = {
  HIT: "Touché !",
  DESTROYED: " Touché ! Coulé !",
  ENDGAME: " Touché ! Coulé !",
  MISSED: "A l'eau !"
};

const canvasStyle = ref<Partial<BoxStyle>>({});
const lineStyle = ref<{ height?: string }>({});
const attackMessage = ref<string | false>(false);

const { calculatePosition, calculateLineHeight } = useResponsivePosition(() => {
  canvasStyle.value = calculatePosition(BASE_COORDS);
  lineStyle.value = { height: calculateLineHeight(BASE_COORDS.height) };
});

const destroyedMap = computed(() =>
  currentEnemy().map.boatMap.map(line =>
    line.map(boatId =>
      typeof boatId === "number"
        ? currentEnemy().fleet.boats[boatId - 1].destroyed
        : false
    )
  )
);

function isDestroyed(n: number, m: number): boolean {
  const boatId = currentEnemy().map.boatMap[n - 1][m - 1];
  return typeof boatId === "number"
    ? currentEnemy().fleet.boats[boatId - 1].destroyed
    : false;
}

function hoverSquare(): void {}

// Game hands the turn to the enemy at the end of the beat it schedules, which
// is the moment the result stops being on screen. Watching the turn keeps the
// 1200 ms in Game alone instead of copying it here.
watch(
  () => player.value.turn,
  turn => {
    if (!turn) {
      attackMessage.value = false;
    }
  }
);

function attack(x: number, y: number): void {
  const attackResult = game.playerAttack(x, y);

  if (attackResult) {
    attackMessage.value = ATTACK_MESSAGES[attackResult];
  }
}
</script>

<style scoped lang="less">
@grid-size: 400px;
#map.disabled .canvas {
  opacity: 0.5;
  &:hover * {
    cursor: not-allowed !important;
  }
}
.canvas {
  transform: rotate(-6deg);
  position: absolute;
  background: url("/placement/map.webp") no-repeat center center;
  background-size: contain;

  &.disabled {
    &:hover * {
      cursor: not-allowed !important;
    }
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

.coin {
  width: 100%;
}

.line {
  height: @grid-size / 10;
}

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
.square {
  float: left;
  width: 10%;
  height: 100%;

  &.missed {
    background: #007ce64d;
  }

  &:hover {
    background: violet;
    cursor: pointer;
  }
}

@media (max-width: 1300px) {
  #map {
    margin-top: 50px;
    margin-left: -400px;
  }

  .canvas {
    width: @grid-size*0.75;
    height: @grid-size*0.75;
  }

  .line {
    height: @grid-size*0.75 / 10;
  }
}

@media (max-width: 1500px) and (min-width: 1300px) {
  #map {
    margin-top: 35px;
    margin-left: -430px;
  }

  .canvas {
    width: @grid-size*0.85;
    height: @grid-size*0.85;
  }

  .line {
    height: @grid-size*0.85 / 10;
  }
}
</style>
