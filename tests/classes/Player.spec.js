import { describe, it, expect } from "vitest";
import { Player } from "@/classes/Player";
import { PlayerProfileHelper } from "@/classes/helpers/PlayerProfileHelper";

describe("Player", () => {
  it("is a character who owns an identity, a catchphrase and the first turn", () => {
    const player = new Player("Anne Bonny", "female");

    expect(player.name).toBe("Anne Bonny");
    expect(player.identity).toBe("female");
    expect(player.turn).toBe(true);
    expect(player.enemy).toBeNull();
    expect(player.health).toBe(20);
    expect(player.fleet.boats).toHaveLength(5);
    expect(new PlayerProfileHelper().phrasesList).toContain(player.phrase);
  });

  it("keeps its identity and enemy across a reset", () => {
    const player = new Player("Anne Bonny", "female");
    player.enemy = { name: "ennemi" };
    player.health = 2;

    player.reset();

    expect(player.health).toBe(20);
    expect(player.identity).toBe("female");
    expect(player.enemy).toEqual({ name: "ennemi" });
  });
});
