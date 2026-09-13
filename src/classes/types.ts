import fr from "@/locales/fr.json";

// A note that belongs with the domain rather than with any one class: nothing
// in src/classes/ carries private or protected members. The single Game
// instance lives behind reactive(), which hands back a structural view of the
// class, and a structural type can never satisfy a class that has non-public
// members -- passing a boat read out of the root back into Map.removeBoat would
// stop compiling. Underscore-prefixed names mark what is internal instead.

// Every piece of text the domain carries is a key into the message catalogue,
// never the text itself -- the classes are language-agnostic and the templates
// translate. Deriving the type from fr.json means a dead or misspelt key fails
// the typecheck rather than rendering the key to the player.
export type MessageKey = keyof typeof fr;

// The five boats of a fleet, and what a grid square can hold. Three grids share
// this: boatMap holds an id or nothing, hitMap holds the outcome of a shot or
// nothing. hoverMap is a plain boolean overlay and is typed as such -- it is a
// preview, not a square's state.
export type BoatId = 1 | 2 | 3 | 4 | 5;
export type Cell = false | BoatId | "hit" | "missed";

// The profile pictures in public/players/<ClassName>/ are named after these.
export type Mood = "default" | "joy" | "despair" | "mocking" | "wanted";

// What a shot comes back with. ENDGAME is a destroyed boat that was also the
// last one.
export type AttackResult = "MISSED" | "HIT" | "DESTROYED" | "ENDGAME";

// Game._enemyTurn dispatches on className rather than constructor.name, which
// minification eats. Making it a union turns that convention into a rule the
// compiler enforces.
export type EnemyClassName =
  "SimpleSam" | "ChisanaKaizoku" | "JackTheBurned" | "MamanBrigitte" | "Z";

export type Direction = "UP" | "DOWN" | "RIGHT" | "LEFT";

// [x, y], one-based on the board.
export type Coord = [number, number];
