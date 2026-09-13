<template>
  <div>
    <div class="grid-row">
      <div
        class="grid-col enemy"
        v-for="(enemy, index) in game.enemyList"
        :key="index"
      >
        <div class="name" v-if="index > game.level">???</div>
        <div class="name" v-else :class="{ defeated: index < game.level }">
          {{ $t(enemy.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { game } from "@/game";
</script>

<style scoped lang="less">
.name {
  text-align: center;
}

.defeated {
  text-decoration: line-through;
}
</style>
