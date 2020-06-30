export class Game {
  player = null;
  round = 0;

  nextRound = function() {
    this.player.turn = !this.player.turn;
    this.player.enemy.turn = !this.player.enemy.turn;
    this.round++;

    if (this.player.enemy.turn) {
      this.player.enemy.generateAttack(this.player);
      this.nextRound();
    }
  };
}
