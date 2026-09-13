import { describe, it, expect } from "vitest";
import { MamanBrigitte } from "@/classes/enemies/MamanBrigitte/MamanBrigitte.js";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet.js";

describe("MamanBrigitte", () => {
  it("declares a literal class name and her bound-souls power", () => {
    const brigitte = new MamanBrigitte();

    expect(brigitte.className).toBe("MamanBrigitte");
    // Hardcoded French rather than an i18n key: known debt, frozen as-is.
    expect(brigitte.mainPower.name).toBe("Âmes liées");
    expect(brigitte.mainPower.type).toBe("actif");
  });

  it("sails her own fleet", () => {
    expect(new MamanBrigitte().fleet).toBeInstanceOf(MamanBrigitteFleet);
  });
});
