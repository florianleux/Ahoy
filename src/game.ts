import { reactive } from "vue";
import { Game } from "@/classes/Game";

// The single reactive root. Every component and the router import this exact
// object, and nothing else ever wraps it again: Vue caches one proxy per raw
// target, so as long as every read goes through here, the identity comparisons
// the game relies on keep working -- Fleet.selectBoat comparing boats by
// reference, and the lodash _.find calls over boats.
//
// The rule that protects all of it: one reactive root, no toRaw, and no
// reference captured before this line runs.
export const game = reactive(new Game());

// A game in progress has a player, and that player has an opponent -- the three
// screens that assume it are behind meta.requiresGame, so the router has
// already checked. These turn that routing guarantee into a type once, rather
// than a non-null assertion at each of the forty-odd reads in the templates.
// Call them from a computed so nothing holds a player that has since been
// replaced by newGame or loadGame.
// reactive() hands back a deeply unwrapped view of the class, not the class
// itself, so these are typed from the root rather than from Player and Enemy --
// which is what keeps them cast-free.
export type ReactivePlayer = NonNullable<typeof game.player>;
export type ReactiveEnemy = NonNullable<ReactivePlayer["enemy"]>;

export function currentPlayer(): ReactivePlayer {
  if (!game.player) {
    throw new Error("No game in progress");
  }
  return game.player;
}

export function currentEnemy(): ReactiveEnemy {
  const enemy = currentPlayer().enemy;
  if (!enemy) {
    throw new Error("The player has no opponent");
  }
  return enemy;
}
