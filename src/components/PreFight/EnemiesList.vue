<template>
  <div>
    <div class="grid-row">
      <div
        class="grid-col enemy"
        v-for="(enemy, index) in enemies"
        :key="index"
      >
        <div class="name" v-if="index > level">???</div>
        <div class="name" v-else :class="{ defeated: index < level }">
          {{ $t(enemy.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnemiesList",
  data: function() {
    return {
      enemies: this.$game.enemyList,
      level: this.$game.level
    };
  }
};
</script>

<style scoped lang="less">
.name {
  text-align: center;
}

.defeated {
  text-decoration: line-through;
}
</style>
