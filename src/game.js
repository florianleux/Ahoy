import { reactive } from "vue";
import { Game } from "@/classes/Game";

// The single reactive root. Every component and the router import this exact
// object, and nothing else ever wraps it again: Vue caches one proxy per raw
// target, so as long as every read goes through here, the identity comparisons
// the game relies on keep working -- Fleet.selectBoat comparing boats by
// reference, and the seven lodash _.find calls over boats.
//
// The rule that protects all of it: one reactive root, no toRaw, and no
// reference captured before this line runs.
export const game = reactive(new Game());
