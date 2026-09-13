<template>
  <div>
    <div class="grid-row">
      <div
        v-for="(enemy, index) in game.enemyList"
        :key="index"
        class="grid-col enemy"
      >
        <div v-if="index > game.level" class="name">???</div>
        <div v-else class="name" :class="{ defeated: index < game.level }">
          {{ $t(enemy.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
