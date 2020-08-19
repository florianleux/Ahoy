<template>
  <div class="enemy profile" :class="{ active: enemy.turn }">
    <div class="health">
      {{enemy.health}}
    </div>
    <img
      rel="preload"
      :src="
        publicPath +
          'players/' +
          enemy.name.replace(/\s+/g, '') +
          '/' +
          enemy.mood +
          '.png'
      "
      alt=""
      class="picture"
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
  .health{
    position: absolute;
    left: -17px;
    font-size: 14px;
    font-family: Space Comics;
    z-index: 10000;
    top: 50%;
    text-align: center;
    color: white;
    margin-top: -36px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    background: url("/boats/player/ok.png") no-repeat center center;
    background-size: contain;
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
