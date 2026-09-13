import { MathHelper } from "@/classes/helpers/MathHelper";

export class PlayerProfileHelper {
  mathHelper = new MathHelper();

  // Free text, not message keys: the pirate's catchphrase is French flavour and
  // has never been translated.
  phrasesList = [
    "Piiiiiiirate !",
    "A l'abordage !",
    "Bachibouzouk ! Marin d'eau douce !",
    "Pirate un jour, Pirate toujours !",
    "AHOY !"
  ];

  getPhrase(): string {
    return this.phrasesList[
      this.mathHelper.getRandomIntMax(this.phrasesList.length - 1)
    ] as string;
  }
}
