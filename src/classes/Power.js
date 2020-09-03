export class Power {
  name = "";
  description = "";
  type = "";
  active = false;

  constructor(name, description, type) {
    this.name = name;
    this.description = description;
    this.type = type;
  }

  activate(time = 1500) {
    let _this = this;
    this.active = true;
    setTimeout(function() {
      _this.active = false;
    }, time);
  }
}
