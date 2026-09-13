import { Character } from "@/classes/Character";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper";
// The union rather than the base class, so that checking className narrows to
// the one enemy that has the power being reached for.
import type { GameEnemy } from "@/classes/Game";

export type Identity = "male" | "female";

export class Player extends Character {
  enemy: GameEnemy | null = null;
  turn = true;
  identity: Identity;
  profileHelper = new PlayerProfileHelper();

  constructor(name: string, identity: Identity) {
    super(name);

    this.phrase = this.profileHelper.getPhrase();
    this.identity = identity;
  }
}
