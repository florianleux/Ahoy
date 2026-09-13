import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Enemy } from "@/classes/Enemy";
import { Character } from "@/classes/Character";

// The enemy shuffles its search directions on construction; pinning them makes
// the cross search readable without changing a line of production code.
const enemyFacing = direction => {
  const enemy = new Enemy("ennemi");
  enemy.direction = [direction, "UP", "DOWN", "LEFT"];
  enemy.directionIndex = 0;
  return enemy;
};

describe("Enemy", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("draws random coordinates until it finds a square it has not hit", () => {
    const enemy = new Enemy("ennemi");
    enemy.map.hitMap[0][0] = "missed";
    // First draw lands on the already-hit (1,1), the second one on (2,3).
    vi.spyOn(enemy, "_getRandomInt")
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3);

    expect(enemy._randomHit()).toEqual([2, 3]);
  });

  it("searches at random while nothing has been hit", () => {
    const enemy = new Enemy("ennemi");
    const randomHit = vi.spyOn(enemy, "_randomHit").mockReturnValue([7, 7]);

    expect(enemy._strategy()).toEqual([7, 7]);
    expect(randomHit).toHaveBeenCalled();
  });

  it("aims next to its first hit once it has touched something", () => {
    const enemy = enemyFacing("RIGHT");

    enemy._postAttack(5, 5, "HIT");
    expect(enemy.firstHit).toEqual([5, 5]);
    expect(enemy.hitStrike).toBe(1);

    expect(enemy._strategy()).toEqual([6, 5]);
  });

  it("keeps going in the same direction while it keeps hitting", () => {
    const enemy = enemyFacing("RIGHT");

    enemy._postAttack(5, 5, "HIT");
    enemy._postAttack(6, 5, "HIT");

    expect(enemy.hitStrike).toBe(2);
    expect(enemy._strategy()).toEqual([7, 5]);
  });

  it("turns to the next direction after a miss", () => {
    const enemy = enemyFacing("RIGHT");

    enemy._postAttack(5, 5, "HIT");
    enemy._postAttack(6, 5, "MISSED");

    expect(enemy.directionIndex).toBe(1);
    expect(enemy.hitStrike).toBe(1);
    expect(enemy.firstHit).toEqual([5, 5]);
  });

  it("turns away rather than aiming off the grid", () => {
    const enemy = enemyFacing("RIGHT");
    enemy.firstHit = [10, 5];
    enemy.hitStrike = 1;

    expect(enemy._strategy()).toBe(false);
    expect(enemy.directionIndex).toBe(1);
  });

  it("turns away rather than aiming at a square it already hit", () => {
    const enemy = enemyFacing("RIGHT");
    enemy.firstHit = [5, 5];
    enemy.hitStrike = 1;
    enemy.map.hitMap[4][5] = "missed";

    expect(enemy._strategy()).toBe(false);
    expect(enemy.directionIndex).toBe(1);
  });

  it("gives up the cross search once every direction has failed", () => {
    const enemy = enemyFacing("RIGHT");
    enemy.firstHit = [5, 5];
    enemy.hitStrike = 1;
    // Last direction of the list (LEFT), aiming at an already-hit square.
    enemy.directionIndex = 3;
    enemy.map.hitMap[4][3] = "missed";

    enemy._strategy();

    expect(enemy.firstHit).toBeNull();
    expect(enemy.hitStrike).toBe(0);
    expect(enemy.directionIndex).toBe(0);
  });

  it("drops the cross search as soon as the boat sinks", () => {
    const enemy = enemyFacing("RIGHT");
    enemy._postAttack(5, 5, "HIT");

    enemy._postAttack(6, 5, "DESTROYED");

    expect(enemy.firstHit).toBeNull();
    expect(enemy.hitStrike).toBe(0);
    expect(enemy.directionIndex).toBe(0);
  });

  it("attacks through the strategy and remembers where it fired", () => {
    const enemy = new Enemy("ennemi");
    const target = new Character("cible");
    vi.spyOn(enemy, "_strategy").mockReturnValue([4, 6]);

    const result = enemy.generateAttack(target);

    expect(result).toBe("MISSED");
    expect(enemy.lastHit).toEqual([4, 6]);
    expect(enemy.map.hitMap[5][3]).toBe("missed");
  });

  it("shows its attack message, then clears it after a delay", () => {
    const enemy = new Enemy("ennemi");
    const target = new Character("cible");

    enemy.attack(target, 2, 2);
    expect(enemy.attackMessage).toBe("A l'eau !");

    vi.advanceTimersByTime(1500);
    expect(enemy.attackMessage).toBe(false);
  });

  it("skips the message timer and the cross search when postAttack is off", () => {
    const enemy = new Enemy("ennemi");
    const target = new Character("cible");

    enemy.attack(target, 2, 2, false);

    expect(enemy.lastHit).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
