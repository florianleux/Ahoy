<template>
  <div>
    <div class="shadow"></div>
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
    <div class="help-zone">
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
    </div>
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
  },
  beforeCreate: function() {
    document.body.className = "placement";
  }
};
</script>

<style lang="less">
body.placement #app {
  background: url("/placement/bg.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}
.shadow {
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
  background: url("/placement/shadow.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}

.help-placement {
  text-align: center;
  margin: auto;
  font-style: italic;
  font-size: 18px;
}

.help-zone {
  transform: rotate(-6deg);
  position: absolute;
  bottom: 19%;
  left: 28%;
  width: 400px;
}

.start-fight {
  margin: auto;
}
</style>
