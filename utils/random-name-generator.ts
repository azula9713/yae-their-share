interface NameComponents {
  prefixes: string[];
  cores: string[];
  suffixes: string[];
}

// Basic LCG for seeded PRNG
class SeededRandom {
  private seed: number;
  private readonly a: number = 1103515245;
  private readonly c: number = 12345;
  private readonly m: number = 2 ** 31 - 1; // A large prime number

  constructor(seed: number) {
    // Ensure the initial seed is positive and within m
    this.seed = seed % this.m;
    if (this.seed <= 0) {
      this.seed += this.m; // Ensure seed is positive
    }
  }

  next(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m; // Normalize to [0, 1)
  }
}

export default function getRandomSciFiMythicalName(): string {
  const rng = new SeededRandom(Date.now());

  const components: NameComponents = {
    prefixes: [
      "Astro",
      "Cyber",
      "Quantum",
      "Neo",
      "Hyper",
      "Ultra",
      "Meta",
      "Chrono",
      "Cosmo",
      "Stellar",
      "Void",
      "Nexus",
      "Flux",
      "Echo",
      "Velo", // Shorter, more abstract
      "Kryp",
      "Zenith",
      "Sol", // Sun-related
      "Lunar",
      "Terra",
      "Giga",
    ],
    cores: [
      "Phoenix",
      "Dragon",
      "Titan",
      "Sphinx",
      "Kraken",
      "Griffin",
      "Hydra",
      "Chimera",
      "Leviathan",
      "Pegasus",
      "Cerberus",
      "Minotaur",
      "Valkyrie",
      "Banshee",
      "Djinn",
      "Seraph",
      "Nephilim",
      "Golem",
      "Synthex", // Sci-fi core
      "Vortex",
      "Glyph",
      "Spectre",
      "Nova",
      "Pulsar",
      "Cosmos", // Can be a core
      "Aurora",
      "Aether",
      "Arcana",
    ],
    suffixes: [
      "X",
      "Prime",
      "Core",
      "Node",
      "Sync",
      "Wave",
      "Pulse",
      "Ion",
      "Byte",
      "Code",
      "Net",
      "Grid",
      "Link",
      "Hub",
      "Tech",
      "Alpha",
      "Zero",
      "Lux",
      "Mancer", // Magic/tech feel
      "Corp",
      "Dynamics",
      "Gen", // As in gene/generation
      "Nexus", // Can also be a suffix
    ],
  };

  const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(rng.next() * arr.length)];

  // Define patterns for 2 or 3 components, with different joiners
  const nameGenerationPatterns = [
    // 3 Component Patterns
    () => {
      // Classic: PrefixCore Suffix
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix}${core} ${suffix}`;
    },
    () => {
      // Prefix Core-Suffix (hyphenated end)
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix} ${core}-${suffix}`;
    },
    () => {
      // Prefix-Core Suffix (hyphenated start)
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix}-${core} ${suffix}`;
    },
    () => {
      // Prefix Core + Suffix (no space, just blend if possible)
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix}${core}${suffix}`; // AstroHydraX
    },
    () => {
      // SciFi Mythical Suffix (e.g., "Void Phoenix Alpha")
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix} ${core} ${suffix}`;
    },

    // 2 Component Patterns
    () => {
      // PrefixCore (e.g., CyberDragon)
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      return `${prefix}${core}`;
    },
    () => {
      // Core-Suffix (e.g., Golem-Prime)
      const core = getRandomElement(components.cores);
      const suffix = getRandomElement(components.suffixes);
      return `${core}-${suffix}`;
    },
    () => {
      // Prefix Suffix (e.g., Astro Core, Meta-X) - using prefix and suffix directly
      const prefix = getRandomElement(components.prefixes);
      const suffix = getRandomElement(components.suffixes);
      return `${prefix} ${suffix}`; // Or `${prefix}-${suffix}` for a different feel
    },
    () => {
      // Prefix-Core (hyphenated)
      const prefix = getRandomElement(components.prefixes);
      const core = getRandomElement(components.cores);
      return `${prefix}-${core}`;
    },
    () => {
      // Core + random element that's not another core (e.g. Phoenix Alpha)
      const core = getRandomElement(components.cores);
      const otherPart =
        rng.next() < 0.5
          ? getRandomElement(components.prefixes)
          : getRandomElement(components.suffixes);
      return `${core} ${otherPart}`;
    },
  ];

  const chosenPattern = getRandomElement(nameGenerationPatterns);

  return chosenPattern();
}
