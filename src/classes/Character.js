import { Fleet } from "@/classes/Fleet.js";
import { Map } from "@/classes/Map.js";
import _ from "lodash";

export class Character {
  map = null;
  status = false;

  constructor(name) {
    this.name = name;
    this.map = new Map();
    this.fleet = new Fleet();
  }

  setName(name) {
    this.name = name;
  }

  attack(target, x, y) {
    var hit = target.map.boatMap[y - 1][x - 1];

    if (!hit) {
      this.map.hitMap[[y - 1]].splice([x - 1], 1, "missed");
      return "MISSED";
    } else {
      if (typeof hit == "number") {
        this.map.hitMap[[y - 1]].splice([x - 1], 1, "hit");
        let hitBoat = _.find(target.fleet.boats, { id: hit });
        hitBoat.hit();
        if (hitBoat.destroyed) {
          let aliveBoats = _.find(target.fleet.boats, { destroyed: false });
          if (!aliveBoats) {
            this.status = "VICTORY";
            target.status = "DEFEAT";
            return "ENDGAME";
          } else {
            return "DESTROYED";
          }
        } else {
          return "HIT";
        }
      }
    }
  }
}
