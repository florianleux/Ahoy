import { Boat } from "@/classes/Boat.js";
import { Fleet } from "@/classes/Fleet.js";

export class SimpleSamFleet extends Fleet {

  _populateFleet(){
    console.log("populate sam");
    this.size = 5;
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(4, i));
    }

  }


}
