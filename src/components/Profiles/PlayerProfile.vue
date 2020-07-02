<template>
  <div class="player profile" :class="{ active: player.turn }">
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
      player: this.$game.player
    };
  }
};
</script>

<style scoped lang="less">
.infos {
  border-radius: 0 5px 5px 0;
  position: fixed;
  bottom: 25px;
  left: 0;
  padding: 10px 30px 10px 30px;
  width: 330px;
  background: #54cde9;

  .name {
    font-weight: bold;
    font-size: 16px;
    font-family : "Space Comics";
    text-transform: uppercase;
  }
}

.profile {
  &.active {
    .infos {
      background: #16afe9;
      box-shadow: 3px 0px 30px -6px rgba(0, 255, 238, 1);
      border: 1px solid rgba(0, 255, 238, 1);
    }
  }
}
</style>
