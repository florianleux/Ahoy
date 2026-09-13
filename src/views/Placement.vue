<template>
  <div>
    <div class="shadow"></div>
    <h1 class="page-title">
      Phase de placement
    </h1>
    <div class="grid-row">
      <div class="grid-col grid-col-8">
        <MapVue></MapVue>
      </div>
      <div class="grid-col grid-col-4">
        <Fleet></Fleet>
      </div>
    </div>

    <div class="help-zone" id="helpZone" :style="helpZoneStyle">
      <div class="grid-row">
        <div class="grid-col">
          <div class="help-placement">
            Pour faire tourner votre bateau avant de le placer, vous pouvez
            utiliser la roulette de votre souris ou faire un clic droit sur la
            carte !
          </div>
        </div>
      </div>
      <div class="grid-row">
        <button
          type="button"
          class="game-button start-fight"
          id="startFight"
          :disabled="player.fleet.size != player.fleet.putBoats"
          @click="startFight"
        >
          A L'ABORDAGE !
        </button>
      </div>
    </div>
    <PlayerProfile></PlayerProfile>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { currentPlayer } from "@/game";
import MapVue from "@/components/Placement/Map.vue";
import Fleet from "@/components/Placement/Fleet.vue";
import PlayerProfile from "@/components/Profiles/PlayerProfile.vue";
import { audioManager } from "@/utils/AudioManager";
import { useResponsivePosition } from "@/composables/useResponsivePosition";

const player = computed(currentPlayer);

const BASE_COORDS = { x: 540, y: 720, width: 475, height: 170 };

const router = useRouter();
const helpZoneStyle = ref({});

const { calculatePosition } = useResponsivePosition(() => {
  helpZoneStyle.value = calculatePosition(BASE_COORDS);
});

function startFight() {
  audioManager.playSound("click");
  router.push({ name: "Fight" });
}
</script>

<style lang="less">
body.placement {
  overflow: hidden;

  #app {
    background: url("/placement/bg.webp") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    opacity: 1;
  }
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
  font-size: 25px;
  line-height: 1;
}

.help-zone {
  transform: rotate(-6deg);
  position: absolute;
}

.start-fight {
  position: fixed;
  bottom: 5px;
  right: 50%;
  margin-right: -107px;
  margin-top: 20px;
}
</style>
