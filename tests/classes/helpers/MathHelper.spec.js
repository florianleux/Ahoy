import { describe, it, expect } from "vitest";
import { MathHelper } from "@/classes/helpers/MathHelper";

describe("MathHelper", () => {
  it("draws an integer between 0 and the given max, both included", () => {
    const helper = new MathHelper();
    const drawn = new Set();

    for (let run = 0; run < 500; run++) {
      const value = helper.getRandomIntMax(3);

      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(3);
      drawn.add(value);
    }

    // Both bounds must actually come up: PlayerProfileHelper relies on the max
    // being reachable to ever return its last phrase.
    expect(drawn.has(0)).toBe(true);
    expect(drawn.has(3)).toBe(true);
  });
});
