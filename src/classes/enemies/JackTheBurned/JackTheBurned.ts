import { Enemy } from "@/classes/Enemy";
import { Power } from "@/classes/Power";
import { MathHelper } from "@/classes/helpers/MathHelper";
import type { Character } from "@/classes/Character";

export class JackTheBurned extends Enemy {
  override name = "jtb_name" as const;
  override className = "JackTheBurned" as const;
  override phrase = "jtb_phrase" as const;
  override nature = "jtb_nature" as const;

  mathHelper = new MathHelper();

  constructor(name: string) {
    super(name);

    this.mainPower = new Power(
      "jtb_main_power_name",
      "jtb_main_power_description",
      "passif"
    );
  }

  activatePower(): boolean {
    return this.mathHelper.getRandomIntMax(100) > 30;
  }

  // Sets fire to a square next to the one he just hit, trying each of the four
  // directions until one is on the board and not already shot at.
  fire(target: Character, posX: number, posY: number): void {
    let ok = false;
    let fireDirection = this.mathHelper.getRandomIntMax(3);
    let i = 0;

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
