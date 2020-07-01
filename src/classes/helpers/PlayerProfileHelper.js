import {MathHelper} from "@/classes/helpers/MathHelper.js";


export class PlayerProfileHelper{

    mathHelper = new MathHelper();

    phrasesList = [
        "Piiiiiiirate !",
        "A l'abordage !",
        "Bachibouzouk ! Marin d'eau douce !",
        "Pirate un jour, Pirate toujours !",
        "AHOY !"
    ]

    getPhrase(){
        return this.phrasesList[this.mathHelper.getRandomIntMax(this.phrasesList.length)];
    }
}