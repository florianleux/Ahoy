import { Player } from "@/classes/Player.js";
import { Map } from "@/classes/Map.js";

export class Game {
  constructor(playerName) {
    this.player = new Player(playerName);
    this.map = new Map();
  }
}
