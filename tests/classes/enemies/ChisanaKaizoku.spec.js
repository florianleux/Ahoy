import { describe, it, expect } from "vitest";
import { ChisanaKaizoku } from "@/classes/enemies/ChisanaKaizoku/ChisanaKaizoku";
import { Fleet } from "@/classes/Fleet";

describe("ChisanaKaizoku", () => {
  it("declares a literal class name and a counter-attack power", () => {
    const chisana = new ChisanaKaizoku();

    expect(chisana.className).toBe("ChisanaKaizoku");
    // Hardcoded French, unlike Sam and Jack which hold i18n keys: known
    // debt of this enemy, frozen as-is rather than fixed here.
    expect(chisana.mainPower.name).toBe("ck_main_power_name");
    expect(chisana.mainPower.type).toBe("passif");
  });

  it("keeps the default fleet and the default cross search", () => {
    const chisana = new ChisanaKaizoku();
    chisana.direction = ["RIGHT", "UP", "DOWN", "LEFT"];
    chisana.directionIndex = 0;

    expect(chisana.fleet).toBeInstanceOf(Fleet);
    expect(chisana.fleet.boats.map(boat => boat.size)).toEqual([2, 3, 4, 5, 6]);

    chisana._postAttack(5, 5, "HIT");
    expect(chisana._strategy()).toEqual([6, 5]);
  });
});
