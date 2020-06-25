import {Boat} from '@/classes/Boat.js';

export class Fleet {
    nbBoats = 5;

    boats = [];

    constructor(){
        for (let i = 1; i <= this.nbBoats; i++) {
            this.boats.push(new Boat(i+1));
        }
    }
}
