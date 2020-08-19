<template>
  <div class="player profile" :class="{ active: player.turn }">
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
    bottom: 10px;
    color: white;
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
    transition: width 0.4s;
    width: 255px;
    position: absolute;
    z-index: 9902;
    bottom: 81px;
    left: 0px;
  }
}
</style>
