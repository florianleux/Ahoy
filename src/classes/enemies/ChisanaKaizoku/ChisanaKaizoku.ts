import { Enemy } from "@/classes/Enemy";
import { Power } from "@/classes/Power";

export class ChisanaKaizoku extends Enemy {
  override name = "ck_name" as const;
  override className = "ChisanaKaizoku" as const;
  override phrase = "ck_phrase" as const;
  override nature = "ck_nature" as const;

  constructor(name: string) {
    super(name);

    this.mainPower = new Power(
      "ck_main_power_name",
      "ck_main_power_description",
      "passif"
    );
  }
}
