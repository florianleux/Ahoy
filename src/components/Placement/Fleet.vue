<template>
  <div id="fleet">
    <!--    <p>Votre flotte</p>-->

    <div id="boats" class="grid-row boats">
      <div v-if="game.help" class="tooltip" style="top: 10%">
        <span class="text">Cliquez sur un bateau pour le sélectionner</span>
      </div>

      <div
        v-for="(boat, index) in player.fleet.boats"
        :id="'boat' + boat.id"
        :key="index"
        class="boat"
        :class="{ selected: boat.selected, disabled: boat.disabled }"
        :style="getBoatStyle(boat.id)"
        @click="selectBoat(boat)"
      >
        <div
          v-if="boat.placed"
          class="remove-button"
          title="Supprimer le placement du bateau"
          @click="removeBoat(boat)"
        >
          X
        </div>
        <div class="name">Bateau n°{{ player.fleet.size - index }}</div>
      </div>
    </div>
    <div v-if="game.help" class="tooltip" style="bottom: 10%">
      <span class="text"
        >Vous pouvez modifier sa position en cliquant sur la croix à droite de
        son nom.</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import _ from "lodash";
import { currentPlayer, game } from "@/game";
import { audioManager } from "@/utils/AudioManager";
import { useResponsivePosition } from "@/composables/useResponsivePosition";
import type { BaseCoords, BoxStyle } from "@/composables/useResponsivePosition";
import type { Boat } from "@/classes/Boat";
import type { BoatId } from "@/classes/types";

const player = computed(currentPlayer);

// Where each boat sits in the rack, in reference-design coordinates.
const BOAT_IDS: BoatId[] = [1, 2, 3, 4, 5];

const BOAT_POSITIONS: Record<BoatId, BaseCoords> = {
  1: { x: 1309, y: 758, width: 286, height: 143 },
  2: { x: 1326, y: 613, width: 286, height: 143 },
  3: { x: 1343, y: 470, width: 284, height: 142 },
  4: { x: 1361, y: 328, width: 286, height: 142 },
  5: { x: 1382, y: 183, width: 286, height: 142 }
};

// A ref replaced wholesale rather than mutated in place, which is what the
// $forceUpdate here was standing in for: Vue 2 could not see new keys added to
// an object after the fact.
const boatStyles = ref<Partial<Record<BoatId, BoxStyle>>>({});

const { calculatePosition } = useResponsivePosition(() => {
  const styles: Partial<Record<BoatId, BoxStyle>> = {};
  BOAT_IDS.forEach(boatId => {
    styles[boatId] = calculatePosition(BOAT_POSITIONS[boatId]);
  });
  boatStyles.value = styles;
});

// Start with the first boat in hand.
currentPlayer().fleet.selectBoat(
  _.find(currentPlayer().fleet.boats, ["selected", false]) ?? null
);

function getBoatStyle(boatId: BoatId) {
  return boatStyles.value[boatId] ?? {};
}

function selectBoat(boat: Boat) {
  audioManager.playSound("click");
  if (!boat.placed) {
    currentPlayer().fleet.selectBoat(boat);
  }
}

function removeBoat(boat: Boat) {
  currentPlayer().map.removeBoat(boat, currentPlayer().fleet);
}
</script>

<style scoped lang="less">
.boats {
  margin: 0;
}

.boatImg {
  width: 100%;
}
.boat {
  color: #450000;
  transform: rotate(7deg);
  position: absolute;

  &#boat1 {
    background: url("/placement/boats/1.webp") no-repeat center center;
    background-size: contain;
  }
  &#boat2 {
    background: url("/placement/boats/2.webp") no-repeat center center;
    background-size: contain;
  }
  &#boat3 {
    background: url("/placement/boats/3.webp") no-repeat center center;
    background-size: contain;
  }
  &#boat4 {
    background: url("/placement/boats/4.webp") no-repeat center center;
    background-size: contain;
  }
  &#boat5 {
    background: url("/placement/boats/5.webp") no-repeat center center;
    background-size: contain;
  }

  .name {
    position: absolute;
    top: 10%;
    right: 0;
    font-size: 22px;
    left: 0;
    text-align: center;
    color: #370014;
  }

  .remove-button {
    z-index: 500;
    font-family: "Space Comics";
    color: #370014;
    position: absolute;
    top: 15%;
    font-size: 16px;
    right: 5%;
    &:hover {
      color: white;
      font-weight: bold;
    }
  }

  &.selected {
    .name {
      color: #ffffff;
      text-decoration: underline;
      -webkit-animation: glow 1s ease-in-out infinite alternate;
      -moz-animation: glow 1s ease-in-out infinite alternate;
      animation: glow 1s ease-in-out infinite alternate;
    }
  }
  &:hover {
    cursor: pointer;
    name {
      font-weight: bold;
    }
  }
  &:not(.selected):hover {
    .name,
    .size {
      color: black;
    }
  }

  &.disabled {
    color: grey;
    background: none !important;
  }
}

@-webkit-keyframes glow {
  from {
    text-shadow:
      0 0 10px #fff,
      0 0 20px #fff,
      0 0 30px #e60073,
      0 0 40px #e60073,
      0 0 50px #e60073,
      0 0 60px #e60073,
      0 0 70px #e60073;
  }
  to {
    text-shadow:
      0 0 20px #fff,
      0 0 30px #ff4da6,
      0 0 40px #ff4da6,
      0 0 50px #ff4da6,
      0 0 60px #ff4da6,
      0 0 70px #ff4da6,
      0 0 80px #ff4da6;
  }
}
</style>
