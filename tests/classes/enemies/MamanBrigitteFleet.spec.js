import { describe, it, expect } from "vitest";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet.js";

describe("MamanBrigitteFleet", () => {
  it("lines up four boats of five squares", () => {
    const fleet = new MamanBrigitteFleet();

    expect(fleet.boats).toHaveLength(4);
    expect(fleet.boats.map(boat => boat.size)).toEqual([5, 5, 5, 5]);
  });

  it("dooms exactly one boat, whichever the draw picks", () => {
    for (let run = 0; run < 50; run++) {
      const fleet = new MamanBrigitteFleet();

      expect(fleet.boats.filter(boat => boat.doomed)).toHaveLength(1);
    }
  });
});
