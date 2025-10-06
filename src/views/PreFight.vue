<template>
  <div class="infos-zone">
    <h1>{{ $t("prochain_adversaire") }}</h1>
    <EnemiesList />
    <CurrentEnemy />
    <v-btn color="primary" class="start-placement" @click="goPlacement">
      {{ $t("a_lattaque") }}
    </v-btn>
  </div>
</template>

<script>
import EnemiesList from "../components/PreFight/EnemiesList";
import CurrentEnemy from "../components/PreFight/CurrentEnemy";
import { audioManager } from "@/utils/AudioManager";

export default {
  name: "PreFight",
  components: {
    EnemiesList,
    CurrentEnemy
  },
  methods: {
    goPlacement: function() {
      audioManager.playSound("click");
      this.$router.push({ name: "Placement" });
    }
  }
};
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
      margin:auto;
      margin-right: -107px;
  }
</style>  
