import {Fleet} from '@/classes/Fleet.js';
export class Player {

  constructor(name){
    this.name = name;
    this.fleet = new Fleet();
  }

}
