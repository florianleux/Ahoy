<template>
  <div class="player profile" :class="{ active: player.turn }">
    <img
      width="320"
      :src="
        publicPath + 'players/' + player.identity + '/' + player.mood + '.png'
      "
      alt=""
      :class="player.identity"
      class="picture"
    />
    <div class="infos">
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

  padding: 10px 30px 10px 30px;
  width: 330px;
  background: #54cde9;

  .name {
    font-weight: bold;
    font-size: 16px;
    font-family: "Space Comics";
    text-transform: uppercase;
  }
}

.profile {
  position: fixed;
  bottom: 0;
  left: 0;
  &.active {
    .infos {
      position: relative;
      z-index: 100;
      background: #16afe9;
      box-shadow: 3px 0px 30px -6px rgba(0, 255, 238, 1);
      border: 1px solid rgba(0, 255, 238, 1);
    }
  }

  .picture {
    position: absolute;
    z-index: 0;
    bottom: 73px;
    left: 0px;
  }
}
</style>
