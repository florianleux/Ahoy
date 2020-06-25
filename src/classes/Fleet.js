import { Boat } from "@/classes/Boat.js";

export class Fleet {
  nbBoats = 5;
  selectedBoat = null;
  boats = [];

  constructor() {
    for (let i = 1; i <= this.nbBoats; i++) {
      this.boats.push(new Boat(i + 1));
    }
  }

  selectBoat(target) {
    if (this.selectedBoat !== null) {
      this.selectedBoat.unselect();
    }
    this.selectedBoat = target;

    if (target !== null) {
      target.select();
    }
  }
}
