import type { AttackResult, Mood } from "@/classes/types";

export class MoodHelper {
  // ENDGAME is a destroyed boat that happened to be the last one, so both sides
  // react to it as they would to any sinking. Before these were typed it fell
  // through every case and returned undefined, which reached the profile as
  // players/<who>/undefined.webp -- a 404 on the very last shot of a fight.
  getMoodAttacking(attackMessage: AttackResult): Mood {
    switch (attackMessage) {
      case "MISSED":
        return "despair";
      case "HIT":
        return "joy";
      case "DESTROYED":
      case "ENDGAME":
        return "mocking";
    }
  }

  getMoodAttacked(attackMessage: AttackResult): Mood {
    switch (attackMessage) {
      case "MISSED":
        return "mocking";
      case "HIT":
      case "DESTROYED":
      case "ENDGAME":
        return "despair";
    }
  }
}
