export class Boat {
  id = 0;
  size = 0;
  hp = 0;
  coords = [];
  placed = false;
  horizontal = true;
  selected = false;
  disabled = false;
  destroyed = false;
  doomed = false;

  constructor(size, id) {
    this.id = id;
    this.size = size;
    this.hp = size;
  }

  select() {
    if (!this.disabled) {
      this.selected = true;
    }
  }

  unselect() {
    this.selected = false;
  }

  disable() {
    this.disabled = true;
  }

  hit() {
    this.hp--;
    if (this.hp === 0) {
      this.destroyed = true;
    }
  }
}
