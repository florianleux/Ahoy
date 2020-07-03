import {Player} from "@/classes/Player.js";
import {SimpleSam} from "@/classes/enemies/SimpleSam/SimpleSam.js";

export class Game {
  player = null;
  round = 0;
  level = 0;

  enemyList=[
       SimpleSam
  ];

  newGame(playerName){
    this.player = new Player(playerName);
    this.player.enemy = new this.enemyList[0]();
  }

  nextLevel(){
    this.level++;
    let bufferName = this.player.name;
    this.round = 0;
    this.player = new Player(bufferName);
    this.player.enemy = new this.enemyList[this.level]();

  }

  nextRound = function() {
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;

    this.round++;

    if (this.player.enemy.turn & !this.player.enemy.defeat) {
      this.round++;
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
  };

  _randomDelay(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
