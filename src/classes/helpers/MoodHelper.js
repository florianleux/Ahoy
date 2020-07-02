export class MoodHelper {
    getMoodAttacking(attackMessage){
        switch(attackMessage){
            case "MISSED":
                return "despair";
            case "HIT":
                console.log("joy");
                return "joy";
            case "DESTROYED":
                return "mocking";
        }
    }

    getMoodAttacked(attackMessage){
        switch(attackMessage){
            case "MISSED":
                return "mocking";
            case "HIT":
                return "despair"
            case "DESTROYED":
                return "default"
        }
    }
}
