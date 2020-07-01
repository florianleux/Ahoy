<template>
  <v-row id="map" v-if="enemyMap.boatMap[9]">
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
    <v-col cols="12">
      <div class="canvas" :class="{ disabled: !player.turn }">
        <div class="line" v-for="n in 10" :key="n">
          <div
            class="square"
            :data-y="n"
            :data-x="m"
            v-for="m in 10"
            :key="m"
            @mouseover="hoverSquare"
            @click="attack(m, n)"
            v-bind:class="{
              hit: playerMap.hitMap[n - 1][m - 1] == 'hit',
              missed: playerMap.hitMap[n - 1][m - 1] == 'missed',
              destroyed: isDestroyed(n, m)
            }"
          ></div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "EnemyMap",
  data: function() {
    return {
      game: this.$game,
      enemyMap: this.$game.player.enemy.map,
      player: this.$game.player,
      playerMap: this.$game.player.map,
      enemy: this.$game.player.enemy,
      attackMessages: {
        HIT: "Touché !",
        DESTROYED: " Touché ! Coulé !",
        MISSED: "A l'eau !"
      },
      attackMessage: false
    };
  },
  methods: {
    hoverSquare: function() {},
    attack: function(x, y) {
      if (!this.player.map.hitMap[y - 1][x - 1] && this.player.turn) {
        this.attackMessage = this.attackMessages[
          this.player.attack(this.enemy, x, y)
        ];

        let _this = this;
        _this.$game.nextRound();
        setTimeout(function() {
          _this.attackMessage = false;
        }, 1500);
      }
    },
    isDestroyed(n, m) {
      if (this.enemyMap.boatMap[n - 1][m - 1]) {
        return this.enemy.fleet.boats[this.enemyMap.boatMap[n - 1][m - 1] - 1]
          .destroyed;
      } else {
        return false;
      }
    }
  },
  created() {
    console.log(this.enemy.fleet.boats);
  }
};
</script>

<style scoped lang="less">
@grid-size: 450px;

#map {
  position: relative;
  padding-top: 20px;
  float: right;
}

.canvas {
  margin: auto;
  width: @grid-size;
  height: @grid-size;
  border: 1px solid red;

  &.disabled {
    opacity: 0.5;
    &:hover * {
      cursor: not-allowed !important;
    }
  }
}

.line {
  height: @grid-size / 10;
}

.attack-result {
  position: absolute;
  top: 0px;
  width: 100px;
  right: 50%;
  text-align: center;
  margin-right: -50px;
}
.square {
  float: left;
  width: 10%;
  border: 1px solid red;
  height: 100%;

  &.placed {
    background: goldenrod;
  }

  &.hit {
    background: orangered;

    &.destroyed {
      background: black;
    }
  }

  &.missed {
    background: blue;
  }

  &:hover {
    background: violet;
    cursor: pointer;
  }
}
</style>
