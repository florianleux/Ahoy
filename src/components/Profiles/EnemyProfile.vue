<template>
  <div class="enemy profile" :class="{ active: enemy.turn }">
    <img
            rel="preload"
            width="370"
            :src="
        publicPath + 'players/' + enemy.name.replace(/\s+/g, '')+ '/' + enemy.mood + '.png'
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
    }
  }

  .profile {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 9901;

    .picture {
      position: absolute;
      z-index: 9902;
      bottom: 81px;
      right: 0px;
    }
  }
</style>
