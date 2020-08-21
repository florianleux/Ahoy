import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";

export class ChisanaKaizoku extends Enemy {
  name = "Chïsana Kaizoku";

  phrase = "Osu !";

  nature = "Il a le mal de mer.";

  constructor(name) {
    super(name);

    this.powers.push(
      new Power(
        "Contre-attaque",
        "A chaque fois que vous attaquez Chïsana, il a 50% de chances </br> de riposter aux même coordonnées sur votre carte.",
        "Passif"
      )
    );
  }
}
