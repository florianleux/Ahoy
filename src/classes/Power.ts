import type { MessageKey } from "@/classes/types";

export type PowerType = "passif" | "actif";

export class Power {
  name: MessageKey;
  description: MessageKey;
  type: PowerType;
  active = false;

  constructor(name: MessageKey, description: MessageKey, type: PowerType) {
    this.name = name;
    this.description = description;
    this.type = type;
  }

  activate(time = 1500): void {
    this.active = true;
    setTimeout(() => {
      this.active = false;
    }, time);
  }
}
