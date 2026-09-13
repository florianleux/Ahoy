import { describe, it, expect, vi } from "vitest";
import { SimpleSam } from "@/classes/enemies/SimpleSam/SimpleSam";
import { SimpleSamFleet } from "@/classes/enemies/SimpleSam/SimpleSamFleet";

describe("SimpleSam", () => {
  it("declares a literal class name and i18n keys, never translated text", () => {
    const sam = new SimpleSam();

    // Game._enemyTurn() dispatches on className: it must survive minification,
    // which constructor.name does not.
    expect(sam.className).toBe("SimpleSam");
    expect(sam.name).toBe("ss_name");
    expect(sam.phrase).toBe("ss_phrase");
    expect(sam.nature).toBe("ss_nature");
  });

  it("sails its own fleet and carries one main plus one secondary power", () => {
    const sam = new SimpleSam();

    expect(sam.fleet).toBeInstanceOf(SimpleSamFleet);
    expect(sam.mainPower.name).toBe("ss_main_power_name");
    expect(sam.secondaryPowers).toHaveLength(1);
    expect(sam.secondaryPowers[0].name).toBe("ss_secondary_power_name");
  });

  it("fires purely at random, ignoring the cross search", () => {
    const sam = new SimpleSam();
    const randomHit = vi.spyOn(sam, "_randomHit").mockReturnValue([3, 8]);
    // Even with a fresh hit to chase, Sam keeps drawing at random.
    sam.firstHit = [5, 5];
    sam.hitStrike = 1;

    expect(sam._strategy()).toEqual([3, 8]);
    expect(randomHit).toHaveBeenCalled();
  });
});
