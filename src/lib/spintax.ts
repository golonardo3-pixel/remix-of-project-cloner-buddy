/**
 * Resolve spintax: replaces {opt1|opt2|opt3} with a random option.
 * Tracks last picks per group to avoid repeating the same choice consecutively.
 */

let lastPicks: Map<string, string> = new Map();

/** Reset pick memory (call between dispatch rounds) */
export function resetSpintaxMemory() {
  lastPicks = new Map();
}

export function resolveSpintax(text: string): string {
  let result = text;
  let previous = "";

  while (result !== previous) {
    previous = result;
    result = result.replace(/\{([^{}]*\|[^{}]*)\}/g, (_, group: string) => {
      const options = group.split("|").map((o) => o.trim()).filter(Boolean);
      if (options.length === 0) return "";
      if (options.length === 1) return options[0];

      const lastPick = lastPicks.get(group);
      // Filter out last pick to avoid consecutive repeats
      const available = options.filter((o) => o !== lastPick);
      const pool = available.length > 0 ? available : options;
      const chosen = pool[Math.floor(Math.random() * pool.length)] ?? "";
      lastPicks.set(group, chosen);
      return chosen;
    });
  }

  return result;
}
