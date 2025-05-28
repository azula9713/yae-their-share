interface NameComponents {
  prefixes: string[];
  cores: string[];
  suffixes: string[];
}

function getRandomSciFiMythicalName(): string {
  const components: NameComponents = {
    prefixes: [
      "Astro", "Cyber", "Quantum", "Neo", "Hyper", "Ultra", "Meta",
      "Chrono", "Cosmo", "Stellar", "Void", "Nexus", "Flux", "Echo"
    ],
    cores: [
      "Phoenix", "Dragon", "Titan", "Sphinx", "Kraken", "Griffin",
      "Hydra", "Chimera", "Leviathan", "Pegasus", "Cerberus", "Minotaur",
      "Valkyrie", "Banshee", "Djinn", "Seraph", "Nephilim", "Golem"
    ],
    suffixes: [
      "", "X", "Prime", "Core", "Node", "Sync", "Wave", "Pulse",
      "Ion", "Byte", "Code", "Net", "Grid", "Link", "Hub", "Tech"
    ]
  };

  const prefix = components.prefixes[
    Math.floor(Math.random() * components.prefixes.length)
  ];
  const core = components.cores[
    Math.floor(Math.random() * components.cores.length)
  ];
  const suffix = components.suffixes[
    Math.floor(Math.random() * components.suffixes.length)
  ];

  return `${prefix} ${core} ${suffix}`;
}

// Examples: "AstroPhoenixX", "QuantumDragonCore", "VoidSphinxSync"