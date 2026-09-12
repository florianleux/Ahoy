import { describe, it, expect } from "vitest";
import { Boat } from "@/classes/Boat.js";

describe("Boat", () => {
  it("starts with hp equal to its size", () => {
    const boat = new Boat(4, 1);

    expect(boat.size).toBe(4);
    expect(boat.hp).toBe(4);
    expect(boat.destroyed).toBe(false);
  });

  it("is destroyed once every square has been hit", () => {
    const boat = new Boat(2, 1);

    boat.hit();
    expect(boat.hp).toBe(1);
    expect(boat.destroyed).toBe(false);

    boat.hit();
    expect(boat.hp).toBe(0);
    expect(boat.destroyed).toBe(true);
  });

  it("cannot be selected while disabled", () => {
    const boat = new Boat(3, 1);

    boat.disable();
    boat.select();
    expect(boat.selected).toBe(false);

    boat.enable();
    boat.select();
    expect(boat.selected).toBe(true);
  });
});
