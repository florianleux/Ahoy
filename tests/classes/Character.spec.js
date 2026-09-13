import { describe, it, expect } from "vitest";
import { Character } from "@/classes/Character.js";
import { Boat } from "@/classes/Boat.js";

// Puts a boat of the given size on the target's grid, starting at (x, y) and
// going right, and makes it the target's whole fleet when `alone` is set.
const placeBoat = (character, { size, x, y, id = 1, alone = false }) => {
  const boat = new Boat(size, id);

  for (let i = 0; i < size; i++) {
    character.map.boatMap[y - 1][x - 1 + i] = boat.id;
    boat.coords.push([x - 1 + i, y - 1]);
  }

  character.fleet.boats = alone ? [boat] : [boat, ...character.fleet.boats];
  return boat;
};

describe("Character", () => {
  it("starts with a full health bar, an empty map and a fleet", () => {
    const character = new Character("Barbe Noire");

    expect(character.name).toBe("Barbe Noire");
    expect(character.health).toBe(20);
    expect(character.fleet.boats).toHaveLength(5);
    expect(character.map.boatMap.flat().every(cell => cell === false)).toBe(
      true
    );
  });

  it("records a miss on its own hit map without touching the target", () => {
    const attacker = new Character("attaquant");
    const target = new Character("cible");

    const result = attacker.attack(target, 3, 4);

    expect(result).toBe("MISSED");
    expect(attacker.map.hitMap[3][2]).toBe("missed");
    expect(target.health).toBe(20);
  });

  it("records a hit, damages the boat and drops the target's health", () => {
    const attacker = new Character("attaquant");
    const target = new Character("cible");
    const boat = placeBoat(target, { size: 3, x: 5, y: 5 });

    const result = attacker.attack(target, 5, 5);

    expect(result).toBe("HIT");
    expect(attacker.map.hitMap[4][4]).toBe("hit");
    expect(target.health).toBe(19);
    expect(boat.hp).toBe(2);
    expect(boat.destroyed).toBe(false);
  });

  it("reports a destroyed boat once its last square is hit", () => {
    const attacker = new Character("attaquant");
    const target = new Character("cible");
    const boat = placeBoat(target, { size: 2, x: 5, y: 5 });

    expect(attacker.attack(target, 5, 5)).toBe("HIT");
    expect(attacker.attack(target, 6, 5)).toBe("DESTROYED");

    expect(boat.destroyed).toBe(true);
    expect(target.health).toBe(18);
    expect(attacker.victory).toBe(false);
    expect(target.defeat).toBe(false);
  });

  it("ends the game when the target has no boat left afloat", () => {
    const attacker = new Character("attaquant");
    const target = new Character("cible");
    placeBoat(target, { size: 2, x: 1, y: 1, alone: true });

    expect(attacker.attack(target, 1, 1)).toBe("HIT");
    expect(attacker.attack(target, 2, 1)).toBe("ENDGAME");

    expect(attacker.victory).toBe(true);
    expect(target.defeat).toBe(true);
  });

  it("attacks the two opposite corners of the grid", () => {
    const attacker = new Character("attaquant");
    const target = new Character("cible");

    expect(attacker.attack(target, 1, 1)).toBe("MISSED");
    expect(attacker.attack(target, 10, 10)).toBe("MISSED");

    expect(attacker.map.hitMap[0][0]).toBe("missed");
    expect(attacker.map.hitMap[9][9]).toBe("missed");
  });

  it("goes back to a pristine state on reset", () => {
    const character = new Character("cible");
    character.health = 4;
    character.victory = true;
    character.defeat = true;
    character.attackLock = true;
    character.mood = "joy";
    character.map.hitMap[0][0] = "hit";

    character.reset();

    expect(character.health).toBe(20);
    expect(character.victory).toBe(false);
    expect(character.defeat).toBe(false);
    expect(character.attackLock).toBe(false);
    expect(character.mood).toBe("default");
    expect(character.map.hitMap[0][0]).toBe(false);
    expect(character.fleet.boats).toHaveLength(5);
  });

  it("shows the mood matching the outcome, on both sides of the attack", () => {
    const character = new Character("cible");

    character.setMoodAttacking("HIT");
    expect(character.mood).toBe("joy");
    character.setMoodAttacking("MISSED");
    expect(character.mood).toBe("despair");
    character.setMoodAttacking("DESTROYED");
    expect(character.mood).toBe("mocking");

    character.setMoodAttacked("MISSED");
    expect(character.mood).toBe("mocking");
    character.setMoodAttacked("HIT");
    expect(character.mood).toBe("despair");

    character.setDefaultMood();
    expect(character.mood).toBe("default");
  });
});
