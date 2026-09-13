import { describe, it, expect } from "vitest";
import { Z } from "@/classes/enemies/Z/Z";
import { Character } from "@/classes/Character";

describe("Z", () => {
  it("declares a literal class name and its refloating power", () => {
    const z = new Z();

    expect(z.className).toBe("Z");
    // Now a message key, like every other text the classes carry.
    expect(z.mainPower.name).toBe("z_main_power_name");
    expect(z.mainPower.type).toBe("actif");
  });

  it("refloats a sunk boat somewhere else and gets its health back", () => {
    const z = new Z();
    const player = new Character("joueur");
    const boat = z.fleet.boats[0];

    // Sink the boat where it was placed, and mark the player's hits on it.
    for (let i = 0; i < boat.size; i++) {
      boat.coords.push([i, 0]);
      z.map.boatMap[0][i] = boat.id;
      player.map.hitMap[0][i] = "hit";
    }
    boat.hp = 0;
    boat.destroyed = true;
    const healthBefore = z.health;

    z.healBoat(boat, player);

    expect(boat.destroyed).toBe(false);
    expect(boat.hp).toBe(boat.size);
    expect(z.health).toBe(healthBefore + boat.size);
    expect(boat.coords).toHaveLength(boat.size);
    // The player loses the marks that betrayed the old position.
    expect(player.map.hitMap[0].slice(0, boat.size)).toEqual(
      Array(boat.size).fill("missed")
    );
    // And the boat is back on Z's grid, at its new coordinates.
    for (const [x, y] of boat.coords) {
      expect(z.map.boatMap[y][x]).toBe(boat.id);
    }
  });
});
