import { Character } from "@/classes/Character";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper";
import type { Enemy } from "@/classes/Enemy";

export type Identity = "male" | "female";

export class Player extends Character {
  enemy: Enemy | null = null;
  turn = true;
  identity: Identity;
  profileHelper = new PlayerProfileHelper();

  constructor(name: string, identity: Identity) {
    super(name);

    this.phrase = this.profileHelper.getPhrase();
    this.identity = identity;
  }
}
