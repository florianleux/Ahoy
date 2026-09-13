<template>
  <div
    class="grid-row"
    id="map"
    v-if="game.player.enemy.map.boatMap[9]"
    :class="{ disabled: !game.player.turn }"
  >
    <div class="grid-col grid-col-12">
      <div
        class="enemy canvas"
        :class="{ disabled: game.player.attackLock }"
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
        <div class="line" v-for="n in 10" :key="n" :style="lineStyle">
          <div
            class="square"
            :data-y="n"
            :data-x="m"
            v-for="m in 10"
            :key="m"
            @mouseover="hoverSquare"
            @click="attack(m, n)"
            v-bind:class="{
              hit: game.player.map.hitMap[n - 1][m - 1] === 'hit',
              missed: game.player.map.hitMap[n - 1][m - 1] === 'missed',
              placed: game.player.enemy.map.boatMap[n - 1][m - 1],
              destroyed: destroyedMap[n - 1][m - 1]
            }"
          >
            <img
              rel="preload"
              :src="assetUrl('boats/' + game.player.enemy.className + '/destroyed.webp')"
              v-if="isDestroyed(n, m)"
              class="coin destroyed"
            />
            <img
              rel="preload"
              :src="assetUrl('boats/' + game.player.enemy.className + '/hit.webp')"
              v-if="
                game.player.map.hitMap[n - 1][m - 1] == 'hit' &&
                  !isDestroyed(n, m)
              "
              class="coin hit "
            />
          </div>
        </div>
      </div>
      <div
        class="tooltip"
        v-if="game.help"
        style="top: 90%;left: 19%;transform: rotate(-6deg);"
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

<script setup>
import { computed, ref } from "vue";
import _ from "lodash";
import { assetUrl } from "@/utils/assets";
import { game } from "@/game";
import { useResponsivePosition } from "@/composables/useResponsivePosition";

const BASE_COORDS = { x: 370, y: 180, width: 500, height: 500 };

const ATTACK_MESSAGES = {
  HIT: "Touché !",
  DESTROYED: " Touché ! Coulé !",
  MISSED: "A l'eau !"
};

const canvasStyle = ref({});
const lineStyle = ref({});
const attackMessage = ref(false);

const { calculatePosition, calculateLineHeight } = useResponsivePosition(() => {
  canvasStyle.value = calculatePosition(BASE_COORDS);
  lineStyle.value = { height: calculateLineHeight(BASE_COORDS.height) };
});

const destroyedMap = computed(() => {
  const enemyMap = game.player.enemy.map;
  return enemyMap.boatMap.map(line =>
    line.map(boatId =>
      boatId ? game.player.enemy.fleet.boats[boatId - 1].destroyed : false
    )
  );
});

function isDestroyed(n, m) {
  const boatId = game.player.enemy.map.boatMap[n - 1][m - 1];
  return boatId ? game.player.enemy.fleet.boats[boatId - 1].destroyed : false;
}

function hoverSquare() {}

function nextRound(time) {
  setTimeout(() => {
    game.player.enemy.mood = "default";
    attackMessage.value = false;
    game.player.mood = "default";
    game.nextRound();
  }, time);
}

function attack(x, y) {
  const player = game.player;
  const enemy = player.enemy;

  if (player.attackLock) {
    return false;
  }

  if (player.map.hitMap[y - 1][x - 1] || !player.turn) {
    return false;
  }

  player.attackLock = true;
  const attackResult = player.attack(enemy, x, y);
  attackMessage.value = ATTACK_MESSAGES[attackResult];

  enemy.setMoodAttacked(attackResult);
  player.setMoodAttacking(attackResult);

  // Powers that react to the player's shot rather than to the enemy's turn.
  // Dispatched on className, never constructor.name, which minification eats.
  switch (enemy.className) {
    case "MamanBrigitte": {
      if (attackResult !== "DESTROYED") {
        nextRound(1200);
        break;
      }
      const destroyedBoatId = enemy.map.boatMap[y - 1][x - 1];
      const destroyedBoat = _.find(enemy.fleet.boats, { id: destroyedBoatId });

      if (destroyedBoat.doomed) {
        const aliveBoats = _.filter(player.fleet.boats, ["destroyed", false]);
        const randomAliveBoat =
          aliveBoats[Math.floor(Math.random() * aliveBoats.length)];

        setTimeout(() => {
          randomAliveBoat.coords.forEach(coord => {
            enemy.map.hitMap[coord[1]][coord[0]] = "hit";
          });
          randomAliveBoat.destroyed = true;
          randomAliveBoat.hp = 0;
          nextRound(1200);
        }, 500);
      }
      break;
    }

    case "ChisanaKaizoku": {
      const randPower = Math.random();
      if (!enemy.map.hitMap[y - 1][x - 1] && randPower >= 0.5) {
        setTimeout(() => {
          enemy.attack(player, x, y, false);
          setTimeout(() => nextRound(1200), 500);
        }, 1200);
      } else {
        nextRound(1200);
      }
      break;
    }

    case "Z": {
      const randPower = Math.random();
      if (attackResult === "DESTROYED" && randPower > 0) {
        const destroyedBoatId = enemy.map.boatMap[y - 1][x - 1];
        const destroyedBoat = _.find(enemy.fleet.boats, { id: destroyedBoatId });
        setTimeout(() => enemy.healBoat(destroyedBoat, player), 1500);
      }
      nextRound(1200);
      break;
    }

    default:
      nextRound(1200);
      break;
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
