import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";
import { SimpleSamFleet } from "@/classes/enemies/SimpleSam/SimpleSamFleet.js";

export class SimpleSam extends Enemy {
  name = "Simple Sam";

  phrase = "La vie c'est comme une boîte de sardines...";

  nature = "Pas très malin. Vraiment.";

  constructor(name) {
    super(name);
    this.fleet = new SimpleSamFleet();

    this.powers.push(
      new Power(
        "Tant que je gagne, je joue !",
        "A chaque fois que Simple Sam touche un de vos bateaux, il attaque de nouveau.",
        "Passif"
      )
    );

    this.powers.push(
      new Power(
        "Poulet sans tête",
        "Simple Sam n'a aucune stratégie : tous ses coups sont joués au hasard",
        "Passif"
      )
    );
  }

  _strategy() {
    return this._randomHit();
  }
}
