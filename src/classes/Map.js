export class Map {
  name = "default";
  height = 10;
  width = 10;
  hoverMap = [];
  boatMap = [];

  constructor() {
    this.hoverMap = this.resetMap();
    this.boatMap = this.resetMap();
  }

  hoverSquare(square, selectedBoat) {
    if (selectedBoat === null) {
      return false;
    } else {
      this.hoverMap = this.resetMap();
      var posX = Number(square.dataset.x) - 1,
        posY = Number(square.dataset.y) - 1,
        boatSize = Number(selectedBoat.size)-1,
        half = Math.floor(boatSize / 2),
        remain = boatSize % 2,
        min = posX - half >= 0 ? posX - half : 0,
        max = posX + half + remain <= 9 ? posX + half + remain : 9;

      for (let i = min; i <= posX; i++) {
        this.hoverMap[posY].splice(i, 1, true);
      }

      for (let i = max; i > posX; i--) {
        this.hoverMap[posY].splice(i, 1, true);
      }
    }
  }

  placeBoat(square, selectedBoat) {
    if (selectedBoat === null) {
      return false;
    } else {
      var posX = Number(square.dataset.x) - 1,
          posY = Number(square.dataset.y) - 1,
          boatSize = Number(selectedBoat.size)-1,
          half = Math.floor(boatSize / 2),
          remain = boatSize % 2,
          min = posX - half >= 0 ? posX - half : 0,
          max = posX + half + remain <= 9 ? posX + half + remain : 9;


      for (let i = min; i <= posX; i++) {
        this.boatMap[posY].splice(i, 1, true);
      }

      for (let i = max; i > posX; i--) {
        this.boatMap[posY].splice(i, 1, true);
      }

      selectedBoat.unselect();
      selectedBoat.disable();
    }
  }

  resetMap() {
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
}
