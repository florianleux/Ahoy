import { Player } from "@/classes/Player";
import { SimpleSam } from "@/classes/enemies/SimpleSam/SimpleSam";
import { JackTheBurned } from "@/classes/enemies/JackTheBurned/JackTheBurned";
import { MamanBrigitte } from "@/classes/enemies/MamanBrigitte/MamanBrigitte";
import { ChisanaKaizoku } from "@/classes/enemies/ChisanaKaizoku/ChisanaKaizoku";
import { Z } from "@/classes/enemies/Z/Z";
import type { Identity } from "@/classes/Player";

// The order is the order of the levels.
export type GameEnemy =
  | SimpleSam
  | ChisanaKaizoku
  | JackTheBurned
  | MamanBrigitte
  | Z;

// Exactly the three fields loadGame reads back.
export interface SavedGame {
  name: string;
  identity: Identity;
  level: number;
}

// The guard the save slot is read through. It checks all three fields, so what
// comes back is a SavedGame or nothing -- no assertion in between, and an old
// nested save simply fails it.
function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { name, identity, level } = value as Record<keyof SavedGame, unknown>;
  return (
    typeof name === "string" &&
    (identity === "male" || identity === "female") &&
    Number.isInteger(level)
  );
}

export class Game {
  player: Player | null = null;
  round = 0;
  level = 0;
  help = false;
  settings = false;

  enemyList: GameEnemy[] = [
    new SimpleSam("SimpleSam"),
    new ChisanaKaizoku("ChisanaKaizoku"),
    new JackTheBurned("JackTheBurned"),
    new MamanBrigitte("MamanBrigitte"),
    new Z("Z")
  ];

  // Reads the save slot, or null when there is nothing usable in it: empty,
  // unreadable (Safari private mode throws), or written in the shape a previous
  // version used. There is no migration -- an old save is simply not offered.
  static readSave(): SavedGame | null {
    try {
      const saved: unknown = JSON.parse(localStorage.ahoyGame);
      return isSavedGame(saved) ? saved : null;
    } catch {
      return null;
    }
  }

  newGame(playerName: string, playerIdentity: Identity): void {
    this.player = new Player(playerName, playerIdentity);
    this.player.enemy = this.enemyList[0];
    this._save();
  }

  // Only what loadGame reads back. The old format stringified the whole Game --
  // fleets, maps, the five enemies -- of which three fields were ever used.
  _save(): void {
    if (!this.player) {
      return;
    }
    localStorage.ahoyGame = JSON.stringify({
      name: this.player.name,
      identity: this.player.identity,
      level: this.level
    } satisfies SavedGame);
  }

  nextLevel(): void {
    if (!this.player) {
      return;
    }
    this.level++;
    this.round = 0;
    this.player.reset();
    this.player.turn = true;
    if (this.player.enemy) {
      this.player.enemy.turn = false;
    }

    this.player.enemy = this.enemyList[this.level];

    this._save();
  }

  rerun(): void {
    if (!this.player) {
      return;
    }
    this.round = 0;
    this.player.turn = true;

    this.player.reset();
    if (this.player.enemy) {
      this.player.enemy.turn = false;
      this.player.enemy.reset();
    }
  }

  nextRound(): void {
    if (!this.player || !this.player.enemy) {
      return;
    }
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;
    this.round++;

    if (this.player.enemy.turn && !this.player.enemy.defeat) {
      this._enemyTurn();
    }
  }

  loadGame(savedGame: SavedGame): void {
    this.player = new Player(savedGame.name, savedGame.identity);
    this.player.enemy = this.enemyList[savedGame.level];
    this.level = savedGame.level;
  }

  _randomDelay(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Dispatches on className, never constructor.name, which minification eats.
  // The default branch assigns to never, so the day a sixth enemy joins
  // enemyList without a case here, this stops compiling instead of silently
  // taking the generic turn.
  _enemyTurn(): void {
    const enemy = this.enemyList[this.level];
    if (!enemy) {
      return;
    }

    switch (enemy.className) {
      case "SimpleSam":
        this._simpleSamTurn();
        break;

      case "JackTheBurned":
        this._jackTheBurnedTurn();
        break;

      case "ChisanaKaizoku":
      case "MamanBrigitte":
      case "Z":
        this._defaultEnemyTurn();
        break;

      default: {
        // Unreachable while enemyList holds the five it declares, and the
        // assignment is the point: a sixth enemy added without a case here
        // stops compiling. className is still a plain string at runtime -- the
        // net proves dispatch goes through it and not constructor.name by
        // renaming one -- so an unexpected value takes the generic turn rather
        // than stopping the fight.
        const unhandled: never = enemy;
        void unhandled;
        this._defaultEnemyTurn();
        break;
      }
    }
  }

  // Hits let him shoot again, in the same turn, until he misses.
  _simpleSamTurn(): void {
    const player = this.player;
    const enemy = player?.enemy;
    if (!player || !enemy) {
      return;
    }

    player.attackLock = false;

    setTimeout(() => {
      const enemyAttackResult = enemy.generateAttack(player);
      enemy.setMoodAttacking(enemyAttackResult);
      player.setMoodAttacked(enemyAttackResult);
      setTimeout(() => {
        player.setDefaultMood();
        enemy.setDefaultMood();

        if (enemyAttackResult === "HIT") {
          enemy.mainPower?.activate();
          this._enemyTurn();
        } else {
          this.nextRound();
        }
      }, 800);
    }, this._randomDelay(1000, 2500));
  }

  // A hit has a chance of setting fire to an adjacent square, once per turn.
  _jackTheBurnedTurn(): void {
    const player = this.player;
    const enemy = player?.enemy;
    if (!player || !enemy || !(enemy instanceof JackTheBurned)) {
      return;
    }

    player.attackLock = false;

    setTimeout(() => {
      const enemyAttackResult = enemy.generateAttack(player);
      enemy.setMoodAttacking(enemyAttackResult);
      player.setMoodAttacked(enemyAttackResult);
      setTimeout(() => {
        player.setDefaultMood();
        enemy.setDefaultMood();

        if (enemyAttackResult !== "HIT" || enemy.powerActivated) {
          enemy.powerActivated = false;
          this.nextRound();
          return;
        }

        const powerActivation = enemy.activatePower();
        setTimeout(() => {
          if (powerActivation && enemy.lastHit) {
            enemy.fire(player, enemy.lastHit[0], enemy.lastHit[1]);
            enemy.powerActivated = true;
          } else {
            enemy.powerActivated = false;
          }
          this.nextRound();
        }, 500);
      }, 600);
    }, this._randomDelay(1000, 2200));
  }

  _defaultEnemyTurn(): void {
    const player = this.player;
    const enemy = player?.enemy;
    if (!player || !enemy) {
      return;
    }

    player.attackLock = false;

    setTimeout(() => {
      const enemyAttackResult = enemy.generateAttack(player);

      enemy.setMoodAttacking(enemyAttackResult);
      player.setMoodAttacked(enemyAttackResult);
      setTimeout(() => {
        player.setDefaultMood();
        enemy.setDefaultMood();
        this.nextRound();
      }, 1000);
    }, this._randomDelay(1000, 2500));
  }
}
