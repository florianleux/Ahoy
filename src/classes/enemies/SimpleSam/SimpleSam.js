import {Enemy} from '@/classes/Enemy.js'
import {SimpleSamFleet} from '@/classes/enemies/SimpleSam/SimpleSamFleet.js'

export class SimpleSam extends Enemy{

    name = "Simple Sam";

    phrase = "La vie c'est comme une boîte de sardines...";

    constructor(name) {
        super(name);
        this.fleet = new SimpleSamFleet();
    }

    _strategy(){
        return this._randomHit();
    }




}