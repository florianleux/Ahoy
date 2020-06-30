import { Character } from "@/classes/Character.js";

// Enemy Class
export class Enemy extends Character {
  turn = false;
  firstHit = null;
  direction = this._shuffleDirectionArray(["UP", "DOWN", "RIGHT", "LEFT"]);
  directionIndex = 0;
  hitStrike = 0;

  generateAttack(target) {
    // Coord Calculation
    let coord = this._strategy();

    // If the coord is out-of-bound or already hit, we generate another coord
    while (!coord) {
      coord = this._strategy();
    }

    let posX = coord[0],
      posY = coord[1];

    //Attack with the calculated coords
    this.attack(target, posX, posY);
  }

  //Generate random coords (within map limits and not already used in attack)
  _randomHit() {
    let ok = false;

    // If the coord has already been used to attack, try another random pair
    while (!ok) {
      var posX = this._getRandomInt(1, this.map.width);
      var posY = this._getRandomInt(1, this.map.height);

      if (!this.map.hitMap[posY - 1][posX - 1]) {
        ok = true;
      }
    }

    return [posX, posY];
  }

  // Strategy function to generate next attack coords based on what happened last turn
  _strategy() {
    // If the last attack didn't hit any boats, we generate random coords for next target
    if (!this.firstHit) {
      return this._randomHit();
    } else {
      let posX, posY;
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
      console.log("-------------------------------");
      console.log("strategy");
      console.log("FIRST HIT", this.firstHit);
      console.log("HIT STRIKE", this.hitStrike);
      console.log("DIRECTION INDEX", this.directionIndex);
      console.log("DIRECTION", this.direction[this.directionIndex]);

      console.log(posX, posY);

      if (posY < 1 || posY > 10 || posX < 1 || posX > 10) {
        console.log("out of boundaries");
        this.directionIndex++;
        return false;
      } else {
        if (this.map.hitMap[posY - 1][posX - 1]) {
          console.log("already hit");
          this.directionIndex++;
          return false;
        }
      }

      console.log("good to go");
      return [posX, posY];
    }
  }

  _postAttack(posX, posY, result) {
    switch (result) {
      case "MISSED":
        if (this.firstHit) {
          this.directionIndex++;
          this.hitStrike = 1;
        }
        break;

      case "HIT":
        if (!this.firstHit) {
          this.firstHit = [posX, posY];
          this.hitStrike = 1;
        } else {
          switch (this.direction[this.directionIndex]) {
            case "DOWN":
              if (posY === 10) {
                this.directionIndex++;
                this.hitStrike = 1;
              }
              break;

            case "LEFT":
              if (posX === 1) {
                this.directionIndex++;
                this.hitStrike = 1;
              }
              break;

            case "RIGHT":
              if (posX === 10) {
                this.directionIndex++;
                this.hitStrike = 1;
              }
              break;

            case "UP":
              if (posY === 1) {
                this.directionIndex++;
                this.hitStrike = 1;
              }
              break;
          }
          this.hitStrike++;
        }
        break;

      case "DESTROYED":
        this.firstHit = null;
        this.hitStrike = 0;
        this.directionIndex = 0;
        this.direction = this._shuffleDirectionArray(this.direction);
        break;
    }
  }

  attack(target, posX, posY) {
    let attackResult = super.attack(target, posX, posY);
    console.log("result", attackResult);
    this._postAttack(posX, posY, attackResult);
  }

  _shuffleDirectionArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max) + min);
  }
}
