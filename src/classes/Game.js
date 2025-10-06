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

  //Starting a new game
  newGame(playerName, playerIdentity) {
    this.player = new Player(playerName, playerIdentity);
    this.player.enemy = this.enemyList[0];
    localStorage.ahoyGame = JSON.stringify(this);
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

    //Saving the current Game object to Localstorage
    localStorage.ahoyGame = JSON.stringify(this);
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

    if (this.player.enemy.turn & !this.player.enemy.defeat) {
      this._enemyTurn();
    }
  };

  // Loading a Game Object from LocalStorage
  loadGame = function(savedGame) {
    this.player = new Player(savedGame.player.name, savedGame.player.identity);
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
