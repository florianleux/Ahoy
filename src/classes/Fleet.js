import { Boat } from "@/classes/Boat.js";

export class Fleet {
  size = 5;
  putBoats = 0;
  selectedBoat = null;
  boats = [];

  constructor() {
    this._populateFleet();
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

  _populateFleet() {
    for (let i = 1; i <= this.size; i++) {
      this.boats.push(new Boat(i + 1, i));
    }
  }
}
