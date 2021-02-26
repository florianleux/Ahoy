import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";

export class Z extends Enemy {
  name = "Z";

  className = "Z";

  phrase = "The deads never die";

  nature = "He was once human, then he became Z";

  constructor(name) {
    super(name);

    this.mainPower = new Power(
      "Remise à flot",
      "Lorsqu'un bateau de sa flotte est détruit, Z peut le soigner et le replacer sur sa map.",
      "actif"
    );
  }
}
