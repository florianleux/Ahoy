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

  healBoat(boat, enemy) {
    boat.coords.forEach(coord => {
      this.map.boatMap[coord[1]].splice(coord[0], 1, false);
      enemy.map.hitMap[coord[1]].splice(coord[0], 1, "missed");
    });

    boat.coords = [];
    boat.destroyed = false;
    boat.hp = boat.size;
    this.health += boat.size;

    const boatCoords = this.map._getRandomBoatCoords(boat, enemy.map.hitMap);

    boat.coords = boatCoords;

    boatCoords.forEach(boatCoord => {
      const posX = boatCoord[0];
      const posY = boatCoord[1];

      this.map.boatMap[posY].splice(posX, 1, boat.id);
    });
  }
}
