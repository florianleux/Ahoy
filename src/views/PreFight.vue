<template>
  <div class="infos-zone">
    <h1>Prochain adversaire</h1>
    <EnemiesList />
    <CurrentEnemy />
    <v-btn color="primary" class="start-fight" @click="goPlacement">
      A l'attaque !
    </v-btn>
  </div>
</template>

<script>
import EnemiesList from "../components/PreFight/EnemiesList";
import CurrentEnemy from "../components/PreFight/CurrentEnemy";
export default {
  name: "PreFight",
  components: {
    EnemiesList,
    CurrentEnemy
  },
  methods: {
    goPlacement: function() {
      this.$game.clickSound.play();
      this.$router.push({ name: "Placement" });
    }
  },
  beforeCreate: function() {
    document.body.className = "pre-fight";
  }
};
</script>

<style lang="less">
body.pre-fight #app {
  background: url("/placement/bg.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
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

.start-fight {
  position: fixed;
  bottom: 25px;
  right: 50%;
  margin-right: -85px;
}
</style>
