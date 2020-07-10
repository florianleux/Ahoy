// import { Boat } from "@/classes/Boat.js";
import { Fleet } from "@/classes/Fleet.js";

export class MamanBrigitteFleet extends Fleet {
  _populateFleet() {
    super._populateFleet();

    let doomedBoat = this.boats[Math.floor(Math.random() * this.boats.length)];

    doomedBoat.doomed = true;
  }
}
