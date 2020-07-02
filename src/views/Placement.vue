<template>
  <div>
    <h1 class="page-title">
      Phase de placement
    </h1>
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
        <div class="help-placement">
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
        class="start-fight"
        @click="startFight"
      >
        A L'ABORDAGE !
      </v-btn>
    </v-row>
    <PlayerProfile></PlayerProfile>
  </div>
</template>

<script>
import MapVue from "@/components/Placement/Map.vue";
import Fleet from "@/components/Placement/Fleet.vue";
import PlayerProfile from "@/components/Profiles/PlayerProfile.vue";

export default {
  name: "Placement",
  components: {
    MapVue,
    Fleet,
    PlayerProfile
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
.help-placement {
  text-align: center;
  margin: auto;
  font-style: italic;
  font-size: 18px;
}

.start-fight {
  margin: auto;
}
</style>
