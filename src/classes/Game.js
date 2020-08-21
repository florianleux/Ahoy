import { Player } from "@/classes/Player.js";
import { SimpleSam } from "@/classes/enemies/SimpleSam/SimpleSam.js";
import { JackTheBurned } from "./enemies/JackTheBurned/JackTheBurned";
import { MamanBrigitte } from "./enemies/MamanBrigitte/MamanBrigitte";
import { ChisanaKaizoku } from "./enemies/ChisanaKaizoku/ChisanaKaizoku";

export class Game {
  player = null;
  round = 0;
  level = 0;

  clickSound = new Audio("/music/click.wav");

  enemyList = [
    new SimpleSam(),
    new JackTheBurned(),
    new MamanBrigitte(),
    new ChisanaKaizoku()
  ];

  newGame(playerName, playerIdentity) {
    this.player = new Player(playerName, playerIdentity);
    this.player.enemy = this.enemyList[0];
    this.clickSound.volume = 1;
  }

  nextLevel() {
    this.level++;
    this.round = 0;
    this.player.reset();
    this.player.enemy = this.enemyList[this.level];
  }

  rerun() {
    this.round = 0;
    this.player.reset();
    this.player.enemy.reset();
  }

  nextRound = function() {
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;

    this.round++;

    if (this.player.enemy.turn & !this.player.enemy.defeat) {
      this._enemyTurn();
    }
  };

  _randomDelay(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _enemyTurn() {
    let enemyDelay = this._randomDelay(1000, 2500),
      _this = this;

    _this.player.attackLock = false;
    console.log(this.enemyList[this.level].constructor.name);

    switch (this.enemyList[this.level].constructor.name) {
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
            if (enemyAttackResult === "HIT") {
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
              let powerActivation = _this.player.enemy.activatePower();
              setTimeout(function() {
                if (powerActivation) {
                  _this._enemyTurn();
                  _this.player.enemy.powerActivated = true;
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
