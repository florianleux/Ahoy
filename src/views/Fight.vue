<template>
  <div>
    <div class="shadow"></div>
    <h1 class="page-title">
      Phase de BAGARRE
    </h1>
    <v-row class="map-line">
      <v-col cols="6">
        <EnemyMap></EnemyMap>
      </v-col>
      <v-col cols="6">
        <PlayerMap></PlayerMap>
      </v-col>
    </v-row>
    <PlayerProfile></PlayerProfile>
    <EnemyProfile></EnemyProfile>
    <v-dialog v-model="player.victory" persistent width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          VICTOIRE !
        </v-card-title>
        <v-card-text>
          <div>Bravo {{ player.name }} !</div>
          <div>Vous avez vaincu la flotte ennemie !</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="nextLevel">
            Ennemi suivant !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="player.defeat" persistent width="500">
      <v-card>
        <v-card-title class="headline" primary-title>
          DÉFAITE...
        </v-card-title>
        <v-card-text>
          <div>Dommage {{ player.name }} !</div>
          <div>
            Votre adversaire {{ enemy.name }} a exterminé votre flotte...
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="rerun">
            Revanche !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="dev">
      <v-btn @click="player.defeat = true">
        defeat
      </v-btn>
      <v-btn @click="player.victory = true">
        victory
      </v-btn>
    </div>
  </div>
</template>

<script>
import PlayerMap from "@/components/Fight/PlayerMap.vue";
import EnemyMap from "@/components/Fight/EnemyMap.vue";
import PlayerProfile from "@/components/Profiles/PlayerProfile.vue";
import EnemyProfile from "@/components/Profiles/EnemyProfile.vue";

export default {
  name: "Fight",
  components: {
    PlayerMap,
    EnemyMap,
    PlayerProfile,
    EnemyProfile
  },
  data: function() {
    return {
      game: this.$game,
      enemy: this.$game.player.enemy,
      player: this.$game.player
    };
  },
  methods: {
    nextLevel: function() {
      this.game.nextLevel();
      this.$router.push({ name: "PreFight" });

    },
    rerun: function() {
      this.game.rerun();
      this.$router.push({ name: "Placement" });
    }
  },
  beforeCreate: function() {
    document.body.className = "fight "+ this.$game.player.enemy.constructor.name;
  }
};
</script>

<style lang="less">
body.fight #app {
  background: url("/fight/bg.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}
body.fight.SimpleSam #app{
  background: url("/fight/SimpleSam/bg.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
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
  background: url("/fight/shadow.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}

.map-line {
  margin-left: 50px;
  position: relative;
  padding-top: 20px;
}
.mask {
  display: block;
  position: absolute;
  background: black;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.popin {
  color: white;
}

.dev {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 100000000;
}
</style>
