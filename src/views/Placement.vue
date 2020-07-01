<template>
  <div>
    <div class="page-title">
      Phase de placements
    </div>
    <v-row>
      <v-col cols="8">
        <MapVue></MapVue>
      </v-col>
      <v-col cols="4">
        <Fleet></Fleet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="hint">
          Pour faire tourner votre bateau avant de le placer, vous pouvez
          utiliser la roulette de votre souris ou faire un clic droit sur la
          carte !
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        :disabled="playerFleet.size != playerFleet.putBoats"
        color="success"
        class="mr-4 "
        @click="startFight"
      >
        FIGHT !
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import MapVue from "@/components/Placement/Map.vue";
import Fleet from "@/components/Placement/Fleet.vue";

export default {
  name: "Placement",
  components: {
    MapVue,
    Fleet
  },
  data: function() {
    return {
      player: this.$game.player,
      playerFleet: this.$game.player.fleet
    };
  },
  methods: {
    startFight: function() {
      this.$router.push({ name: "Fight" });
    }
  }
};
</script>

<style>
.hint {
  text-align: center;
  margin: auto;
  font-style: italic;
  font-size: 14px;
}
</style>
