<template>
  <div class="infos-zone">
    <h1>{{ $t("prochain_adversaire") }}</h1>
    <EnemiesList />
    <CurrentEnemy />
    <button
      type="button"
      class="game-button start-placement"
      @click="goPlacement"
    >
      {{ $t("a_lattaque") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import EnemiesList from "../components/PreFight/EnemiesList.vue";
import CurrentEnemy from "../components/PreFight/CurrentEnemy.vue";
import { audioManager } from "@/utils/AudioManager";

const router = useRouter();

function goPlacement() {
  audioManager.playSound("click");
  router.push({ name: "Placement" });
}
</script>

<style lang="less">
body.pre-fight {
  overflow: hidden;

  #app {
    background: url("/placement/bg.webp") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    #help {
      display: none;
    }
  }
}

.infos-zone {
  position: fixed;
  top: 6%;
  bottom: 4%;
  right: 6%;
  left: 6%;
  padding-top: 10px;
  color: white;
  background-color: #0a39408c;
  border-radius: 8px;
  border: 3px solid #333c4a;
}

.start-placement {
  position: fixed;
  bottom: 70px;
  right: 50%;
  margin: auto;
  margin-right: -107px;
}
</style>
