export class Map {
  name = "default";
  height = 10;
  width = 10;
  hoverMap = [];
  boatMap = [];
  okClick = false;

  constructor() {
    this.hoverMap = this.resetMap();
    this.boatMap = this.resetMap();
  }

  hoverSquare(square, fleet) {
    var selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null) {
      return false;
    } else {
      this.hoverMap = this.resetMap();
      this.okClick = true;
      var posX = Number(square.dataset.x) - 1,
        posY = Number(square.dataset.y) - 1,
        boatSize = Number(selectedBoat.size) - 1,
        half = Math.floor(boatSize / 2),
        remain = boatSize % 2;

      if (selectedBoat.horizontal) {
        var min = posX - half >= 0 ? posX - half : 0,
          max = posX + half + remain <= 9 ? posX + half + remain : 9;

        for (let i = min; i <= max; i++) {
          this.hoverMap[posY].splice(i, 1, true);
          if (this.boatMap[posY][i]) {
            this.okClick = false;
          }
        }

        if (posX + half + remain > 9 || posX - half < 0) {
          this.okClick = false;
        }
      } else {
        (min = posY - half >= 0 ? posY - half : 0),
          (max = posY + half + remain <= 9 ? posY + half + remain : 9);

        for (let i = min; i <= max; i++) {
          this.hoverMap[i].splice(posX, 1, true);
          if (this.boatMap[i][posX]) {
            this.okClick = false;
          }
        }

        if (posY + half + remain > 9 || posY - half < 0) {
          this.okClick = false;
        }
      }
    }
  }

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
          this.boatMap[posY].splice(i, 1, true);
        }
      } else {
        (min = posY - half >= 0 ? posY - half : 0),
          (max = posY + half + remain <= 9 ? posY + half + remain : 9);

        for (let i = min; i <= max; i++) {
          this.boatMap[i].splice(posX, 1, true);
        }
      }

      selectedBoat.unselect();
      selectedBoat.disable();
      fleet.selectBoat(null);
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
