import { describe, it, expect } from "vitest";
import { Map } from "@/classes/Map";
import { Fleet } from "@/classes/Fleet";

// The map reads coordinates off a DOM square's dataset; a plain object is enough.
const square = (x, y) => ({ dataset: { x: String(x), y: String(y) } });

const fleetWithSelection = (size, horizontal = true) => {
  const fleet = new Fleet();
  const boat = fleet.boats.find(candidate => candidate.size === size);
  boat.horizontal = horizontal;
  fleet.selectBoat(boat);
  return { fleet, boat };
};

describe("Map", () => {
  it("starts with three empty 10x10 grids", () => {
    const map = new Map();

    for (const grid of [map.boatMap, map.hitMap, map.hoverMap]) {
      expect(grid).toHaveLength(10);
      expect(grid.every(line => line.length === 10)).toBe(true);
      expect(grid.every(line => line.every(cell => cell === false))).toBe(true);
    }
  });

  it("ignores hovering while no boat is selected", () => {
    const map = new Map();

    expect(map.hoverSquare(square(5, 5), new Fleet())).toBe(false);
    expect(map.okClick).toBe(false);
  });

  it("marks the hovered squares of the selected boat and allows the click", () => {
    const map = new Map();
    const { fleet } = fleetWithSelection(2);

    map.hoverSquare(square(5, 5), fleet);

    expect(map.okClick).toBe(true);
    expect(map.hoverMap[4].filter(Boolean)).toHaveLength(2);
    expect(map.hoverMap[4][4]).toBe(true);
    expect(map.hoverMap[4][5]).toBe(true);
  });

  it("wipes the previous hover before drawing the new one", () => {
    const map = new Map();
    const { fleet } = fleetWithSelection(2);

    map.hoverSquare(square(2, 2), fleet);
    map.hoverSquare(square(8, 8), fleet);

    expect(map.hoverMap[1].every(cell => cell === false)).toBe(true);
    expect(map.hoverMap[7].filter(Boolean)).toHaveLength(2);
  });

  it("blocks the click when the boat would run off the grid", () => {
    const map = new Map();
    const { fleet } = fleetWithSelection(6);

    map.hoverSquare(square(1, 1), fleet);

    expect(map.okClick).toBe(false);
  });

  it("blocks the click when the boat would overlap another one", () => {
    const map = new Map();
    const { fleet, boat } = fleetWithSelection(2);

    map.hoverSquare(square(5, 5), fleet);
    map.putBoat(square(5, 5), fleet);

    const second = fleet.boats.find(candidate => candidate !== boat);
    second.horizontal = true;
    fleet.selectBoat(second);
    map.hoverSquare(square(5, 5), fleet);

    expect(map.okClick).toBe(false);
  });

  it("puts the boat on the grid, then disables and deselects it", () => {
    const map = new Map();
    const { fleet, boat } = fleetWithSelection(2);

    map.hoverSquare(square(5, 5), fleet);
    map.putBoat(square(5, 5), fleet);

    expect(map.boatMap[4][4]).toBe(boat.id);
    expect(map.boatMap[4][5]).toBe(boat.id);
    expect(boat.coords).toEqual([
      [4, 4],
      [5, 4]
    ]);
    expect(boat.placed).toBe(true);
    expect(boat.disabled).toBe(true);
    expect(boat.selected).toBe(false);
    expect(fleet.putBoats).toBe(1);
    expect(fleet.selectedBoat).toBeNull();
  });

  it("refuses to put a boat while the click is blocked", () => {
    const map = new Map();
    const { fleet } = fleetWithSelection(6);

    map.hoverSquare(square(1, 1), fleet);

    expect(map.putBoat(square(1, 1), fleet)).toBe(false);
    expect(map.boatMap.flat().every(cell => cell === false)).toBe(true);
    expect(fleet.putBoats).toBe(0);
  });

  it("places boats on the grid corners", () => {
    const map = new Map();
    const { fleet, boat } = fleetWithSelection(2);

    map.hoverSquare(square(1, 1), fleet);
    map.putBoat(square(1, 1), fleet);
    expect(map.boatMap[0][0]).toBe(boat.id);

    // A boat grows downwards from its anchor, so the bottom-right corner is
    // reached by anchoring a 2-square boat one row above it.
    const second = fleet.boats.find(candidate => candidate !== boat);
    second.horizontal = false;
    fleet.selectBoat(second);
    map.hoverSquare(square(10, 9), fleet);
    map.putBoat(square(10, 9), fleet);
    expect(map.boatMap[9][9]).toBe(second.id);
  });

  it("removes a boat, re-enables it and selects it again", () => {
    const map = new Map();
    const { fleet, boat } = fleetWithSelection(2);

    map.hoverSquare(square(5, 5), fleet);
    map.putBoat(square(5, 5), fleet);
    map.removeBoat(boat, fleet);

    expect(map.boatMap.flat().every(cell => cell === false)).toBe(true);
    expect(boat.coords).toEqual([]);
    expect(boat.placed).toBe(false);
    expect(boat.disabled).toBe(false);
    expect(fleet.putBoats).toBe(0);
    expect(fleet.selectedBoat).toBe(boat);
  });

  it("generates a random map with every boat placed and no overlap", () => {
    const map = new Map();
    const fleet = new Fleet();

    map.generateRandomMap(fleet);

    const occupied = map.boatMap.flat().filter(Boolean);
    const totalSize = fleet.boats.reduce((sum, boat) => sum + boat.size, 0);

    expect(occupied).toHaveLength(totalSize);
    expect(fleet.boats.every(boat => boat.coords.length === boat.size)).toBe(
      true
    );
    expect(fleet.boats.map(boat => boat.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps generated coordinates inside the grid, draw after draw", () => {
    // The horizontal branch does not clamp: it relies on drawing a centre that
    // already leaves room for the whole boat. Repeating the draw is what proves
    // the bounds hold, and would catch a change to either the draw or the clamp.
    for (let run = 0; run < 50; run++) {
      const map = new Map();
      const fleet = new Fleet();

      map.generateRandomMap(fleet);

      const coords = fleet.boats.flatMap(boat => boat.coords);
      expect(
        coords.every(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9)
      ).toBe(true);
    }
  });
});
