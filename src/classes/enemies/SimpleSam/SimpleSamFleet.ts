import { Boat } from "@/classes/Boat";
import { Fleet } from "@/classes/Fleet";
import type { BoatId } from "@/classes/types";

export class SimpleSamFleet extends Fleet {
  protected override _populateFleet(): void {
    this.size = 5;
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(4, i as BoatId));
    }
  }
}
