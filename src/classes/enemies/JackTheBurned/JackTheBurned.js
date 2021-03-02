import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";
import { MathHelper } from "@/classes/helpers/MathHelper.js";

export class JackTheBurned extends Enemy {
  name = "jtb_name";

  className = "JackTheBurned";

  phrase = "jtb_phrase";

  nature = "jtb_nature";

  mathHelper = new MathHelper();

  activatePower() {
    return this.mathHelper.getRandomIntMax(100) > 30 ? true : false;
  }

  constructor(name) {
    super(name);

    this.mainPower = new Power(
      "jtb_main_power_name",
      "jtb_main_power_description",
      "passif"
    );
  }

  fire(target, posX, posY) {
    let ok = false;
    var fireDirection = this.mathHelper.getRandomIntMax(3);
    var i = 0;

    while (!ok && i < 4) {
      switch (fireDirection) {
        case 0:
          if (posX === 10) {
            fireDirection++;
          } else if (!this.map.hitMap[posX + 1][posY]) {
            posX++;
            ok = true;
            this.attack(target, posX, posY);
          } else {
            fireDirection++;
          }
          break;
        case 1:
          if (posX === 1) {
            fireDirection++;
          } else if (!this.map.hitMap[posX - 1][posY]) {
            posX--;
            ok = true;
            this.attack(target, posX, posY);
          } else {
            fireDirection++;
          }
          break;
        case 2:
          if (posY === 10) {
            fireDirection++;
          } else if (!this.map.hitMap[posX][posY + 1]) {
            posY++;
            ok = true;
            this.attack(target, posX, posY);
          } else {
            fireDirection++;
          }
          break;
        case 3:
          if (posY === 1) {
            fireDirection = 4;
          } else if (!this.map.hitMap[posX][posY - 1]) {
            posY--;
            ok = true;
            this.attack(target, posX, posY);
          } else {
            fireDirection = 4;
          }
          break;
      }
      i++;
    }
  }
}
