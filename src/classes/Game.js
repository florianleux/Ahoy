export class Game {
  player = null;
  round = 0;

  nextRound = function() {
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;

    this.round++;

    if (this.player.enemy.turn & !this.player.enemy.defeat) {
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
