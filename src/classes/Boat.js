export class Boat {
  id = 0;
  size = 0;
  hp = 0;
  coord = [];
  horizontal = true;
  selected = false;
  disabled = false;

  constructor(size, id) {
    this.id = id;
    this.size = size;
    this.hp = size;

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
  