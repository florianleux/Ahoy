<template>
<div class="player profile">
  <div class="infos">
    <div class="name">{{player.name}}</div>
    <div class="phrase">"{{player.phrase}}" </div>
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
  .infos{
    border-radius: 0 5px 5px 0;
    position:fixed;
    bottom: 25px;
    left: 0;
    padding: 10px 30px 10px 30px;
    background: orange;

    .name{
      font-weight: bold;
      font-size: 18px;
    }
    .phrase{
      font-style: italic;
      font-size:13px;
    }

  }
</style>
