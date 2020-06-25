export class Boat{

    size =0;
    coord = [];
    horizontal = true;
    selected = false;

    constructor(size){
        this.size = size;
        for (let i=0; i<size; i++){
            this.coord.push([0,0]);
        }
    }
}