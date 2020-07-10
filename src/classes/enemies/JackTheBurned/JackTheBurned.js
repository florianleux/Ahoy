import { Enemy } from "@/classes/Enemy.js";
import { MathHelper } from "@/classes/helpers/MathHelper.js";

export class JackTheBurned extends Enemy {
  name = "Jack Le Cramé";

  phrase = "Quelqu'un aurait du feu ?";

  mathHelper = new MathHelper();

  activatePower() {
    return this.mathHelper.getRandomIntMax(100) > 50 ? true : false;
  }
}
