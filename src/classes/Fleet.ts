import { Boat } from "@/classes/Boat";
import type { BoatId } from "@/classes/types";

export class Fleet {
  size = 5;
  putBoats = 0;
  selectedBoat: Boat | null = null;
  boats: Boat[] = [];

  constructor() {
    this._populateFleet();
  }

  // Compares by reference, which is why every read of the game has to come
  // through the one reactive root: a raw boat and its proxy are not the same
  // object, and the mismatch selects nothing without erroring.
  selectBoat(target: Boat | null): void {
    if (this.selectedBoat !== null) {
      this.selectedBoat.unselect();
    }
    this.selectedBoat = target;

    if (target !== null) {
      target.select();
    }
  }

  _populateFleet(): void {
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(i + 1, i as BoatId));
    }
  }
}
