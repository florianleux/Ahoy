import { Enemy } from "@/classes/Enemy";
import { Power } from "@/classes/Power";
import { SimpleSamFleet } from "@/classes/enemies/SimpleSam/SimpleSamFleet";

export class SimpleSam extends Enemy {
  override name = "ss_name" as const;
  override className = "SimpleSam" as const;
  override phrase = "ss_phrase" as const;
  override nature = "ss_nature" as const;

  constructor(name: string) {
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
        "passif"
      )
    );
  }

  // No strategy at all: every shot is random, which is his second power.
  override _strategy() {
    return this._randomHit();
  }
}
