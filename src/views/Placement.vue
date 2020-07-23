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
import $ from "jquery";

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
    },
    onResize() {
      var target = { x: 540, y: 720, width: 475, height: 170 };
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      // Get largest dimension increase
      var xScale = windowWidth / 1920;
      var yScale = windowHeight / 1080;
      var scale;
      var yOffset = 0;
      var xOffset = 0;

      if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - 1080 * scale) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - 1920 * scale) / 2;
      }

      $(".help-zone").css("top", target.y * scale + yOffset);
      $(".help-zone").css("left", target.x * scale + xOffset);
      $(".help-zone").css("width", target.width * scale);
      $(".help-zone").css("height", target.height * scale);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.dispatchEvent(new Event("resize"));
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
}

.start-fight {
  margin: auto;
}
</style>
