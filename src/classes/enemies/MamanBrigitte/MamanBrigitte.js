import { Enemy } from "@/classes/Enemy.js";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet.js";

export class MamanBrigitte extends Enemy {
  name = "Maman Brigitte";

  phrase = "Attention à vous...";

  constructor(name) {
    super(name);
    this.fleet = new MamanBrigitteFleet();
  }
}
