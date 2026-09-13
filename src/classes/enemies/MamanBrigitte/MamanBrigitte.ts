import { Enemy } from "@/classes/Enemy";
import { Power } from "@/classes/Power";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet";

export class MamanBrigitte extends Enemy {
  override name = "mb_name" as const;
  override className = "MamanBrigitte" as const;
  override phrase = "mb_phrase" as const;
  override nature = "mb_nature" as const;

  constructor(name: string) {
    super(name);
    this.fleet = new MamanBrigitteFleet();

    this.mainPower = new Power(
      "mb_main_power_name",
      "mb_main_power_description",
      "actif"
    );
  }
}
