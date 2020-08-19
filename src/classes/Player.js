import { Character } from "@/classes/Character.js";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper";

export class Player extends Character {
  enemy = null;
  turn = true;
  identity = null;
  profileHelper = new PlayerProfileHelper();
  attackLock = false;

  constructor(name, identity) {
    super(name);

    this.phrase = this.profileHelper.getPhrase();
    this.identity = identity;
  }
}
