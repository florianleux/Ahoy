import { describe, it, expect, vi } from "vitest";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper.js";

describe("PlayerProfileHelper", () => {
  it("picks a catchphrase from its own list", () => {
    const helper = new PlayerProfileHelper();
    vi.spyOn(helper.mathHelper, "getRandomIntMax").mockReturnValue(2);

    expect(helper.getPhrase()).toBe(helper.phrasesList[2]);
  });

  it("can reach the last phrase of the list", () => {
    const helper = new PlayerProfileHelper();
    const lastIndex = helper.phrasesList.length - 1;
    vi.spyOn(helper.mathHelper, "getRandomIntMax").mockReturnValue(lastIndex);

    expect(helper.getPhrase()).toBe(helper.phrasesList[lastIndex]);
  });
});
