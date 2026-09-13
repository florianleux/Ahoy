import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JackTheBurned } from "@/classes/enemies/JackTheBurned/JackTheBurned.js";
import { Character } from "@/classes/Character.js";

describe("JackTheBurned", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("declares a literal class name and i18n keys", () => {
    const jack = new JackTheBurned();

    expect(jack.className).toBe("JackTheBurned");
    expect(jack.name).toBe("jtb_name");
    expect(jack.mainPower.name).toBe("jtb_main_power_name");
  });

  it("activates its power above the threshold and not below it", () => {
    const jack = new JackTheBurned();
    const draw = vi.spyOn(jack.mathHelper, "getRandomIntMax");

    draw.mockReturnValue(31);
    expect(jack.activatePower()).toBe(true);

    draw.mockReturnValue(30);
    expect(jack.activatePower()).toBe(false);
  });

  it("fires again on a square next to the one it just hit", () => {
    const jack = new JackTheBurned();
    const target = new Character("cible");
    // First draw picks the direction; the fire itself takes no other draw.
    vi.spyOn(jack.mathHelper, "getRandomIntMax").mockReturnValue(0);

    jack.fire(target, 5, 5);

    expect(jack.map.hitMap[4][5]).toBe("missed");
    expect(jack.lastHit).toEqual([6, 5]);
  });

  it("reads its own hit map with x and y swapped", () => {
    // Frozen on purpose: fire() probes hitMap[posX + 1][posY] while every other
    // read in the codebase is hitMap[y - 1][x - 1]. On an asymmetric target the
    // swap shows: the square it checks is not the square it then fires at.
    // Correcting it is a behaviour change, out of this net's scope.
    const jack = new JackTheBurned();
    const target = new Character("cible");
    vi.spyOn(jack.mathHelper, "getRandomIntMax").mockReturnValue(0);
    // Mark the square fire() probes for a shot to the right of (3, 8).
    jack.map.hitMap[4][8] = "missed";

    jack.fire(target, 3, 8);

    // The probe found the square taken, so it moved on instead of firing right.
    expect(jack.lastHit).not.toEqual([4, 8]);
  });
});
