<template>
  <!--
    Opened by App.vue's v-if: the component only exists while the window is
    open, so mounted() is the open. @close covers every way out -- the mask,
    the cog, and the Escape key the browser handles itself -- and puts the
    game state back in sync. The dialog carries no padding of its own so that
    click.self only ever fires on the backdrop.
  -->
  <dialog
    ref="dialog"
    class="settings-dialog"
    aria-labelledby="settings-title"
    @close="game.settings = false"
    @click.self="game.settings = false"
  >
    <div class="settings-card">
      <div id="settings-title" class="settings-title">
        {{ $t("parametres") }}
      </div>
      <div class="settings-body">
        <div class="settings-row">
          <label class="settings-label">
            <input
              type="radio"
              name="locale"
              value="en"
              v-model="$i18n.locale"
            />
            {{ $t("anglais") }}
          </label>
          <label class="settings-label">
            <input
              type="radio"
              name="locale"
              value="fr"
              v-model="$i18n.locale"
            />
            {{ $t("francais") }}
          </label>
        </div>
        <label class="settings-label">
          <input
            type="checkbox"
            :checked="fullScreen"
            @change="onFullscreenToggle"
          />
          {{ $t("plein_ecran") }}
        </label>
      </div>
    </div>
  </dialog>
</template>

<script>
import { game } from "@/game.js";
import {
  isFullscreen,
  onFullscreenChange,
  toggleFullscreen
} from "@/utils/fullscreen";

export default {
  name: "Settings",
  data: function() {
    return {
      game,
      fullScreen: Boolean(isFullscreen())
    };
  },
  methods: {
    // fullScreen mirrors the browser, never the click: the checkbox is put
    // back the way the state says and only the fullscreenchange listener moves
    // it. Without this the box would stay ticked after a request the browser
    // refused, and the next click would toggle the wrong way.
    onFullscreenToggle(event) {
      event.target.checked = this.fullScreen;
      toggleFullscreen();
    }
  },
  created() {
    this.stopWatchingFullscreen = onFullscreenChange(() => {
      this.fullScreen = Boolean(isFullscreen());
    });
  },
  mounted() {
    this.$refs.dialog.showModal();
  },
  beforeDestroy() {
    this.stopWatchingFullscreen();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// The dialog is the click target for the mask, so it holds no padding and no
// background of its own; the card below draws the window.
.settings-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: calc(100% - 48px);
  // Vuetify's reset zeroes the margin the UA stylesheet uses to centre a modal
  // <dialog>, and the 24px gutter v-dialog kept is in the max-width above.
  margin: auto;
}

// v-dialog's max-width="400" plus the elevation-24 of a Vuetify dialog.
.settings-card {
  width: 400px;
  max-width: 100%;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
}

.settings-title {
  font-family: "Space Comics";
  text-transform: uppercase;
  font-size: 18px;
  line-height: 32px;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  padding: 16px 24px 10px;
}

// v-card__text's padding and muted colour.
.settings-body {
  padding: 0 24px 20px;
  color: rgba(0, 0, 0, 0.6);
}

.settings-row {
  display: flex;
  gap: 32px;
}

// 22px is what the global .v-label rule gave every label in this window.
.settings-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;

  input {
    // Vuetify's primary, which coloured the selected radio.
    accent-color: #1976d2;
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
  }
}

.settings-row + .settings-label {
  margin-top: 24px;
}
</style>
