import { Player } from "@/classes/Player.js";
import { SimpleSam } from "@/classes/enemies/SimpleSam/SimpleSam.js";
import { JackTheBurned } from "./enemies/JackTheBurned/JackTheBurned";
import { MamanBrigitte } from "./enemies/MamanBrigitte/MamanBrigitte";
import { ChisanaKaizoku } from "./enemies/ChisanaKaizoku/ChisanaKaizoku";

export class Game {
  player = null;
  round = 0;
  level = 0;
  help = false;

  clickSound = new Audio("/music/click.wav");

  enemyList = [
    new SimpleSam(),
    new JackTheBurned(),
    new MamanBrigitte(),
    new ChisanaKaizoku()
  ];

  //Starting a new game
  newGame(playerName, playerIdentity) {
    this.player = new Player(playerName, playerIdentity);
    this.player.enemy = this.enemyList[0];
    this.clickSound.volume = 1;
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
    let enemyDelay = this._randomDelay(1000, 2500),
      _this = this;

    // Locking the player attack on his map
    _this.player.attackLock = false;

    // Using the enemy className attribute to differentiate them because
    // the name is translated and the constructor.name is not available in production
    switch (this.enemyList[this.level].className) {
      case "SimpleSam":
        setTimeout(function() {
          var enemyAttackResult = _this.player.enemy.generateAttack(
            _this.player
          );
          _this.player.enemy.setMoodAttacking(enemyAttackResult);
          _this.player.setMoodAttacked(enemyAttackResult);
          setTimeout(function() {
            _this.player.mood = "default";
            _this.player.enemy.mood = "default";

            //Simple Sam Power : if there is a HIT, he attacks again.
            if (enemyAttackResult === "HIT") {
              _this.player.enemy.mainPower.activate();
              _this._enemyTurn();
            } else {
              _this.nextRound();
            }
          }, 800);
        }, enemyDelay);
        break;

      case "JackTheBurned":
        enemyDelay = this._randomDelay(1000, 2200);

        setTimeout(function() {
          var enemyAttackResult = _this.player.enemy.generateAttack(
            _this.player
          );
          _this.player.enemy.setMoodAttacking(enemyAttackResult);
          _this.player.setMoodAttacked(enemyAttackResult);
          setTimeout(function() {
            _this.player.mood = "default";
            _this.player.enemy.mood = "default";
            if (
              enemyAttackResult === "HIT" &&
              !_this.player.enemy.powerActivated
            ) {
              // Randomizing a probability to activate the power : 50%
              let powerActivation = _this.player.enemy.activatePower();
              setTimeout(function() {
                //Jack the Burned power : If the power is activated, he attacks again around his initial hit
                if (powerActivation) {
                  _this.player.enemy.fire(
                    _this.player,
                    _this.player.enemy.lastHit[0],
                    _this.player.enemy.lastHit[1]
                  );
                  _this.player.enemy.powerActivated = true;
                  _this.nextRound();
                } else {
                  _this.player.enemy.powerActivated = false;
                  _this.nextRound();
                }
              }, 500);
            } else {
              _this.player.enemy.powerActivated = false;
              _this.nextRound();
            }
          }, 600);
        }, enemyDelay);
        break;

      default:
        this._defaultEnemyTurn();
        break;
    }
  }

  _defaultEnemyTurn() {
    let enemyDelay = this._randomDelay(1000, 2500),
      _this = this;

    setTimeout(function() {
      var enemyAttackResult = _this.player.enemy.generateAttack(_this.player);

      // Setting mood for profile picture of enemy and player
      _this.player.enemy.setMoodAttacking(enemyAttackResult);
      _this.player.setMoodAttacked(enemyAttackResult);
      setTimeout(function() {
        _this.player.mood = "default";
        _this.player.enemy.mood = "default";
        _this.nextRound();
      }, 1000);
    }, enemyDelay);
  }
}
