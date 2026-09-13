import { audioManager } from "@/utils/AudioManager";
import type { Boat } from "@/classes/Boat";
import type { Fleet } from "@/classes/Fleet";
import type { Cell, Coord } from "@/classes/types";

export class Map {
  name = "default";
  height = 10;
  width = 10;
  // A preview overlay rather than a square's state, so plain booleans.
  hoverMap: boolean[][] = [];
  boatMap: Cell[][] = [];
  hitMap: Cell[][] = [];
  okClick = false;

  constructor() {
    this.hoverMap = this._resetHoverMap();
    this.boatMap = this._resetMap();
    this.hitMap = this._resetMap();
  }

  hoverSquare(square: HTMLElement | null, fleet: Fleet): false | void {
    const selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null || square === null) {
      return false;
    }

    this.hoverMap = this._resetHoverMap();
    this.okClick = true;

    const posX = Number(square.dataset.x) - 1;
    const posY = Number(square.dataset.y) - 1;
    const boatSize = Number(selectedBoat.size) - 1;
    const half = Math.floor(boatSize / 2);
    const remain = boatSize % 2;

    if (selectedBoat.horizontal) {
      const min = posX - half >= 0 ? posX - half : 0;
      const max = posX + half + remain <= 9 ? posX + half + remain : 9;

      for (let i = min; i <= max; i++) {
        this.hoverMap[posY][i] = true;
        if (this.boatMap[posY][i]) {
          this.okClick = false;
        }
      }

      if (posX + half + remain > 9 || posX - half < 0) {
        this.okClick = false;
      }
    } else {
      const min = posY - half >= 0 ? posY - half : 0;
      const max = posY + half + remain <= 9 ? posY + half + remain : 9;

      for (let i = min; i <= max; i++) {
        this.hoverMap[i][posX] = true;
        if (this.boatMap[i][posX]) {
          this.okClick = false;
        }
      }

      if (posY + half + remain > 9 || posY - half < 0) {
        this.okClick = false;
      }
    }
  }

  // Same geometry as the hover, but committing it.
  putBoat(square: HTMLElement | null, fleet: Fleet): false | void {
    const selectedBoat = fleet.selectedBoat;
    if (selectedBoat === null || square === null || !this.okClick) {
      return false;
    }

    const posX = Number(square.dataset.x) - 1;
    const posY = Number(square.dataset.y) - 1;
    const boatSize = Number(selectedBoat.size) - 1;
    const half = Math.floor(boatSize / 2);
    const remain = boatSize % 2;

    if (selectedBoat.horizontal) {
      const min = posX - half >= 0 ? posX - half : 0;
      const max = posX + half + remain <= 9 ? posX + half + remain : 9;

      for (let i = min; i <= max; i++) {
        this.boatMap[posY][i] = selectedBoat.id;
        selectedBoat.coords.push([i, posY]);
      }
    } else {
      const min = posY - half >= 0 ? posY - half : 0;
      const max = posY + half + remain <= 9 ? posY + half + remain : 9;

      for (let i = min; i <= max; i++) {
        this.boatMap[i][posX] = selectedBoat.id;
        selectedBoat.coords.push([posX, i]);
      }
    }

    audioManager.playSound("placed");
    selectedBoat.unselect();
    selectedBoat.disable();
    selectedBoat.placed = true;
    fleet.putBoats++;
    fleet.selectBoat(null);
  }

  // The hover overlay is booleans, not cells, so it gets its own blank grid --
  // assigning a Cell[][] to it used to pass unnoticed.
  _resetHoverMap(): boolean[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => false)
    );
  }

  _resetMap(): Cell[][] {
    const array: Cell[][] = [];

    for (let i = 0; i < this.height; i++) {
      const line: Cell[] = [];

      for (let j = 0; j < this.width; j++) {
        line[j] = false;
      }
      array[i] = line;
    }

    return array;
  }

  generateRandomMap(fleet: Fleet): void {
    fleet.boats.reverse().forEach(boat => {
      const boatCoords = this._getRandomBoatCoords(boat);

      boatCoords.forEach(boatCoord => {
        const [posX, posY] = boatCoord;
        this.boatMap[posY][posX] = boat.id;
      });

      boat.coords = boatCoords;
    });

    //Put boats back in order
    fleet.boats.reverse();
  }

  removeBoat(boat: Boat, fleet: Fleet): void {
    boat.coords.forEach(coord => {
      this.boatMap[coord[1]][coord[0]] = false;
    });

    boat.coords = [];
    boat.enable();
    boat.placed = false;
    fleet.putBoats--;

    fleet.selectBoat(boat);
  }

  _getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getRandomBoatCoords(boat: Boat, otherMap: Cell[][] | null = null): Coord[] {
    const boatSize = Number(boat.size - 1);
    const half = Math.floor(boatSize / 2);
    const remain = boatSize % 2;
    let coords: Coord[] = [];
    let tryCount = 1;
    let conflict = true;

    while (conflict) {
      coords = [];
      conflict = false;

      boat.horizontal = Math.random() > 0.5;

      if (boat.horizontal) {
        const centerX = this._getRandomInt(half, this.width - half - remain - 1);
        const centerY = this._getRandomInt(0, this.height - 1);

        const min = centerX - half;
        const max = centerX + half + remain;

        for (let i = min; i <= max; i++) {
          coords.push([i, centerY]);
        }
      } else {
        const centerY = this._getRandomInt(
          half,
          this.height - half - remain - 1
        );
        const centerX = this._getRandomInt(0, this.width - 1);

        const min = centerY - half >= 0 ? centerY - half : 0;
        const max = centerY + half + remain <= 9 ? centerY + half + remain : 9;

        for (let i = min; i <= max; i++) {
          coords.push([centerX, i]);
        }
      }

      coords.forEach(coord => {
        if (!conflict) {
          const [posX, posY] = coord;
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
