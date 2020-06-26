// Map Class

export class Map {
  name = "default";
  height = 10;
  width = 10;
  hoverMap = [];
  boatMap = [];
  okClick = false;

  constructor() {
    this.hoverMap = this._resetMap();
    this.boatMap = this._resetMap();
  }

  hoverSquare(square, fleet) {
    //Check if a boat is selected
    var selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null) {
      return false;
    } else {
      //Reset hover map
      this.hoverMap = this._resetMap();
      this.okClick = true;

      var posX = Number(square.dataset.x) - 1,
        posY = Number(square.dataset.y) - 1,
        boatSize = Number(selectedBoat.size) - 1,
        half = Math.floor(boatSize / 2),
        remain = boatSize % 2;

      if (selectedBoat.horizontal) {
        var min = posX - half >= 0 ? posX - half : 0,
          max = posX + half + remain <= 9 ? posX + half + remain : 9;

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
        (min = posY - half >= 0 ? posY - half : 0),
          (max = posY + half + remain <= 9 ? posY + half + remain : 9);

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

  // Add the boat to the boatMap (ie put the boat in the map)
  // Mostly same logic as the hover function
  putBoat(square, fleet) {
    var selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null || !this.okClick) {
      return false;
    } else {
      var posX = Number(square.dataset.x) - 1,
        posY = Number(square.dataset.y) - 1,
        boatSize = Number(selectedBoat.size) - 1,
        half = Math.floor(boatSize / 2),
        remain = boatSize % 2;

      if (selectedBoat.horizontal) {
        var min = posX - half >= 0 ? posX - half : 0,
          max = posX + half + remain <= 9 ? posX + half + remain : 9;

        for (let i = min; i <= max; i++) {
          this.boatMap[posY].splice(i, 1, selectedBoat.id);
          selectedBoat.coords.push([i, posY]);
        }
      } else {
        (min = posY - half >= 0 ? posY - half : 0),
          (max = posY + half + remain <= 9 ? posY + half + remain : 9);

        for (let i = min; i <= max; i++) {
          this.boatMap[i].splice(posX, 1, selectedBoat.id);
          selectedBoat.coords.push([posX, i]);
        }
      }

      //Unselect the boat and add the boat in the playerFleet counter
      selectedBoat.unselect();
      selectedBoat.disable();
      fleet.putBoats++;
      fleet.selectBoat(null);
    }
  }

  //Reset function to generate a height*width 2d array
  _resetMap() {
    var array = [];

    for (let i = 0; i < this.height; i++) {
      var line = [];

      for (let j = 0; j < this.width; j++) {
        line[j] = false;
      }
      array[i] = line;
    }

    return array;
  }

  generateRandomMap(fleet) {
    var _this = this;
    fleet.boats.reverse().forEach(function(boat) {
      var boatCoords = _this._getRandomBoatCoords(boat);

      boatCoords.forEach(function(boatCoord) {
        var posX = boatCoord[0],
          posY = boatCoord[1];

        _this.boatMap[posY][posX] = boat.id;
      });

      boat.coords = boatCoords;
    });
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max) + min);
  }

  _getRandomBoatCoords(boat) {
    var _this = this,
      centerX = -1000,
      centerY = -1000,
      boatSize = Number(boat.size - 1),
      half = Math.floor(boatSize / 2),
      remain = boatSize % 2,
      coords = [],
      tryCount = 1,
      conflict = false;

    while (!conflict) {
      coords = [];
      conflict = true;

      boat.horizontal = Math.random() > 0.5 ? true : false;

      if (boat.horizontal) {
        (centerX = this._getRandomInt(half, this.width - 1 - half - remain)),
          (centerY = this._getRandomInt(0, this.height - 1));

        var min = centerX - half >= 0 ? centerX - half : 0,
          max = centerX + half + remain <= 9 ? centerX + half + remain : 9;

        for (let i = min; i <= max; i++) {
          coords.push([i, centerY]);
        }
      } else {
        (centerY = this._getRandomInt(half, this.height - 1 - half - remain)),
          (centerX = this._getRandomInt(0, this.width - 1));

        (min = centerY - half >= 0 ? centerY - half : 0),
          (max = centerY + half + remain <= 9 ? centerY + half + remain : 9);

        for (let i = min; i <= max; i++) {
          coords.push([centerX, i]);
        }
      }

      coords.forEach(function(coord) {
        var posX = coord[0],
          posY = coord[1];

        if (_this.boatMap[posY][posX]) {
          conflict = false;
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
