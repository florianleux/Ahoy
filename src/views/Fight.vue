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
    <div class="tooltip" v-if="game.help" style="right:190px;bottom: 85px;">
      <span class="text">...et celles de votre adversaire ! </span>
    </div>
    <div class="tooltip" v-if="game.help" style="left : 180px; bottom: 85px ">
      <span class="text"
        >Voici le nombre de cases de bateaux <br />non coulés qu'il vous
        reste...</span
      >
    </div>
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
      enemy: this.$game.player?.enemy || null,
      player: this.$game.player || null
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
  created() {
    // Safety check - redirect if no player
    if (!this.$game.player) {
      this.$router.push({ name: "Home" });
    }
  },
  mounted() {
    // Add enemy class to body (base class already set by router guard)
    if (this.enemy) {
      document.body.classList.add(this.enemy.className);
    }
  }
};
</script>

<style lang="less">
body.fight #app {
  background: url("/fight/bg.webp") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 1;
}
body.fight.SimpleSam #app {
  background: url("/fight/SimpleSam/bg.webp") no-repeat center center fixed;
  -webkit-background-size: cover;
}
body.fight.JackTheBurned #app {
  background: url("/fight/JackTheBurned/bg.webp") no-repeat center center fixed;
  background-size: cover;

  .shadow {
    background: url("/fight/JackTheBurned/shadow.webp") no-repeat center center
      fixed;
    background-size: cover;
  }
}
body.fight.MamanBrigitte #app {
  background: url("/fight/MamanBrigitte/bg.webp") no-repeat center center fixed;
  background-size: cover;

  .shadow {
    background: url("/fight/MamanBrigitte/shadow.webp") no-repeat center center
      fixed;
    background-size: cover;
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
  background: url("/fight/shadow.webp") no-repeat center center fixed;
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
</style>
