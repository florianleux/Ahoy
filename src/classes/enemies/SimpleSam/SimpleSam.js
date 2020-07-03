import {Enemy} from '@/classes/Enemy.js'

export class SimpleSam extends Enemy{

    name = "Simple Sam";

    phrase = "La vie c'est comme une boîte de chocolats";

    _strategy(){
        return this._randomHit();
    }


}