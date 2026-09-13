import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Game } from "@/classes/Game";

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
    expect(JSON.parse(localStorage.ahoyGame).name).toBe("Anne Bonny");
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

  describe("the player's turn", () => {
    it("refuses a shot while the player's map is locked", () => {
      const game = gameAtLevel(0);
      game.player.attackLock = true;

      const result = game.playerAttack(3, 4);

      expect(result).toBeNull();
      expect(game.player.map.hitMap[3][2]).toBe(false);
    });

    it("refuses a shot outside the player's turn", () => {
      const game = gameAtLevel(0);
      game.player.turn = false;

      const result = game.playerAttack(3, 4);

      expect(result).toBeNull();
      expect(game.player.map.hitMap[3][2]).toBe(false);
    });

    it("refuses a second shot on a square already played", () => {
      const game = gameAtLevel(0);
      game.player.map.hitMap[3][2] = "missed";

      const result = game.playerAttack(3, 4);

      expect(result).toBeNull();
      expect(game.player.attackLock).toBe(false);
    });

    it("locks the map, fires and dresses both sides' moods", () => {
      const game = gameAtLevel(0);
      const enemy = game.player.enemy;
      enemy.map.boatMap[3][2] = 1;

      const result = game.playerAttack(3, 4);

      expect(result).toBe("HIT");
      expect(game.player.attackLock).toBe(true);
      expect(game.player.map.hitMap[3][2]).toBe("hit");
      expect(game.player.mood).toBe("joy");
      expect(enemy.mood).toBe("despair");
    });

    it("holds the shot on screen before handing the turn back", () => {
      const game = gameAtLevel(0);
      game.player.enemy.map.boatMap[3][2] = 1;
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      game.playerAttack(3, 4);

      vi.advanceTimersByTime(1199);
      expect(game.player.mood).toBe("joy");
      expect(nextRound).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(game.player.mood).toBe("default");
      expect(game.player.enemy.mood).toBe("default");
      expect(nextRound).toHaveBeenCalled();
    });

    it("dispatches the player's reaction on className, not on the constructor", () => {
      // Same rule as the enemy turn: the production build mangles
      // constructor.name, so renaming className must change the branch taken.
      const game = gameAtLevel(3);
      const brigitte = game.player.enemy;
      brigitte.className = "SomethingElse";
      brigitte.map.boatMap[3][2] = 1;
      brigitte.fleet.boats[0].hp = 1;
      brigitte.fleet.boats[0].doomed = true;
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      game.playerAttack(3, 4);

      // The doomed boat's power never runs: the generic reaction just hands the
      // turn back, leaving the player's fleet untouched.
      vi.advanceTimersByTime(1200);
      expect(game.player.fleet.boats.some(boat => boat.destroyed)).toBe(false);
      expect(nextRound).toHaveBeenCalled();
    });

    // The enemy fleet is laid out by the placement screen, so a spec that wants
    // a boat sunk in one shot puts it on the board itself.
    const sinkableBoatAt = (enemy, x, y) => {
      const boat = enemy.fleet.boats[0];
      boat.hp = 1;
      boat.coords = [[x - 1, y - 1]];
      enemy.map.boatMap[y - 1][x - 1] = boat.id;
      return boat;
    };

    it("sinks one of the player's boats with Maman Brigitte's doomed boat", () => {
      const game = gameAtLevel(3);
      const brigitte = game.player.enemy;
      brigitte.fleet.boats.forEach(boat => (boat.doomed = false));
      sinkableBoatAt(brigitte, 3, 4).doomed = true;
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      expect(game.playerAttack(3, 4)).toBe("DESTROYED");

      vi.advanceTimersByTime(499);
      expect(game.player.fleet.boats.some(boat => boat.destroyed)).toBe(false);

      vi.advanceTimersByTime(1);
      const sunk = game.player.fleet.boats.filter(boat => boat.destroyed);
      expect(sunk).toHaveLength(1);
      expect(sunk[0].hp).toBe(0);
      expect(nextRound).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1200);
      expect(nextRound).toHaveBeenCalled();
    });

    it("hands the turn back when one of Maman Brigitte's other boats sinks", () => {
      const game = gameAtLevel(3);
      const brigitte = game.player.enemy;
      brigitte.fleet.boats.forEach(boat => (boat.doomed = false));
      sinkableBoatAt(brigitte, 3, 4);
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      expect(game.playerAttack(3, 4)).toBe("DESTROYED");

      vi.advanceTimersByTime(1200);
      expect(game.player.fleet.boats.some(boat => boat.destroyed)).toBe(false);
      expect(nextRound).toHaveBeenCalled();
    });

    it("lets Chisana Kaizoku shoot back at the square just played", () => {
      const game = gameAtLevel(1);
      const chisana = game.player.enemy;
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const counterShot = vi.spyOn(chisana, "attack");
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      expect(game.playerAttack(3, 4)).toBe("MISSED");

      vi.advanceTimersByTime(1200);
      expect(counterShot).toHaveBeenCalledWith(game.player, 3, 4, false);
      expect(nextRound).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500 + 1200);
      expect(nextRound).toHaveBeenCalled();
    });

    it("lets Chisana Kaizoku miss its chance to shoot back", () => {
      const game = gameAtLevel(1);
      const chisana = game.player.enemy;
      vi.spyOn(Math, "random").mockReturnValue(0.49);
      const counterShot = vi.spyOn(chisana, "attack");
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      game.playerAttack(3, 4);

      vi.advanceTimersByTime(1200);
      expect(counterShot).not.toHaveBeenCalled();
      expect(nextRound).toHaveBeenCalled();
    });

    it("lets Z heal the boat the player just sank", () => {
      const game = gameAtLevel(4);
      const z = game.player.enemy;
      const boat = sinkableBoatAt(z, 3, 4);
      const heal = vi.spyOn(z, "healBoat").mockImplementation(() => {});
      const nextRound = vi
        .spyOn(game, "nextRound")
        .mockImplementation(() => {});

      expect(game.playerAttack(3, 4)).toBe("DESTROYED");

      vi.advanceTimersByTime(1200);
      expect(nextRound).toHaveBeenCalled();
      expect(heal).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(heal).toHaveBeenCalledWith(boat, game.player);
    });

    it("leaves Z's fleet alone when the shot only hits", () => {
      const game = gameAtLevel(4);
      const z = game.player.enemy;
      z.map.boatMap[3][2] = 1;
      const heal = vi.spyOn(z, "healBoat").mockImplementation(() => {});
      vi.spyOn(game, "nextRound").mockImplementation(() => {});

      expect(game.playerAttack(3, 4)).toBe("HIT");

      vi.advanceTimersByTime(1500);
      expect(heal).not.toHaveBeenCalled();
    });

    it("really hands the turn to the enemy at the end of the beat", () => {
      // The other specs stub nextRound to keep the cascade still; this one lets
      // it run so the handover itself is observed rather than its call.
      const game = gameAtLevel(0);
      vi.spyOn(game, "_enemyTurn").mockImplementation(() => {});

      game.playerAttack(3, 4);
      vi.advanceTimersByTime(1200);

      expect(game.player.turn).toBe(false);
      expect(game.player.enemy.turn).toBe(true);
      expect(game.round).toBe(1);
    });
  });
});
