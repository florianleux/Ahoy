import { Player } from "@/classes/Player.js";
import { SimpleSam } from "@/classes/enemies/SimpleSam/SimpleSam.js";
import { JackTheBurned } from "./enemies/JackTheBurned/JackTheBurned";
import { MamanBrigitte } from "./enemies/MamanBrigitte/MamanBrigitte";
import { ChisanaKaizoku } from "./enemies/ChisanaKaizoku/ChisanaKaizoku";
import { Z } from "./enemies/Z/Z";

export class Game {
  player = null;
  round = 0;
  level = 0;
  help = false;
  settings = false;

  enemyList = [
    new SimpleSam(),
    new ChisanaKaizoku(),
    new JackTheBurned(),
    new MamanBrigitte(),
    new Z()
  ];

  // Reads the save slot, or null when there is nothing usable in it: empty,
  // unreadable (Safari private mode throws), or written in the shape a previous
  // version used. There is no migration -- an old save is simply not offered.
  static readSave() {
    try {
      const saved = JSON.parse(localStorage.ahoyGame);
      const usable =
        saved !== null &&
        typeof saved.name === "string" &&
        typeof saved.identity === "string" &&
        Number.isInteger(saved.level);
      return usable ? saved : null;
    } catch {
      return null;
    }
  }

  //Starting a new game
  newGame(playerName, playerIdentity) {
    this.player = new Player(playerName, playerIdentity);
    this.player.enemy = this.enemyList[0];
    this._save();
  }

  // Only what loadGame reads back. The old format stringified the whole Game --
  // fleets, maps, the five enemies -- of which three fields were ever used.
  _save() {
    localStorage.ahoyGame = JSON.stringify({
      name: this.player.name,
      identity: this.player.identity,
      level: this.level
    });
  }

  //Going to next enemy
  nextLevel() {
    this.level++;
    this.round = 0;
    this.player.reset();
    this.player.turn = true;
    this.player.enemy.turn = false;

    //Updating ennemy to the next on in the list
    this.player.enemy = this.enemyList[this.level];

    this._save();
  }

  // Rerunning the current level in case of defeat
  rerun() {
    this.round = 0;
    this.player.turn = true;
    this.player.enemy.turn = false;

    //Resetting enemy and players (turns, attackLock etc)
    this.player.reset();
    this.player.enemy.reset();
  }

  //Alternating turns between enemy and player
  nextRound = function() {
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;
    this.round++;

    if (this.player.enemy.turn && !this.player.enemy.defeat) {
      this._enemyTurn();
    }
  };

  // Loading a saved game, in the flat shape readSave() hands back.
  loadGame = function(savedGame) {
    this.player = new Player(savedGame.name, savedGame.identity);
    this.player.enemy = this.enemyList[savedGame.level];
    this.level = savedGame.level;
  };

  _randomDelay(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Main function for enemy's turn
  _enemyTurn() {
    //Calculating the enemy delay for this turn
    //Used to fake a "thinking time" for the IA
    const enemyDelay = this._randomDelay(1000, 2500);

    // Locking the player attack on his map
    this.player.attackLock = false;

    // Using the enemy className attribute to differentiate them because
    // the name is translated and the constructor.name is not available in production
    switch (this.enemyList[this.level].className) {
      case "SimpleSam":
        setTimeout(() => {
          const enemyAttackResult = this.player.enemy.generateAttack(
            this.player
          );
          this.player.enemy.setMoodAttacking(enemyAttackResult);
          this.player.setMoodAttacked(enemyAttackResult);
          setTimeout(() => {
            this.player.mood = "default";
            this.player.enemy.mood = "default";

            //Simple Sam Power : if there is a HIT, he attacks again.
            if (enemyAttackResult === "HIT") {
              this.player.enemy.mainPower.activate();
              this._enemyTurn();
            } else {
              this.nextRound();
            }
          }, 800);
        }, enemyDelay);
        break;

      case "JackTheBurned": {
        const jackEnemyDelay = this._randomDelay(1000, 2200);

        setTimeout(() => {
          const enemyAttackResult = this.player.enemy.generateAttack(
            this.player
          );
          this.player.enemy.setMoodAttacking(enemyAttackResult);
          this.player.setMoodAttacked(enemyAttackResult);
          setTimeout(() => {
            this.player.mood = "default";
            this.player.enemy.mood = "default";
            if (
              enemyAttackResult === "HIT" &&
              !this.player.enemy.powerActivated
            ) {
              // Randomizing a probability to activate the power : 50%
              const powerActivation = this.player.enemy.activatePower();
              setTimeout(() => {
                //Jack the Burned power : If the power is activated, he attacks again around his initial hit
                if (powerActivation) {
                  this.player.enemy.fire(
                    this.player,
                    this.player.enemy.lastHit[0],
                    this.player.enemy.lastHit[1]
                  );
                  this.player.enemy.powerActivated = true;
                  this.nextRound();
                } else {
                  this.player.enemy.powerActivated = false;
                  this.nextRound();
                }
              }, 500);
            } else {
              this.player.enemy.powerActivated = false;
              this.nextRound();
            }
          }, 600);
        }, jackEnemyDelay);
        break;
      }

      default:
        this._defaultEnemyTurn();
        break;
    }
  }

  _defaultEnemyTurn() {
    const enemyDelay = this._randomDelay(1000, 2500);

    setTimeout(() => {
      const enemyAttackResult = this.player.enemy.generateAttack(this.player);

      // Setting mood for profile picture of enemy and player
      this.player.enemy.setMoodAttacking(enemyAttackResult);
      this.player.setMoodAttacked(enemyAttackResult);
      setTimeout(() => {
        this.player.mood = "default";
        this.player.enemy.mood = "default";
        this.nextRound();
      }, 1000);
    }, enemyDelay);
  }
}
