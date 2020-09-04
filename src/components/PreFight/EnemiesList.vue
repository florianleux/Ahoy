<template>
  <div>
    <v-row>
      <v-col v-for="(enemy, index) in enemies" :key="index" class="enemy">
        <div class="name" v-if="index > level">???</div>
        <div class="name" v-else :class="{ defeated: index < level }">
          {{ $t(enemy.name) }}
        </div>
      </v-col>
    </v-row>
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
