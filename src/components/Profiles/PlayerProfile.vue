<template>
  <div class="player profile" :class="{ active: player.turn }">
    <div class="power">
      <div class="logo"></div>
    </div>
    <div class="health">
      {{ player.health }}
    </div>
    <img
      rel="preload"
      :src="
        publicPath + 'players/' + player.identity + '/' + player.mood + '.png'
      "
      alt=""
      :class="player.identity"
      class="picture"
    />
    <div class="infos">
      <img
        rel="preload"
        :src="publicPath + 'players/plank.png'"
        class="plank"
      />
      <div class="name">{{ player.name }}</div>
      <div class="phrase">"{{ player.phrase }}"</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePlayer",
  data: function() {
    return {
      game: this.$game,
      player: this.$game.player,
      publicPath: process.env.BASE_URL
    };
  }
};
</script>

<style scoped lang="less">
.infos {
  border-radius: 0 5px 0 0;
  position: relative;
  z-index: 9990;
  height: 77px;
  padding: 10px 30px 10px 30px;
  width: 330px;

  .plank {
    position: absolute;
    top: -10px;
    left: -5px;
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
    bottom: 13px;
    color: white;
    font-size: 21px;
  }
}

.profile {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9901;

  &.active {
    .picture {
      width: 330px;
    }
  }

  .picture {
    filter: drop-shadow(0px 0px 22px rgba(255,255,255, 0.6));
    transition: width 0.4s;
    width: 255px;
    position: absolute;
    z-index: 9902;
    bottom: 81px;
    left: 0px;
  }
}

.health {
  position: absolute;
  right: -17px;
  font-size: 14px;
  font-family: Space Comics;
  z-index: 10000;
  top: 50%;
  text-align: center;
  color: white;
  margin-top: -38px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: url("/boats/player/ok.png") no-repeat center center;
  background-size: contain;
}
</style>
