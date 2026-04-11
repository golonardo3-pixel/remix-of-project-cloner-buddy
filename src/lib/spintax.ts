/**
 * Resolve spintax: replaces {opt1|opt2|opt3} with a random option.
 */
export function resolveSpintax(text: string): string {
  return text.replace(/\{([^{}]+)\}/g, (_, group: string) => {
    const options = group.split("|");
    return options[Math.floor(Math.random() * options.length)];
  });
}
