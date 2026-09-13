import { Enemy } from "@/classes/Enemy";
import { Power } from "@/classes/Power";
import type { Boat } from "@/classes/Boat";
import type { Character } from "@/classes/Character";

export class Z extends Enemy {
  override name = "z_name" as const;
  override className = "Z" as const;
  override phrase = "z_phrase" as const;
  override nature = "z_nature" as const;

  constructor(name: string) {
    super(name);

    this.mainPower = new Power(
      "z_main_power_name",
      "z_main_power_description",
      "actif"
    );
  }

  // Lifts a sunk boat off the board, clears the hits that sank it, and drops it
  // somewhere the opponent has not already shot.
  healBoat(boat: Boat, enemy: Character): void {
    boat.coords.forEach(coord => {
      this.map.boatMap[coord[1]][coord[0]] = false;
      enemy.map.hitMap[coord[1]][coord[0]] = "missed";
    });

    boat.coords = [];
    boat.destroyed = false;
    boat.hp = boat.size;
    this.health += boat.size;

    const boatCoords = this.map._getRandomBoatCoords(boat, enemy.map.hitMap);

    boat.coords = boatCoords;

    boatCoords.forEach(boatCoord => {
      const [posX, posY] = boatCoord;
      this.map.boatMap[posY][posX] = boat.id;
    });
  }
}
