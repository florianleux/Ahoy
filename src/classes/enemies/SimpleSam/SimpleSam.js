import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";
import { SimpleSamFleet } from "@/classes/enemies/SimpleSam/SimpleSamFleet.js";

export class SimpleSam extends Enemy {
  name = "ss_name";

  className = "SimpleSam";

  phrase = "ss_phrase";

  nature = "ss_nature";

  constructor(name) {
    super(name);
    this.fleet = new SimpleSamFleet();

    this.mainPower = new Power(
      "ss_main_power_name",
      "ss_main_power_description",
      "passif"
    );

    this.secondaryPowers.push(
      new Power(
        "ss_secondary_power_name",
        "ss_secondary_power_description",
        "passif",
        false
      )
    );
  }

  _strategy() {
    return this._randomHit();
  }
}
