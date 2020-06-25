export class Boat {
  size = 0;
  coord = [];
  horizontal = true;
  selected = false;
  disabled = false;

  constructor(size) {
    this.size = size;
    for (let i = 0; i < size; i++) {
      this.coord.push([0, 0]);
    }
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
}
