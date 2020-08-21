import { Fleet } from "@/classes/Fleet.js";
import { Map } from "@/classes/Map.js";
import { MoodHelper } from "@/classes/helpers/MoodHelper.js";
import _ from "lodash";

export class Character {
  map = null;
  phrase = null;
  victory = false;
  defeat = false;
  picture = null;
  moodHelper = new MoodHelper();
  mood = "default";
  health = 20;
  attackLock = false;

  hitSound = new Audio("/music/hit.wav");
  destroyedSound = new Audio("/music/hit.wav");
  missedSound = new Audio("/music/missed.mp3");

  constructor(name) {
    this.name = name;
    this.map = new Map();
    this.fleet = new Fleet();
    this.hitSound.volume = 0.7;
  }

  reset() {
    this.map = new Map();
    this.fleet = new Fleet();
    this.health = 20;
    this.victory = false;
    this.defeat = false;
    this.attackLock = false;
    this.mood = "default";
  }

  setName(name) {
    this.name = name;
  }

  attack(target, x, y) {
    var hit = target.map.boatMap[y - 1][x - 1];

    if (!hit) {
      this.map.hitMap[[y - 1]].splice([x - 1], 1, "missed");
      this.missedSound.play();
      return "MISSED";
    } else {
      if (typeof hit == "number") {
        this.map.hitMap[[y - 1]].splice([x - 1], 1, "hit");
        let hitBoat = _.find(target.fleet.boats, { id: hit });
        hitBoat.hit();
        target.health--;
        if (hitBoat.destroyed) {
          let aliveBoats = _.find(target.fleet.boats, { destroyed: false });
          this.destroyedSound.play();
          if (!aliveBoats) {
            this.victory = true;
            target.defeat = true;
            return "ENDGAME";
          } else {
            return "DESTROYED";
          }
        } else {
          this.hitSound.play();
          return "HIT";
        }
      }
    }
  }

  setMoodAttacking(attackResult) {
    this.mood = this.moodHelper.getMoodAttacking(attackResult);
  }

  setMoodAttacked(attackResult) {
    this.mood = this.moodHelper.getMoodAttacked(attackResult);
  }

  setDefaultMood() {
    this.mood = "default";
  }
}
