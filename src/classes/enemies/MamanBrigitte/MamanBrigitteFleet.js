import { Boat } from "@/classes/Boat.js";
import { Fleet } from "@/classes/Fleet.js";

export class MamanBrigitteFleet extends Fleet {
  _populateFleet() {
    this.size = 4;
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(5, i));
    }

    let doomedBoat = this.boats[Math.floor(Math.random() * this.boats.length)];

    doomedBoat.doomed = true;
  }
}
