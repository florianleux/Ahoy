<template>
  <div class="enemy profile" :class="{ active: enemy.turn }">
    <div class="infos">
      <div class="name">{{ enemy.name }}</div>
      <div class="phrase">"Je suis TRES TRES MECHANT"</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnemyProfile",
  data: function() {
    return {
      game: this.$game,
      enemy: this.$game.player.enemy
    };
  }
};
</script>

<style scoped lang="less">
.infos {
  border-radius: 5px 0 0 5px;
  position: fixed;
  bottom: 25px;
  right: 0;
  padding: 10px 30px 10px 30px;
  width: 330px;
  background: #f34667;

  .name {
    font-weight: bold;
    font-size: 16px;
    font-family : "Space Comics";
    text-transform: uppercase;
    text-align: right;
    float: right;
  }
  .phrase {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
    float: right;
  }
}
.profile {
  &.active {
    .infos {
      background: #f30224;
      box-shadow: -1px 0px 30px -6px rgba(255, 0, 128, 1);
      border: 1px solid rgba(255, 0, 128, 1);
    }
  }
}
</style>
