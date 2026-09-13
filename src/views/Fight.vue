<template>
  <div>
    <div class="shadow"></div>
    <h1 class="page-title">
      COMBAT !
    </h1>
    <div class="grid-row map-line">
      <div class="grid-col grid-col-6">
        <EnemyMap></EnemyMap>
      </div>
      <div class="grid-col grid-col-6">
        <PlayerMap></PlayerMap>
      </div>
    </div>
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
    <!--
      Both windows were <v-dialog persistent>: @cancel.prevent drops the Escape
      key, and only their own button closes them.
    -->
    <dialog
      ref="victory"
      class="game-dialog"
      aria-labelledby="victory-title"
      @cancel.prevent
    >
      <div id="victory-title" class="game-dialog-title">
        VICTOIRE !
      </div>
      <div class="game-dialog-text">
        <div>Bravo {{ game.player.name }} !</div>
        <div>Vous avez vaincu la flotte ennemie !</div>
      </div>
      <div class="game-dialog-actions">
        <button type="button" class="dialog-action" @click="nextLevel">
          Ennemi suivant !
        </button>
      </div>
    </dialog>

    <dialog
      ref="defeat"
      class="game-dialog"
      aria-labelledby="defeat-title"
      @cancel.prevent
    >
      <div id="defeat-title" class="game-dialog-title">
        DÉFAITE...
      </div>
      <div class="game-dialog-text">
        <div>Dommage {{ game.player.name }} !</div>
        <div>Votre adversaire {{ game.player.enemy.name }} a exterminé votre flotte...</div>
      </div>
      <div class="game-dialog-actions">
        <button type="button" class="dialog-action" @click="rerun">
          Revanche !
        </button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import { useRouter } from "vue-router";
import { game } from "@/game.js";
import PlayerMap from "@/components/Fight/PlayerMap.vue";
import EnemyMap from "@/components/Fight/EnemyMap.vue";
import PlayerProfile from "@/components/Profiles/PlayerProfile.vue";
import EnemyProfile from "@/components/Profiles/EnemyProfile.vue";

const router = useRouter();
const dialogs = {
  victory: useTemplateRef("victory"),
  defeat: useTemplateRef("defeat")
};

// Safety check - redirect if no player
if (!game.player) {
  router.push({ name: "Home" });
}

// A <dialog> only opens through showModal(), and both calls throw when the
// element is already in the state they ask for.
function syncDialog(name) {
  const dialog = dialogs[name].value;
  if (!dialog || game.player[name] === dialog.open) {
    return;
  }
  if (game.player[name]) {
    dialog.showModal();
  } else {
    dialog.close();
  }
}

watch(() => game.player?.victory, () => syncDialog("victory"));
watch(() => game.player?.defeat, () => syncDialog("defeat"));

function nextLevel() {
  game.nextLevel();
  router.push({ name: "PreFight" });
}

function rerun() {
  game.rerun();
  router.push({ name: "Placement" });
}

// The enemy class on <body> is what swaps the fight backdrop; the router guard
// has already put the page class there.
const enemyClass = game.player?.enemy?.className;

onMounted(() => {
  if (enemyClass) {
    document.body.classList.add(enemyClass);
  }
  // A watcher never fires for the initial value, so a fight resumed on a
  // finished state still gets its window.
  syncDialog("victory");
  syncDialog("defeat");
});

onUnmounted(() => {
  if (enemyClass) {
    document.body.classList.remove(enemyClass);
  }
});
</script>

<style lang="less">
body.fight {
  overflow: hidden;

  #app {
    background: url("/fight/bg.webp") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    opacity: 1;
  }
}
body.fight.SimpleSam #app {
  background: url("/fight/SimpleSam/bg.webp") no-repeat center center fixed;
  -webkit-background-size: cover;
  background-size: cover;
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
  // Was Vuetify's mt-15 utility class.
  margin-top: 60px;
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

// v-btn's text variant: no box, Vuetify's primary for the label, and the same
// 5px optical drop the 30px/20px padding gave every button in this game. The
// tag qualifies the selector because Vuetify's reset carries
// `[type=button] { color: inherit }` at equal specificity, injected later.
button.dialog-action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  min-width: 64px;
  padding: 10px 15px 0;
  border: none;
  background: transparent;
  color: #1976d2;
  font-family: "Space Comics";
  font-size: 12px;
  letter-spacing: 1.25px;
  text-transform: uppercase;
  cursor: pointer;
}
</style>
