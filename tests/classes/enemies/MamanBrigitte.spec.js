import { describe, it, expect } from "vitest";
import { MamanBrigitte } from "@/classes/enemies/MamanBrigitte/MamanBrigitte";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet";

describe("MamanBrigitte", () => {
  it("declares a literal class name and her bound-souls power", () => {
    const brigitte = new MamanBrigitte();

    expect(brigitte.className).toBe("MamanBrigitte");
    // Now a message key, like every other text the classes carry.
    expect(brigitte.mainPower.name).toBe("mb_main_power_name");
    expect(brigitte.mainPower.type).toBe("actif");
  });

  it("sails her own fleet", () => {
    expect(new MamanBrigitte().fleet).toBeInstanceOf(MamanBrigitteFleet);
  });
});
