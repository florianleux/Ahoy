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
              // placed: enemyMap.boatMap[n - 1][m - 1],
              destroyed: isDestroyed(n, m)
            }"
          ></div>
        </div>
      </div>
    </v-col>
    <!--    <v-btn @click="randomMap">-->
    <!--      RANDOM-->
    <!--    </v-btn>-->
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
        let attackResult = this.player.attack(this.enemy, x, y);
        this.attackMessage = this.attackMessages[attackResult];

        this.enemy.setMoodAttacked(attackResult);
        this.player.setMoodAttacking(attackResult);

        let _this = this;

        setTimeout(function() {
          _this.$game.nextRound();
          _this.player.enemy.mood = "default";
          _this.attackMessage = false;
          _this.player.mood = "default";
        }, 1200);
      }
    },
    isDestroyed(n, m) {
      if (this.enemyMap.boatMap[n - 1][m - 1]) {
        return this.enemy.fleet.boats[this.enemyMap.boatMap[n - 1][m - 1] - 1]
          .destroyed;
      } else {
        return false;
      }
    },
    randomMap() {
      this.enemyMap.boatMap = this.enemyMap._resetMap();
      this.enemyMap.generateRandomMap(this.enemy.fleet);
    }
  }
};
</script>

<style scoped lang="less">
@grid-size: 400px;

#map {
  position: relative;
  padding-top: 20px;
  float: right;
  transform: rotate(-5deg);
  margin-right: 10px;
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
