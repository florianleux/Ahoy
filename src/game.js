import { Game } from "@/classes/Game.js";

// The single Game instance. It used to hang off Vue.prototype and be reachable
// from the router through window.vueApp; a module both of them import replaces
// that, which is what lets window.vueApp go.
//
// Still a plain object: Vue 2 made it observable in place, Vue 3 will not, so
// mutations made from inside Game.js do not yet reach the templates. Wrapping
// it in reactive() is #56, along with the save format.
export const game = new Game();
