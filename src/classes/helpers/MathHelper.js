export class MathHelper{
    getRandomIntMax(max) {
        max = Math.floor(max);
        return Math.floor(Math.random() * (max + 1));
    }
}