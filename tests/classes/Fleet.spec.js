import { describe, it, expect } from "vitest";
import { Fleet } from "@/classes/Fleet";

describe("Fleet", () => {
  it("is populated with 5 boats of increasing size", () => {
    const fleet = new Fleet();

    expect(fleet.boats).toHaveLength(5);
    expect(fleet.boats.map(boat => boat.size)).toEqual([2, 3, 4, 5, 6]);
    expect(fleet.boats.map(boat => boat.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it("unselects the previous boat when another one is selected", () => {
    const fleet = new Fleet();
    const [first, second] = fleet.boats;

    fleet.selectBoat(first);
    expect(first.selected).toBe(true);

    fleet.selectBoat(second);
    expect(first.selected).toBe(false);
    expect(second.selected).toBe(true);
    expect(fleet.selectedBoat).toBe(second);
  });

  it("clears the selection when passed null", () => {
    const fleet = new Fleet();
    const [first] = fleet.boats;

    fleet.selectBoat(first);
    fleet.selectBoat(null);

    expect(first.selected).toBe(false);
    expect(fleet.selectedBoat).toBeNull();
  });
});
