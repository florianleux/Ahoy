export class MoodHelper {
  getMoodAttacking(attackMessage) {
    switch (attackMessage) {
      case "MISSED":
        return "despair";
      case "HIT":
        return "joy";
      case "DESTROYED":
        return "mocking";
    }
  }

  getMoodAttacked(attackMessage) {
    switch (attackMessage) {
      case "MISSED":
        return "mocking";
      case "HIT":
        return "despair";
      case "DESTROYED":
        return "despair";
    }
  }
}
