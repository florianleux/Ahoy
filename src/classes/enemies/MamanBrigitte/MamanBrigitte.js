import { Enemy } from "@/classes/Enemy.js";
import { Power } from "@/classes/Power.js";
import { MamanBrigitteFleet } from "@/classes/enemies/MamanBrigitte/MamanBrigitteFleet.js";

export class MamanBrigitte extends Enemy {
  name = "Maman Brigitte";

  phrase = "Mesye la kwa avanse pou l we yo!";

  nature = "Elle est une Iwa, une divinité vaudou.";

  constructor(name) {
    super(name);
    this.fleet = new MamanBrigitteFleet();

    this.powers.push(
      new Power(
        "Âmes liées",
        "Au début de la partie, Maman Brigitte lie par le vaudou un de ses bateaux à l'un des vôtres.</br> Quand vous coulez ce bateau, le bateau de votre flotte auquel il est lié est également coulé.",
        "Passif"
      )
    );
  }
}
