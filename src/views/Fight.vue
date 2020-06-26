<template>
  <div>
    <div class="page-title">
      Phase de BAGARRE
    </div>
    <v-row>
      <v-col cols="6">
        <EnemyMap></EnemyMap>
      </v-col>
      <v-col cols="6">
        <PlayerMap></PlayerMap>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PlayerMap from "@/components/Fight/PlayerMap.vue";
import EnemyMap from "@/components/Fight/EnemyMap.vue";

export default {
  name: "Fight",
  components: {
    PlayerMap,
    EnemyMap
  }
};
</script>
