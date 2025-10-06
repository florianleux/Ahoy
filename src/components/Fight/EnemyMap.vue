<template>
  <v-row
    id="map"
    v-if="enemyMap.boatMap[9]"
    :class="{ disabled: !player.turn }"
  >
    <v-col cols="12">
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
              hit: playerMap.hitMap[n - 1][m - 1] === 'hit',
              missed: playerMap.hitMap[n - 1][m - 1] === 'missed',
              placed: enemyMap.boatMap[n - 1][m - 1],
              destroyed: destroyedMap[n - 1][m - 1]
            }"
          >
            <img
              rel="preload"
              :src="publicPath + 'boats/' + enemy.className + '/destroyed.png'"
              v-if="isDestroyed(n, m)"
              class="coin destroyed"
            />
            <img
              rel="preload"
              :src="publicPath + 'boats/' + enemy.className + '/hit.png'"
              v-if="
                playerMap.hitMap[n - 1][m - 1] == 'hit' && !isDestroyed(n, m)
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
    </v-col>
    <!--    <v-btn @click="randomMap">-->
    <!--      RANDOM-->
    <!--    </v-btn>-->
  </v-row>
</template>

<script>
import _ from "lodash";
import { responsivePositionMixin } from "@/mixins/responsivePosition";

export default {
  name: "EnemyMap",
  mixins: [responsivePositionMixin],
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
      attackMessage: false,
      publicPath: process.env.BASE_URL,
      enemyClass: this.$game.enemyList[this.$game.level].className,
      baseCoords: { x: 370, y: 180, width: 500, height: 500 },
      canvasStyle: {},
      lineStyle: {}
    };
  },
  computed: {
    destroyedMap() {
      let dM = this.enemyMap._resetMap(),
        _this = this;

      dM.forEach((line, x) => {
        line.forEach((col, y) => {
          if (_this.enemyMap.boatMap[x][y]) {
            dM[x][y] =
              _this.enemy.fleet.boats[
                _this.enemyMap.boatMap[x][y] - 1
              ].destroyed;
          } else {
            dM[x][y] = false;
          }
        });
      });

      return dM;
    }
  },
  methods: {
    hoverSquare: function() {},
    nextRound(time) {
      let _this = this;

      setTimeout(function() {
        _this.player.enemy.mood = "default";
        _this.attackMessage = false;
        _this.player.mood = "default";

        _this.$game.nextRound();
      }, time);
    },
    attack: function(x, y) {
      if (this.player.attackLock) {
        return false;
      }

      if (
        !this.player.map.hitMap[y - 1][x - 1] &&
        !this.player.attackLock &&
        this.player.turn
      ) {
        this.player.attackLock = true;
        let attackResult = this.player.attack(this.enemy, x, y),
          _this = this;
        this.attackMessage = this.attackMessages[attackResult];

        this.enemy.setMoodAttacked(attackResult);
        this.player.setMoodAttacking(attackResult);

        let randPower;
        switch (this.enemyClass) {
          case "MamanBrigitte":
            if (attackResult === "DESTROYED") {
              let destroyedBoatId = this.enemyMap.boatMap[y - 1][x - 1];
              let destroyedBoat = _.find(this.enemy.fleet.boats, {
                id: destroyedBoatId
              });

              if (destroyedBoat.doomed) {
                let aliveBoats = _.filter(this.player.fleet.boats, [
                    "destroyed",
                    false
                  ]),
                  randomAliveBoat =
                    aliveBoats[Math.floor(Math.random() * aliveBoats.length)];

                setTimeout(function() {
                  randomAliveBoat.coords.forEach(function(coord) {
                    _this.enemy.map.hitMap[[coord[1]]].splice(
                      [coord[0]],
                      1,
                      "hit"
                    );
                  });

                  randomAliveBoat.destroyed = true;
                  randomAliveBoat.hp = 0;

                  _this.nextRound(1200);
                }, 500);
              }
            } else {
              this.nextRound(1200);
            }
            break;

          case "ChisanaKaizoku":
            randPower = Math.random();
            if (!this.enemyMap.hitMap[y - 1][x - 1] && randPower >= 0.5) {
              setTimeout(function() {
                _this.enemy.attack(_this.player, x, y, false);
                setTimeout(function() {
                  _this.nextRound(1200);
                }, 500);
              }, 1200);
            } else {
              _this.nextRound(1200);
            }
            break;

          case "Z":
            randPower = Math.random();
            if (attackResult === "DESTROYED" && randPower > 0) {
              let destroyedBoatId = this.enemyMap.boatMap[y - 1][x - 1];
              let destroyedBoat = _.find(this.enemy.fleet.boats, {
                id: destroyedBoatId
              });
              setTimeout(function() {
                // _this.enemyMap.removeBoat(destroyedBoat,_this.enemy.fleet);
                _this.enemy.healBoat(destroyedBoat, _this.player);
              }, 1500);

              this.nextRound(1200);
            } else {
              this.nextRound(1200);
            }
            break;

          default:
            this.nextRound(1200);
            break;
        }
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
  background: url("/placement/map.png") no-repeat center center;
  background-size: contain;

  &.disabled {
    &:hover * {
      cursor: not-allowed !important;
    }
  }

  .frame {
    background: url("/placement/frame.png") no-repeat center center;
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

.placed {
  background: red;
}

.hit.destroyed {
  background: black !important;
}

.hit {
  background: yellow !important;
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
