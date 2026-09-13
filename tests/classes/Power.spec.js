import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Power } from "@/classes/Power.js";

describe("Power", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("carries its name, description and type", () => {
    const power = new Power("Riposte", "Il rend coup pour coup", "passif");

    expect(power.name).toBe("Riposte");
    expect(power.description).toBe("Il rend coup pour coup");
    expect(power.type).toBe("passif");
    expect(power.active).toBe(false);
  });

  it("stays active for the default delay, then switches off on its own", () => {
    const power = new Power("Riposte", "", "passif");

    power.activate();
    expect(power.active).toBe(true);

    vi.advanceTimersByTime(1499);
    expect(power.active).toBe(true);

    vi.advanceTimersByTime(1);
    expect(power.active).toBe(false);
  });

  it("accepts a custom duration", () => {
    const power = new Power("Riposte", "", "passif");

    power.activate(500);
    vi.advanceTimersByTime(500);

    expect(power.active).toBe(false);
  });
});
