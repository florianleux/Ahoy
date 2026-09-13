import { Character } from "@/classes/Character";
import type { Power } from "@/classes/Power";
import type {
  AttackResult,
  Coord,
  Direction,
  MessageKey
} from "@/classes/types";

export class Enemy extends Character {
  // Narrowed to its own literal by each of the five enemies, which is what lets
  // Game's turn switch be exhaustive.
  className: string = "Enemy";
  nature: MessageKey | null = null;

  turn = false;
  firstHit: Coord | null = null;
  lastHit: Coord | null = null;
  direction: Direction[] = this._shuffleDirectionArray([
    "UP",
    "DOWN",
    "RIGHT",
    "LEFT"
  ]);
  directionIndex = 0;
  hitStrike = 0;
  attackMessage: string | false = false;
  attackMessages: Record<AttackResult, string> = {
    HIT: "Touché !",
    DESTROYED: " Touché ! Coulé !",
    ENDGAME: " Touché ! Coulé !",
    MISSED: "A l'eau !"
  };
  mainPower: Power | null = null;
  secondaryPowers: Power[] = [];
  // JackTheBurned tracks whether his second shot has already gone off.
  powerActivated = false;

  generateAttack(target: Character): AttackResult {
    let coord = this._strategy();

    // The strategy returns false when the coord it produced is out of bounds or
    // already shot at; it has adjusted its own state by then, so asking again
    // eventually lands.
    while (!coord) {
      coord = this._strategy();
    }

    return this.attack(target, coord[0], coord[1]);
  }

  _randomHit(): Coord {
    let posX = 0;
    let posY = 0;
    let ok = false;

    while (!ok) {
      posX = this._getRandomInt(1, this.map.width);
      posY = this._getRandomInt(1, this.map.height);

      if (!this.map.hitMap[posY - 1][posX - 1]) {
        ok = true;
      }
    }

    return [posX, posY];
  }

  // Cross-search around the first hit: keep going in one direction until the
  // board or an already-shot square stops it, then take the next direction.
  _strategy(): Coord | false {
    if (!this.firstHit) {
      return this._randomHit();
    }

    let posX = 0;
    let posY = 0;
    switch (this.direction[this.directionIndex]) {
      case "DOWN":
        posX = this.firstHit[0];
        posY = this.firstHit[1] + this.hitStrike;
        break;

      case "LEFT":
        posX = this.firstHit[0] - this.hitStrike;
        posY = this.firstHit[1];
        break;

      case "RIGHT":
        posX = this.firstHit[0] + this.hitStrike;
        posY = this.firstHit[1];
        break;

      case "UP":
        posX = this.firstHit[0];
        posY = this.firstHit[1] - this.hitStrike;
        break;
    }

    const offBoard = posY < 1 || posY > 10 || posX < 1 || posX > 10;
    if (offBoard || this.map.hitMap[posY - 1][posX - 1]) {
      this._nextDirection();
      return false;
    }

    return [posX, posY];
  }

  private _nextDirection(): void {
    this.hitStrike = 1;
    this.directionIndex++;
    if (this.directionIndex > 3) {
      this._forgetTarget();
    }
  }

  private _forgetTarget(): void {
    this.firstHit = null;
    this.hitStrike = 0;
    this.directionIndex = 0;
    this.direction = this._shuffleDirectionArray(this.direction);
  }

  _postAttack(posX: number, posY: number, result: AttackResult): void {
    switch (result) {
      case "MISSED":
        if (this.firstHit) {
          this.directionIndex++;
          this.hitStrike = 1;
          if (this.directionIndex > 3) {
            this._forgetTarget();
          }
        }
        break;

      case "HIT":
        if (!this.firstHit) {
          this.firstHit = [posX, posY];
          this.hitStrike = 1;
          break;
        }

        switch (this.direction[this.directionIndex]) {
          case "DOWN":
            posY === 10 ? this._turnAtEdge() : this.hitStrike++;
            break;
          case "LEFT":
            posX === 1 ? this._turnAtEdge() : this.hitStrike++;
            break;
          case "RIGHT":
            posX === 10 ? this._turnAtEdge() : this.hitStrike++;
            break;
          case "UP":
            posY === 1 ? this._turnAtEdge() : this.hitStrike++;
            break;
        }
        if (this.directionIndex > 3) {
          this._forgetTarget();
        }
        break;

      case "DESTROYED":
      case "ENDGAME":
        this._forgetTarget();
        break;
    }
  }

  private _turnAtEdge(): void {
    this.directionIndex++;
    this.hitStrike = 1;
  }

  override attack(
    target: Character,
    posX: number,
    posY: number,
    postAttack = true
  ): AttackResult {
    const attackResult = super.attack(target, posX, posY);

    this.attackMessage = this.attackMessages[attackResult];

    if (!postAttack) {
      return attackResult;
    }

    setTimeout(() => {
      this.attackMessage = false;
    }, 1500);

    this.lastHit = [posX, posY];

    this._postAttack(posX, posY, attackResult);

    return attackResult;
  }

  _shuffleDirectionArray(array: Direction[]): Direction[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  _getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
