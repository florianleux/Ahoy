import { MathHelper } from "@/classes/helpers/MathHelper.js";

export class PlayerProfileHelper {
  mathHelper = new MathHelper();

  phrasesList = [
    "Piiiiiiirate !",
    "A l'abordage !",
    "Bachibouzouk ! Marin d'eau douce !",
    "Pirate un jour, Pirate toujours !",
    "AHOY !"
  ];

  identitiesList = ["male"];

  getPhrase() {
    return this.phrasesList[
      this.mathHelper.getRandomIntMax(this.phrasesList.length - 1)
    ];
  }

  getIdentity() {
    return this.identitiesList[
      this.mathHelper.getRandomIntMax(this.identitiesList.length - 1)
    ];
  }
}
