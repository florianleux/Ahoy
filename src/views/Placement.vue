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
      <v-btn
              :disabled="fleet.size != fleet.putBoats"
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
      fleet: this.$game.player.fleet
    };
  },
  methods: {
    startFight: function(){
      console.log("fight started");
    }
  }
};
</script>
