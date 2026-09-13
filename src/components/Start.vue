<template>
  <div class="grid-row start-page">
    <img
      class="player-img"
      :src="assetUrl('home/players/' + playerIdentity + '.webp')"
    />

    <section class="home-card">
      <div class="home-card-title"><h1 class="game-title">AHOY !</h1></div>
      <!--
        Nothing submits this form: both buttons act on click, as they did as
        v-btn. @submit.prevent only stops the Enter key from reloading the page.
      -->
      <form class="start-form" @submit.prevent>
        <div class="name-field">
          <input
            type="text"
            class="name-input"
            :placeholder="$t('votre_nom_de_pirate')"
            v-model="playerName"
            required
            @input="nameTouched = true"
          />
          <!--
            Kept at its height even when empty, the way v-text-field reserved
            room for its details: without it the card jumps as the message
            comes and goes.
          -->
          <div class="name-error">{{ nameTouched ? nameError : "" }}</div>
        </div>

        <div class="label">{{ $t("vous_etes") }}</div>
        <div class="identity-input">
          <label class="identity-choice">
            <input type="radio" value="male" v-model="playerIdentity" />
            {{ $t("un_homme") }}
          </label>
          <label class="identity-choice">
            <input type="radio" value="female" v-model="playerIdentity" />
            {{ $t("une_femme") }}
          </label>
        </div>

        <div class="actions">
          <button
            type="button"
            class="game-button start-game"
            id="startButton"
            :disabled="!valid"
            @click="newGame"
          >
            {{ $t("nouvelle_partie") }}
          </button>
          <button
            type="button"
            class="game-button load-game"
            id="loadButton"
            :disabled="!savedGame"
            @click="loadGame"
          >
            {{ $t("continuer") }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { assetUrl } from "@/utils/assets";
import { game } from "@/game.js";
import { Game } from "@/classes/Game.js";
import { audioManager } from "@/utils/AudioManager";

const NAME_RULES = [
  v => v.length > 1 || "Votre nom doit comporter au minimum 1 caractère",
  v => v.length < 15 || "Votre nom doit comporter au maximum 15 caractères"
];

const router = useRouter();
const { t } = useI18n();

const playerName = ref("");
const playerIdentity = ref("male");
// v-text-field showed nothing until the field was touched, even though the
// empty name already failed its rules and kept the button disabled.
const nameTouched = ref(false);
// null when the slot is empty or holds an old-format save, which is what keeps
// the resume button disabled instead of letting it throw.
const savedGame = ref(Game.readSave());

// The first failing rule wins, which is the order v-text-field displayed them
// in.
const nameError = computed(() => {
  for (const rule of NAME_RULES) {
    const result = rule(playerName.value);
    if (result !== true) {
      return result;
    }
  }
  return null;
});

// What v-form put in `valid`.
const valid = computed(() => nameError.value === null);

function newGame() {
  if (savedGame.value && !confirm(t("alert_partie_existante"))) {
    return false;
  }
  audioManager.playSound("click");
  audioManager.playMusic("home");
  game.newGame(playerName.value, playerIdentity.value);
  router.push({ name: "PreFight" });
}

function loadGame() {
  game.loadGame(savedGame.value);
  audioManager.playSound("click");
  audioManager.playMusic("home");
  router.push({ name: "PreFight" });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// 396px is what the card measured as a v-card: the 390px of the form plus its
// two 3px borders.
.home-card {
  width: 396px;
  position: fixed;
  top: 50%;
  margin-top: -250px;
  left: 75%;
  margin-left: -196px;
  background: #ffe4b4;
  border: 3px solid #d09c5f;
  // rounded-lg, and the elevation-24 of the v-card it was.
  border-radius: 8px;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  color: #502218;
  padding-bottom: 50px;
}

// v-card__title's padding, and the flex box that let the title's auto margins
// centre it.
.home-card-title {
  display: flex;
  justify-content: center;
  padding: 16px;
}

#startButton {
  width: 250px;
  margin-bottom: 15px;
}
#loadButton {
  width: 250px;
}

.player-img {
  position: fixed;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 10%;
}
.game-title {
  -webkit-text-fill-color: #ffffff;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #dcb570;
  font-size: 50px;
  margin-top: 35px;
  line-height: 1;
  color: black;
}
.start-form {
  max-width: 390px;
  margin: auto;

  .label {
    text-align: center;
    margin-top: 24px;
  }
}

// The 45px side margins are what the 300px field left inside the 390px form.
.name-field,
.identity-input {
  margin: 0 45px;
}

.name-field {
  padding-top: 12px;
}

// v-text-field drew its resting underline on a pseudo-element; a border on the
// input itself lands on the same pixel.
.name-input {
  display: block;
  width: 100%;
  height: 32px;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 0;
  background: transparent;
  font-family: "Roman Antique";
  font-size: 25px;
  line-height: 20px;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.38);
    opacity: 1;
  }

  &:focus {
    border-bottom-color: #502218;
  }
}

// v-messages kept its 14px whether or not it had something to say.
.name-error {
  min-height: 14px;
  margin-top: 8px;
  line-height: 12px;
  text-align: center;
  color: #ff5252;
}

// v-radio-group stood 74px tall -- its own vertical margins plus the messages
// slot it reserved -- and the card's height depends on it.
.identity-input {
  display: flex;
  height: 74px;
  padding: 16px 0 0 25px;
}

// The radio sat 44px left of its label: a 24px control and a 20px gap.
.identity-choice {
  flex: 0 0 50%;
  // Without this the choice stretches to the group's 74px and its centring
  // drops the radio 18px below where v-radio sat.
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  font-size: 22px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;

  input {
    width: 24px;
    height: 24px;
    margin: 0;
    accent-color: #1976d2;
    cursor: pointer;
  }
}

.actions {
  margin-top: 24px;

  .game-button {
    margin: auto;
  }
}
</style>
