// Map Class
import { audioManager } from "@/utils/AudioManager.js";

export class Map {
  name = "default";
  height = 10;
  width = 10;
  hoverMap = [];
  boatMap = [];
  hitMap = [];
  okClick = false;

  constructor() {
    this.hoverMap = this._resetMap();
    this.boatMap = this._resetMap();
    this.hitMap = this._resetMap();
  }

  hoverSquare(square, fleet) {
    //Check if a boat is selected
    const selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null) {
      return false;
    } else {
      //Reset hover playerMap
      this.hoverMap = this._resetMap();
      this.okClick = true;

      const posX = Number(square.dataset.x) - 1;
      const posY = Number(square.dataset.y) - 1;
      const boatSize = Number(selectedBoat.size) - 1;
      const half = Math.floor(boatSize / 2);
      const remain = boatSize % 2;

      if (selectedBoat.horizontal) {
        const min = posX - half >= 0 ? posX - half : 0;
        const max = posX + half + remain <= 9 ? posX + half + remain : 9;

        //Going through the boat (horizontal : posY is constant)
        for (let i = min; i <= max; i++) {
          //Add all squares from the boat on the hoverMap
          this.hoverMap[posY].splice(i, 1, true);
          // Block click if the hovered square has a bot put on
          if (this.boatMap[posY][i]) {
            this.okClick = false;
          }
        }

        //Block click if a part of the boat is offlimit
        if (posX + half + remain > 9 || posX - half < 0) {
          this.okClick = false;
        }
      } else {
        const min = posY - half >= 0 ? posY - half : 0;
        const max = posY + half + remain <= 9 ? posY + half + remain : 9;

        //Going through the boat (vertical : posX is constant)
        for (let i = min; i <= max; i++) {
          //Add all squares from the boat on the hoverMap
          this.hoverMap[i].splice(posX, 1, true);
          // Block click if the hovered square has a bot put on
          if (this.boatMap[i][posX]) {
            this.okClick = false;
          }
        }

        //Block click if a part of the boat is offlimit
        if (posY + half + remain > 9 || posY - half < 0) {
          this.okClick = false;
        }
      }
    }
  }

  // Add the boat to the boatMap (ie put the boat in the playerMap)
  // Mostly same logic as the hover function
  putBoat(square, fleet) {
    const selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null || !this.okClick) {
      return false;
    } else {
      const posX = Number(square.dataset.x) - 1;
      const posY = Number(square.dataset.y) - 1;
      const boatSize = Number(selectedBoat.size) - 1;
      const half = Math.floor(boatSize / 2);
      const remain = boatSize % 2;

      if (selectedBoat.horizontal) {
        const min = posX - half >= 0 ? posX - half : 0;
        const max = posX + half + remain <= 9 ? posX + half + remain : 9;

        for (let i = min; i <= max; i++) {
          this.boatMap[posY].splice(i, 1, selectedBoat.id);
          selectedBoat.coords.push([i, posY]);
        }
      } else {
        const min = posY - half >= 0 ? posY - half : 0;
        const max = posY + half + remain <= 9 ? posY + half + remain : 9;

        for (let i = min; i <= max; i++) {
          this.boatMap[i].splice(posX, 1, selectedBoat.id);
          selectedBoat.coords.push([posX, i]);
        }
      }

      //Unselect the boat and add the boat in the playerFleet counter
      audioManager.playSound("placed");
      selectedBoat.unselect();
      selectedBoat.disable();
      selectedBoat.placed = true;
      fleet.putBoats++;
      fleet.selectBoat(null);
    }
  }

  //Reset function to generate a height*width 2d array
  _resetMap() {
    const array = [];

    for (let i = 0; i < this.height; i++) {
      const line = [];

      for (let j = 0; j < this.width; j++) {
        line[j] = false;
      }
      array[i] = line;
    }

    return array;
  }

  generateRandomMap(fleet) {
    fleet.boats.reverse().forEach(boat => {
      const boatCoords = this._getRandomBoatCoords(boat);

      boatCoords.forEach(boatCoord => {
        const posX = boatCoord[0];
        const posY = boatCoord[1];

        this.boatMap[posY][posX] = boat.id;
      });

      boat.coords = boatCoords;
    });

    //Put boats back in order
    fleet.boats.reverse();
  }

  removeBoat(boat, fleet) {
    boat.coords.forEach(coord => {
      this.boatMap[coord[1]].splice(coord[0], 1, false);
    });

    boat.coords = [];
    boat.enable();
    boat.placed = false;
    fleet.putBoats--;

    fleet.selectBoat(boat);
  }

  _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getRandomBoatCoords(boat, otherMap = null) {
    let centerX = -1000;
    let centerY = -1000;
    const boatSize = Number(boat.size - 1);
    const half = Math.floor(boatSize / 2);
    const remain = boatSize % 2;
    let coords = [];
    let tryCount = 1;
    let conflict = true;

    while (conflict) {
      coords = [];
      conflict = false;

      boat.horizontal = Math.random() > 0.5 ? true : false;

      if (boat.horizontal) {
        centerX = this._getRandomInt(half, this.width - half - remain - 1);
        centerY = this._getRandomInt(0, this.height - 1);

        const min = centerX - half;
        const max = centerX + half + remain;

        for (let i = min; i <= max; i++) {
          coords.push([i, centerY]);
        }
      } else {
        centerY = this._getRandomInt(half, this.height - half - remain - 1);
        centerX = this._getRandomInt(0, this.width - 1);

        const min = centerY - half >= 0 ? centerY - half : 0;
        const max = centerY + half + remain <= 9 ? centerY + half + remain : 9;

        for (let i = min; i <= max; i++) {
          coords.push([centerX, i]);
        }
      }

      coords.forEach(coord => {
        if (!conflict) {
          const posX = coord[0];
          const posY = coord[1];
          conflict = otherMap
            ? otherMap[posY][posX] !== false ||
              this.boatMap[posY][posX] !== false
            : this.boatMap[posY][posX] !== false;
        }
      });

      tryCount++;

      if (tryCount > 2000) {
        alert("ERREUR MEMOIRE");
        break;
      }
    }
    return coords;
  }
}
