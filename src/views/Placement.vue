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

    <div class="help-zone" id="helpZone" :style="helpZoneStyle">
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
          color="primary"
          class="start-fight"
          @click="startFight"
          id="startFight"
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
import { audioManager } from "@/utils/AudioManager";
import { responsivePositionMixin } from "@/mixins/responsivePosition";

export default {
  name: "Placement",
  mixins: [responsivePositionMixin],
  components: {
    MapVue,
    Fleet,
    PlayerProfile
  },
  data: function() {
    return {
      game: this.$game,
      player: this.$game.player || null,
      playerFleet: this.$game.player?.fleet || null,
      helpZoneStyle: {}
    };
  },
  methods: {
    startFight: function() {
      audioManager.playSound("click");
      this.$router.push({ name: "Fight" });
    },
    handleResize() {
      const baseCoords = { x: 540, y: 720, width: 475, height: 170 };
      this.helpZoneStyle = this.calculatePosition(baseCoords);
    }
  },
  created() {
    // Safety check - redirect if no player
    if (!this.$game.player) {
      this.$router.push({ name: "Home" });
    }
  },
  mounted() {
    this.setupResponsive();
    window.dispatchEvent(new Event("resize"));
  }
};
</script>

<style lang="less">
body.placement #app {
  background: url("/placement/bg.webp") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}
.shadow {
  z-index: 9900;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
  background: url("/placement/shadow.webp") no-repeat center center fixed;
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
}

.start-fight {
  margin: auto;
}
</style>
