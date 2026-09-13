import type { BoatId, Coord } from "@/classes/types";

export class Boat {
  id: BoatId;
  size: number;
  hp: number;
  coords: Coord[] = [];
  placed = false;
  horizontal = true;
  selected = false;
  disabled = false;
  destroyed = false;
  // MamanBrigitte marks one boat: sinking it takes one of the player's with it.
  doomed = false;

  constructor(size: number, id: BoatId) {
    this.id = id;
    this.size = size;
    this.hp = size;
  }

  select(): void {
    if (!this.disabled) {
      this.selected = true;
    }
  }

  unselect(): void {
    this.selected = false;
  }

  disable(): void {
    this.disabled = true;
  }

  enable(): void {
    this.disabled = false;
  }

  hit(): void {
    this.hp--;
    if (this.hp === 0) {
      this.destroyed = true;
    }
  }
}
