import { describe, it, expect, beforeEach } from "vitest";
import { reactive } from "vue";
import { Game } from "@/classes/Game.js";

// The two things the reactive root has to keep true. Both broke silently under
// a naive port: a proxied boat compared against a raw one never matches, and
// the old save wrote the whole object graph while reading back three fields.
describe("the reactive root", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps boat selection working through the proxy", () => {
    const game = reactive(new Game());
    game.newGame("Barbe Rousse", "male");

    const fleet = game.player.fleet;
    const boat = fleet.boats[2];

    fleet.selectBoat(boat);

    // selectBoat compares by reference. Reading the boat back out of the proxy
    // has to yield the same identity it was handed, or selection silently
    // selects nothing.
    expect(fleet.selectedBoat).toBe(boat);
    expect(boat.selected).toBe(true);
    expect(fleet.boats.filter(b => b.selected)).toHaveLength(1);

    // Selecting another one moves the selection rather than adding to it.
    const other = fleet.boats[4];
    fleet.selectBoat(other);
    expect(fleet.selectedBoat).toBe(other);
    expect(boat.selected).toBe(false);
  });

  it("round-trips a save through the flat format", () => {
    const game = reactive(new Game());
    game.newGame("Anne Bonny", "female");
    game.nextLevel();

    expect(JSON.parse(localStorage.ahoyGame)).toEqual({
      name: "Anne Bonny",
      identity: "female",
      level: 1
    });

    const reloaded = reactive(new Game());
    reloaded.loadGame(Game.readSave());

    expect(reloaded.player.name).toBe("Anne Bonny");
    expect(reloaded.player.identity).toBe("female");
    expect(reloaded.level).toBe(1);
    expect(reloaded.player.enemy).toBe(reloaded.enemyList[1]);
  });

  it("refuses a save it cannot use instead of throwing", () => {
    expect(Game.readSave()).toBeNull();

    localStorage.ahoyGame = "not json at all";
    expect(Game.readSave()).toBeNull();

    // The shape the previous version wrote: the whole Game, with the name
    // nested under player.
    localStorage.ahoyGame = JSON.stringify({
      player: { name: "Barbe Rousse", identity: "male" },
      level: 2,
      round: 0
    });
    expect(Game.readSave()).toBeNull();
  });
});
