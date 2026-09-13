import { describe, it, expect } from "vitest";
import { MoodHelper } from "@/classes/helpers/MoodHelper";

describe("MoodHelper", () => {
  it("maps each outcome to the mood of the attacker", () => {
    const helper = new MoodHelper();

    expect(helper.getMoodAttacking("MISSED")).toBe("despair");
    expect(helper.getMoodAttacking("HIT")).toBe("joy");
    expect(helper.getMoodAttacking("DESTROYED")).toBe("mocking");
  });

  it("maps each outcome to the mood of the one being attacked", () => {
    const helper = new MoodHelper();

    expect(helper.getMoodAttacked("MISSED")).toBe("mocking");
    expect(helper.getMoodAttacked("HIT")).toBe("despair");
    expect(helper.getMoodAttacked("DESTROYED")).toBe("despair");
  });
});
