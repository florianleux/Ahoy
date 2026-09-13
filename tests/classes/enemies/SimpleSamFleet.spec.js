import { describe, it, expect } from "vitest";
import { SimpleSamFleet } from "@/classes/enemies/SimpleSam/SimpleSamFleet.js";

describe("SimpleSamFleet", () => {
  it("lines up five identical boats instead of the default increasing sizes", () => {
    const fleet = new SimpleSamFleet();

    expect(fleet.boats).toHaveLength(5);
    expect(fleet.boats.map(boat => boat.size)).toEqual([4, 4, 4, 4, 4]);
    expect(fleet.boats.map(boat => boat.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
