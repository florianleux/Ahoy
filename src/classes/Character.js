import { Fleet } from "@/classes/Fleet.js";
import { Map } from "@/classes/Map.js";

export class Character {
  constructor(name) {
    this.name = name;
    this.map = new Map();
    this.fleet = new Fleet();
  }

  setName(name) {
    this.name = name;
  }
}
