<template>
  <div class="enemy profile" :class="{ active: enemy.turn }">
    <div class="power">
      <span v-if="enemy.mainPower.active">Pouvoir activé !</span>
    </div>
    <div class="health">
      <img
        rel="preload"
        :src="publicPath + 'boats/' + enemy.className + '/ok.png'"
        alt=""
        class="coin"
      />
      <span class="value">{{ enemy.health }}</span>
    </div>
    <img
      rel="preload"
      :src="
        publicPath + 'players/' + enemy.className + '/' + enemy.mood + '.png'
      "
      alt=""
      class="picture"
      :class="enemy.className"
    />
    <div class="infos">
      <img
        rel="preload"
        :src="publicPath + 'players/plank.png'"
        class="plank"
      />
      <div class="name">{{ enemy.name }}</div>
      <div class="phrase">"{{ enemy.phrase }}"</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnemyProfile",
  data: function() {
    return {
      game: this.$game,
      enemy: this.$game.player.enemy,
      publicPath: process.env.BASE_URL
    };
  }
};
</script>

<style scoped lang="less">
.power-logo {
  filter: grayscale(65%);
  opacity: 0.9;
  position: absolute;
  left: 35px;
  top: 50%;
  width: 65px;
  margin-top: -29px;

  &.active {
    opacity: 1;
    filter: none;
  }
}
.power {
  span {
    position: relative;
    z-index: 10000;
    color: white;
    font-size: 8px;
    top: 2px;
    /*text-shadow: 0 0 5px #FFF, 0 0 20px #ff0099, 0 0 30px #ff0099;*/
    text-align: center;
    text-transform: uppercase;
    font-family: "Space Comics";
  }
  position: absolute;
  left: -151px;
  margin-top: -20px;
  top: 50%;
}
.health {
  position: absolute;
  left: -17px;

  z-index: 10000;
  top: 50%;
  color: white;
  margin-top: -36px;
  width: 60px;
  height: 60px;
  .coin {
    width: 100%;
    z-index: 9999;
  }
  .value {
    font-size: 14px;
    font-family: Space Comics;
    position: absolute;
    left: 0;
    top: 18px;
    right: 0;
    text-align: center;
  }
}

.infos {
  border-radius: 0 5px 0 0;
  position: relative;
  z-index: 9990;
  height: 77px;
  padding: 10px 25px 10px 25px;
  width: 330px;

  .plank {
    position: absolute;
    top: -10px;
    right: -5px;
  }

  .name {
    font-weight: bold;
    -webkit-text-fill-color: #612d0c;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: white;
    font-size: 16px;
    position: relative;
    z-index: 9991;
    font-family: "Space Comics";
    text-transform: uppercase;
  }
  .phrase {
    z-index: 9991;
    position: absolute;
    bottom: 10px;
    color: white;
    text-align: right;
    right: 15px;
  }
}

.profile {
  position: fixed;
  bottom: 0;
  text-align: right;
  right: 0;
  z-index: 9901;

  &.active {
    .picture {
      width: 390px;
    }
  }

  .picture {
    width: 310px;
    transition: width 0.4s;
    position: absolute;
    z-index: 9902;
    bottom: 81px;
    right: 0px;
  }
}
</style>
