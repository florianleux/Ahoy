import { Boat } from "@/classes/Boat";
import { Fleet } from "@/classes/Fleet";
import type { BoatId } from "@/classes/types";

export class MamanBrigitteFleet extends Fleet {
  override _populateFleet(): void {
    this.size = 4;
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(5, i as BoatId));
    }

    // One boat is bound by voodoo to one of the player's.
    const doomedBoat = this.boats[
      Math.floor(Math.random() * this.boats.length)
    ] as Boat;

    doomedBoat.doomed = true;
  }
}
