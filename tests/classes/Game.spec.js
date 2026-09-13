import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Game } from "@/classes/Game.js";

const startedGame = () => {
  const game = new Game();
  game.newGame("Anne Bonny", "female");
  return game;
};

// The enemy's thinking time is drawn at random; pinning it lets a test walk the
// cascade of nested timeouts one beat at a time instead of jumping to the end.
const gameAtLevel = level => {
  const game = startedGame();
  game.level = level;
  game.player.enemy = game.enemyList[level];
  vi.spyOn(game, "_randomDelay").mockReturnValue(1000);
  return game;
};

describe("Game", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("lines up the five enemies in level order", () => {
    const game = new Game();

    expect(game.enemyList.map(enemy => enemy.className)).toEqual([
      "SimpleSam",
      "ChisanaKaizoku",
      "JackTheBurned",
      "MamanBrigitte",
      "Z"
    ]);
  });

  it("starts a new game against the first enemy and saves it", () => {
    const game = startedGame();

    expect(game.player.name).toBe("Anne Bonny");
    expect(game.player.identity).toBe("female");
    expect(game.player.enemy).toBe(game.enemyList[0]);
    expect(game.level).toBe(0);
    expect(JSON.parse(localStorage.ahoyGame).player.name).toBe("Anne Bonny");
  });

  it("moves on to the next enemy, resets the player and gives them the turn", () => {
    const game = startedGame();
    game.round = 7;
    game.player.health = 3;
    game.player.turn = false;
    game.player.enemy.turn = true;

    game.nextLevel();

    expect(game.level).toBe(1);
    expect(game.round).toBe(0);
    expect(game.player.health).toBe(20);
    expect(game.player.turn).toBe(true);
    expect(game.player.enemy).toBe(game.enemyList[1]);
    expect(game.player.enemy.turn).toBe(false);
    expect(JSON.parse(localStorage.ahoyGame).level).toBe(1);
  });

  it("replays the same level after a defeat, resetting both sides", () => {
    const game = startedGame();
    game.round = 12;
    game.player.health = 1;
    game.player.enemy.health = 4;
    game.player.turn = false;

    game.rerun();

    expect(game.level).toBe(0);
    expect(game.round).toBe(0);
    expect(game.player.turn).toBe(true);
    expect(game.player.enemy.turn).toBe(false);
    expect(game.player.health).toBe(20);
    expect(game.player.enemy.health).toBe(20);
  });

  it("hands the turn over and counts the round", () => {
    const game = startedGame();
    const enemyTurn = vi.spyOn(game, "_enemyTurn").mockImplementation(() => {});

    game.nextRound();

    expect(game.player.turn).toBe(false);
    expect(game.player.enemy.turn).toBe(true);
    expect(game.round).toBe(1);
    expect(enemyTurn).toHaveBeenCalled();
  });

  it("leaves a defeated enemy alone instead of playing its turn", () => {
    const game = startedGame();
    const enemyTurn = vi.spyOn(game, "_enemyTurn").mockImplementation(() => {});
    game.player.enemy.defeat = true;

    game.nextRound();

    expect(game.player.enemy.turn).toBe(true);
    expect(enemyTurn).not.toHaveBeenCalled();
  });

  it("dispatches the enemy turn on className, not on the constructor", () => {
    // className is a literal on purpose: constructor.name is mangled by the
    // production build. Renaming it here must change the branch taken.
    const game = startedGame();
    const defaultTurn = vi
      .spyOn(game, "_defaultEnemyTurn")
      .mockImplementation(() => {});
    game.enemyList[0].className = "SomethingElse";

    game._enemyTurn();

    expect(defaultTurn).toHaveBeenCalled();
  });

  it("plays Simple Sam's turn again when he hits, and his power with it", () => {
    const game = gameAtLevel(0);
    const sam = game.player.enemy;
    vi.spyOn(sam, "generateAttack").mockReturnValue("HIT");
    const power = vi.spyOn(sam.mainPower, "activate");
    const nextRound = vi.spyOn(game, "nextRound").mockImplementation(() => {});

    game._enemyTurn();

    vi.advanceTimersByTime(1000);
    expect(sam.mood).toBe("joy");
    expect(game.player.mood).toBe("despair");
    expect(power).not.toHaveBeenCalled();

    vi.advanceTimersByTime(800);
    expect(sam.mood).toBe("default");
    expect(game.player.mood).toBe("default");
    expect(power).toHaveBeenCalled();
    expect(nextRound).not.toHaveBeenCalled();
  });

  it("ends Simple Sam's turn when he misses", () => {
    const game = gameAtLevel(0);
    const sam = game.player.enemy;
    vi.spyOn(sam, "generateAttack").mockReturnValue("MISSED");
    const power = vi.spyOn(sam.mainPower, "activate");
    const nextRound = vi.spyOn(game, "nextRound").mockImplementation(() => {});

    game._enemyTurn();

    vi.advanceTimersByTime(1000);
    expect(nextRound).not.toHaveBeenCalled();

    vi.advanceTimersByTime(800);
    expect(power).not.toHaveBeenCalled();
    expect(nextRound).toHaveBeenCalled();
  });

  it("lets Jack fire a second time when his power comes up", () => {
    const game = gameAtLevel(2);
    const jack = game.player.enemy;
    vi.spyOn(jack, "generateAttack").mockReturnValue("HIT");
    const activate = vi.spyOn(jack, "activatePower").mockReturnValue(true);
    const fire = vi.spyOn(jack, "fire").mockImplementation(() => {});
    const nextRound = vi.spyOn(game, "nextRound").mockImplementation(() => {});
    jack.lastHit = [4, 4];

    game._enemyTurn();

    vi.advanceTimersByTime(1000);
    expect(jack.mood).toBe("joy");
    expect(activate).not.toHaveBeenCalled();

    // Second beat: moods go back to normal and the power roll happens, but the
    // extra shot waits on a third timer.
    vi.advanceTimersByTime(600);
    expect(jack.mood).toBe("default");
    expect(activate).toHaveBeenCalled();
    expect(fire).not.toHaveBeenCalled();
    expect(nextRound).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fire).toHaveBeenCalledWith(game.player, 4, 4);
    expect(jack.powerActivated).toBe(true);
    expect(nextRound).toHaveBeenCalled();
  });

  it("lets Jack end his turn when his power stays down", () => {
    const game = gameAtLevel(2);
    const jack = game.player.enemy;
    vi.spyOn(jack, "generateAttack").mockReturnValue("HIT");
    vi.spyOn(jack, "activatePower").mockReturnValue(false);
    const fire = vi.spyOn(jack, "fire").mockImplementation(() => {});
    const nextRound = vi.spyOn(game, "nextRound").mockImplementation(() => {});

    game._enemyTurn();

    vi.advanceTimersByTime(1000 + 600);
    expect(nextRound).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fire).not.toHaveBeenCalled();
    expect(jack.powerActivated).toBe(false);
    expect(nextRound).toHaveBeenCalled();
  });

  it("plays a plain turn for the enemies with no special case", () => {
    const game = gameAtLevel(4);
    const z = game.player.enemy;
    vi.spyOn(z, "generateAttack").mockReturnValue("HIT");
    const nextRound = vi.spyOn(game, "nextRound").mockImplementation(() => {});

    game._enemyTurn();
    vi.advanceTimersByTime(1000);
    expect(z.mood).toBe("joy");
    expect(game.player.mood).toBe("despair");

    vi.advanceTimersByTime(1000);
    expect(z.mood).toBe("default");
    expect(game.player.mood).toBe("default");
    expect(nextRound).toHaveBeenCalled();
  });

  it("unlocks the player's map when the enemy takes its turn", () => {
    const game = startedGame();
    game.player.attackLock = true;

    game._enemyTurn();

    expect(game.player.attackLock).toBe(false);
  });

  it("reloads a saved game back to the right player and level", () => {
    const game = startedGame();
    game.nextLevel();
    const saved = JSON.parse(localStorage.ahoyGame);

    const reloaded = new Game();
    reloaded.loadGame(saved);

    expect(reloaded.player.name).toBe("Anne Bonny");
    expect(reloaded.player.identity).toBe("female");
    expect(reloaded.level).toBe(1);
    expect(reloaded.player.enemy).toBe(reloaded.enemyList[1]);
  });

  it("starts the reloaded level from a clean board", () => {
    // Deliberate: the save carries the whole graph but reloading keeps only the
    // player and the level. Resuming mid-battle is out of the migration's scope.
    const game = startedGame();
    game.player.map.hitMap[0][0] = "hit";
    game.player.health = 11;
    game.nextLevel();

    const reloaded = new Game();
    reloaded.loadGame(JSON.parse(localStorage.ahoyGame));

    expect(reloaded.player.health).toBe(20);
    expect(reloaded.player.map.hitMap[0][0]).toBe(false);
  });
});
