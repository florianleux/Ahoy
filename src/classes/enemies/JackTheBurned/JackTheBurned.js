import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";
import { MathHelper } from "@/classes/helpers/MathHelper.js";

export class JackTheBurned extends Enemy {
  name = "Jack Le Cramé";

  className ="JackTheBurned";


  phrase = "Quelqu'un aurait du feu ?";

  nature = "Pyromane à ses heures perdues.";

  mathHelper = new MathHelper();

  activatePower() {
    return this.mathHelper.getRandomIntMax(100) > 50 ? true : false;
  }

  constructor(name) {
    super(name);

    this.mainPower =
      new Power(
        "Alluuumeer le feuu",
        "Quand Jack touche un de vos bateaux, il a 50% de chances d'enflammer une case adjacente à celle qu'il vient de viser.",
        "Passif"
    );
  }
}
