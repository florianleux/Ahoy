import { Character } from "@/classes/Character.js";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper";

export class Player extends Character {
  enemy = null;
  turn = true;


  profileHelper = new PlayerProfileHelper();

  constructor(name){
    super(name);

    this.phrase = this.profileHelper.getPhrase();

  }
}
