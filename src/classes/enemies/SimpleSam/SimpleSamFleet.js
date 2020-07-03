import { Boat } from "@/classes/Boat.js";
import { Fleet } from "@/classes/Fleet.js";

export class SimpleSamFleet extends Fleet {
  size = 10;
  putBoats = 0;
  selectedBoat = null;
  boats = [];

  _populateFleet(){
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(2, i));
    }
  }
}
