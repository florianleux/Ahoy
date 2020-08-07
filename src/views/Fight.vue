<template>
  <div>
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
    <v-row class="turn-indication">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__flipInY"
        leave-active-class="animate__animated animate__flipOutY"
      >
        <div class="text" v-bind:key="player.turn">
          {{
            player.turn
              ? "C'est votre tour !"
              : "C'est au tour de votre adversaire !"
          }}
        </div>
      </transition>
    </v-row>

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
            Nouvelle partie
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

    <!--    <v-btn @click="player.defeat = true">-->
    <!--      defeat-->
    <!--    </v-btn>-->
    <!--    <v-btn @click="player.victory = true">-->
    <!--      victory-->
    <!--    </v-btn>-->
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
      this.$router.push({ name: "Placement" });
    },
    rerun: function() {
      this.game.rerun();
      this.$router.push({ name: "Placement" });
    }
  },
  beforeCreate: function() {
    document.body.className = "fight";
  }
};
</script>

<style lang="less">
#app {
  /*background: url('/fight/bg.jpg') no-repeat;*/
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
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
.turn-indication {
  .text {
    margin: auto;
    margin-top: 25px;
    text-align: center;
    font-size: 35px;
    background: white;
  }
}
</style>
