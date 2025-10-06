<template>
  <div id="fleet">
    <!--    <p>Votre flotte</p>-->

    <v-row id="boats" class="boats">
      <div class="tooltip" v-if="game.help" style="top: 10%;">
        <span class="text">Cliquez sur un bateau pour le sélectionner</span>
      </div>

      <div
        v-for="(boat, index) in fleet.boats"
        :key="index"
        :id="'boat' + boat.id"
        class="boat"
        :class="{ selected: boat.selected, disabled: boat.disabled }"
        :style="getBoatStyle(boat.id)"
        @click="selectBoat(boat)"
      >
        <div
          class="remove-button"
          title="Supprimer le placement du bateau"
          v-if="boat.placed"
          @click="removeBoat(boat)"
        >
          X
        </div>
        <div class="name">Bateau n°{{ fleet.size - index }}</div>
      </div>
    </v-row>
    <div class="tooltip" v-if="game.help" style="bottom: 10%;">
      <span class="text"
        >Vous pouvez modifier sa position en cliquant sur la croix à droite de
        son nom.</span
      >
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { audioManager } from "@/utils/AudioManager";
import { responsivePositionMixin } from "@/mixins/responsivePosition";

export default {
  name: "Fleet",
  mixins: [responsivePositionMixin],
  data: function() {
    return {
      game: this.$game,
      fleet: this.$game.player.fleet,
      publicPath: process.env.BASE_URL,
      boatPositions: {
        1: { x: 1317, y: 758, width: 286, height: 143 },
        2: { x: 1334, y: 613, width: 286, height: 143 },
        3: { x: 1351, y: 470, width: 284, height: 142 },
        4: { x: 1369, y: 328, width: 286, height: 142 },
        5: { x: 1390, y: 183, width: 286, height: 142 }
      },
      boatStyles: {}
    };
  },
  methods: {
    selectBoat: function(boat) {
      audioManager.playSound("click");
      if (!boat.placed) {
        this.$game.player.fleet.selectBoat(boat);
      }
    },
    removeBoat: function(boat) {
      this.$game.player.map.removeBoat(boat, this.$game.player.fleet);
    },
    getBoatStyle(boatId) {
      return this.boatStyles[boatId] || {};
    },
    handleResize() {
      // Calculate styles for each boat
      Object.keys(this.boatPositions).forEach(boatId => {
        this.boatStyles[boatId] = this.calculatePosition(
          this.boatPositions[boatId]
        );
      });
      this.$forceUpdate(); // Force re-render with new styles
    }
  },
  mounted() {
    this.setupResponsive();
    window.dispatchEvent(new Event("resize"));
  },
  beforeCreate: function() {
    this.$game.player.fleet.selectBoat(
      _.find(this.$game.player.fleet.boats, ["selected", false])
    );
  }
};
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
    background: url("/placement/boats/1.png") no-repeat center center;
    background-size: contain;
  }
  &#boat2 {
    background: url("/placement/boats/2.png") no-repeat center center;
    background-size: contain;
  }
  &#boat3 {
    background: url("/placement/boats/3.png") no-repeat center center;
    background-size: contain;
  }
  &#boat4 {
    background: url("/placement/boats/4.png") no-repeat center center;
    background-size: contain;
  }
  &#boat5 {
    background: url("/placement/boats/5.png") no-repeat center center;
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
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073,
      0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
  }
  to {
    text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6,
      0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
  }
}
</style>
