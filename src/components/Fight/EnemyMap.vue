<template>
  <v-row id="map" v-if="enemyMap.boatMap[9]">
    <v-col cols="12">
      <div class="enemy canvas" :class="{ disabled: !player.turn }">
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
import { MamanBrigitte } from "../../classes/enemies/MamanBrigitte/MamanBrigitte";
import { ChisanaKaizoku } from "../../classes/enemies/ChisanaKaizoku/ChisanaKaizoku";
import _ from "lodash";
import $ from "jquery";

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
      attackMessage: false,
      enemyClass: this.$game.enemyList[this.$game.level]
    };
  },
  methods: {
    hoverSquare: function() {},
    nextRound(time) {
      let _this = this;
      this.$game.nextRound();
      setTimeout(function() {
        _this.player.enemy.mood = "default";
        _this.attackMessage = false;
        _this.player.mood = "default";
      }, time);
    },
    attack: function(x, y) {
      if (!this.player.map.hitMap[y - 1][x - 1] && this.player.turn) {
        let attackResult = this.player.attack(this.enemy, x, y),
          _this = this;
        this.attackMessage = this.attackMessages[attackResult];

        this.enemy.setMoodAttacked(attackResult);
        this.player.setMoodAttacking(attackResult);

        switch (this.enemyClass) {
          case MamanBrigitte:
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
            }
            break;

          case ChisanaKaizoku:
            var randPower = Math.random();
            if (!this.enemyMap.hitMap[y - 1][x - 1] && randPower >= 0.5) {
              setTimeout(function() {
                _this.enemy.attack(_this.player, x, y, false);
                setTimeout(function() {
                  _this.nextRound(1200);
                }, 500);
              }, 800);
            } else {
              _this.nextRound(1200);
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
    onResize() {
      var target = { x: 370, y: 180, width: 500, height: 500 };
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      // Get largest dimension increase
      var xScale = windowWidth / 1920;
      var yScale = windowHeight / 1080;
      var scale;
      var yOffset = 0;
      var xOffset = 0;

      if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - 1080 * scale) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - 1920 * scale) / 2;
      }

      $(".enemy.canvas").css("top", target.y * scale + yOffset);
      $(".enemy.canvas").css("left", target.x * scale + xOffset);
      $(".enemy.canvas").css("width", target.width * scale);
      $(".enemy.canvas").css("height", target.height * scale);

      $(".enemy.canvas .line").css("height", (target.height * scale) / 10);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.dispatchEvent(new Event("resize"));
  }
};
</script>

<style scoped lang="less">
@grid-size: 400px;

.canvas {
  transform: rotate(-6deg);
  position: absolute;
  background: url("/placement/map.png") no-repeat center center;
  background-size: contain;

  &.disabled {
    opacity: 0.5;
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

  &.hit {
    background: #ff180073;

    &.destroyed {
      background: black;
    }
  }

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
