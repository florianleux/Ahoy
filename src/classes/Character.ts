import { Fleet } from "@/classes/Fleet";
import { Map } from "@/classes/Map";
import { MoodHelper } from "@/classes/helpers/MoodHelper";
import { audioManager } from "@/utils/AudioManager";
import type { AttackResult, Mood } from "@/classes/types";

export class Character {
  name: string;
  map: Map;
  fleet: Fleet;
  phrase: string | null = null;
  victory = false;
  defeat = false;
  moodHelper = new MoodHelper();
  mood: Mood = "default";
  health = 20;
  attackLock = false;

  constructor(name: string) {
    this.name = name;
    this.map = new Map();
    this.fleet = new Fleet();
  }

  reset(): void {
    this.map = new Map();
    this.fleet = new Fleet();
    this.health = 20;
    this.victory = false;
    this.defeat = false;
    this.attackLock = false;
    this.mood = "default";
  }

  setName(name: string): void {
    this.name = name;
  }

  attack(target: Character, x: number, y: number): AttackResult {
    const hit = target.map.boatMap[y - 1][x - 1];

    // A square in boatMap holds a boat id or nothing, so anything truthy is a
    // hit. The old code tested typeof hit === "number" and fell off the end
    // when that failed, returning undefined from a function every caller
    // treated as a result.
    if (!hit) {
      this.map.hitMap[y - 1][x - 1] = "missed";
      audioManager.playSound("missed");
      return "MISSED";
    }

    this.map.hitMap[y - 1][x - 1] = "hit";
    const hitBoat = target.fleet.boats.find(boat => boat.id === hit);
    if (!hitBoat) {
      return "MISSED";
    }

    hitBoat.hit();
    target.health--;

    if (!hitBoat.destroyed) {
      audioManager.playSound("hit");
      return "HIT";
    }

    audioManager.playSound("destroyed");
    const stillAfloat = target.fleet.boats.some(boat => !boat.destroyed);
    if (!stillAfloat) {
      this.victory = true;
      target.defeat = true;
      return "ENDGAME";
    }
    return "DESTROYED";
  }

  setMoodAttacking(attackResult: AttackResult): void {
    this.mood = this.moodHelper.getMoodAttacking(attackResult);
  }

  setMoodAttacked(attackResult: AttackResult): void {
    this.mood = this.moodHelper.getMoodAttacked(attackResult);
  }

  setDefaultMood(): void {
    this.mood = "default";
  }
}
