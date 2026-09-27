import sourceLedger from "../../docs/sources.json";

export const readings = [
  {
    id: "mechanism",
    title: "How does an Enigma machine work?",
    author: "Crypto Museum",
    kind: "Illustrated introduction",
    level: "Start here",
    topic: "Mechanics",
    sourceId: "crypto-museum-working",
    locator: "Circuit diagram; rotor stepping; reflector",
    note: "Follow the electrical circuit and see why the rotors step before the lamp lights. Its period figure is discussed in our research note below.",
  },
  {
    id: "commercial",
    title: "Enigma K: the commercial machine",
    author: "Crypto Museum",
    kind: "Museum collection",
    level: "Start here",
    topic: "History",
    sourceId: "crypto-museum-k",
    locator: "Introduction and standard version",
    note: "Photographs and descriptions of the 1927 commercial model and its variants.",
  },
  {
    id: "poland",
    title: "The Pyry Forest Meeting",
    author: "GCHQ · 21 July 2020",
    kind: "Historical account",
    level: "Start here",
    topic: "History",
    sourceId: "gchq-pyry",
    locator: "Opening account and description of the 1939 exchange",
    note: "How Polish cryptanalysts shared their advances with French and British colleagues before the war.",
  },
  {
    id: "bombe",
    title: "The Turing–Welchman Bombe",
    author: "The National Museum of Computing",
    kind: "Museum explanation",
    level: "Go deeper",
    topic: "History",
    sourceId: "tnmoc-bombe",
    locator: "The Bombe and its reconstruction",
    note: "Learn about the machine built to help find Enigma settings and the work of the reconstruction team.",
  },
  {
    id: "wiring",
    title: "Enigma wiring catalogue",
    author: "Crypto Museum",
    kind: "Technical reference",
    level: "Go deeper",
    topic: "Mechanics",
    sourceId: "crypto-museum-wiring",
    locator: "Enigma I, M3 and M4 tables",
    note: "Check the exact rotor and reflector connections behind the simulator’s military-machine profiles.",
  },
  {
    id: "variations",
    title: "Enigma Variations: An Extended Family of Machines",
    author: "David H. Hamer, Geoff Sullivan & Frode Weierud",
    kind: "Research paper · PDF",
    level: "Go deeper",
    topic: "Mechanics",
    sourceId: "enigma-variations",
    locator: "Page 6: The Multiple Turnover Machines",
    note: "A technical tour of the Enigma family, including the distinction between Enigma and gear-driven stepping.",
  },
  {
    id: "1930",
    title: "The Enigma Test Message from 1930",
    author: "Frode Weierud",
    kind: "Historical document transcription",
    level: "Go deeper",
    topic: "Messages",
    sourceId: "crypto-cellar-1930",
    locator: "Key settings, ciphertext and decrypts",
    note: "A worked example from an operating manual, reproduced with the settings needed to check it. We checked this transcription, not the archive original.",
  },
  {
    id: "naval",
    title: "Enigma M4",
    author: "Crypto Museum",
    kind: "Museum collection",
    level: "Start here",
    topic: "History",
    sourceId: "crypto-museum-m4",
    locator: "Reflector; using the M4 in M3-compatible mode",
    note: "See how the fourth rotor and thin reflector work together, including compatibility with three-rotor machines.",
  },
].map((reading) => {
  const evidence = sourceLedger.find(
    (source) => source.id === reading.sourceId,
  );
  if (!evidence) throw new Error(`Missing source ${reading.sourceId}`);
  return {
    ...reading,
    url: evidence.url,
    accessed: evidence.accessed,
    evidence:
      evidence.notes ?? "The listed claims were checked against this source.",
    claims: evidence.claims,
  };
});
export const history = [
  {
    era: "1927",
    title: "Before the battlefield",
    text: "Enigma was a family of machines with commercial as well as military branches. The commercial Enigma K, introduced in 1927, used three cipher rotors and a manually settable reflector.",
    source: "commercial",
    question: "A family, not a single machine",
    detail:
      "Different models could have different wiring and mechanics. The military machine in this lesson is only one part of that family.",
  },
  {
    era: "1930 MANUAL",
    title: "An operator needed more than a machine",
    text: "A surviving manual example specifies rotor order, ring settings, plugboard pairs, and starting windows. Its six-letter indicator recovers a message key; the body begins from that new position.",
    source: "1930",
    question: "Reproduce the documented example",
    detail:
      "Frode Weierud transcribes an example from a manual translation held under HW25/9 at the British National Archives. We checked the transcription, not the archival original. This is a training example predating the war, not an intercepted wartime message. Try its indicator or body below; each starts a fresh Explore message.",
  },
  {
    era: "1939",
    title: "Knowledge shared in Poland",
    text: "In July 1939, Polish cryptanalysts shared their Enigma work with French and British colleagues near Warsaw. Their progress transformed the British approach to the problem.",
    source: "poland",
    question: "Why start the story here?",
    detail:
      "The wartime effort grew from earlier achievements and cooperation. GCHQ’s account describes the importance of the Polish work and Marian Rejewski’s later discussions with Alan Turing.",
  },
  {
    era: "WARTIME INTERCEPTION",
    title: "From radio traffic to a cryptanalytic problem",
    text: "Y stations intercepted communications, including Enigma traffic. At Bletchley Park, codebreakers used cribs—suspected plaintext—to test possible keys. Interception and key recovery were distinct parts of the work.",
    source: "bombe",
    question: "What did a crib contribute?",
    detail:
      "A crib suggested a possible correspondence between plaintext and ciphertext. The Bombe mechanised testing constraints from such guesses; it did not simply accept any intercepted message and print its meaning.",
  },
  {
    era: "WARTIME",
    title: "Finding the settings",
    text: "The Turing–Welchman Bombe helped the codebreakers search for Enigma settings. It was a separate machine with a different job from the Enigma used to encipher messages.",
    source: "bombe",
    question: "Meet another machine",
    detail:
      "Turing’s approach and Welchman’s diagonal board helped mechanise the search. The museum also describes the British Tabulating Machine Company’s engineering work and the people who operated the machines. Some keys were never recovered.",
  },
  {
    era: "NAVAL M4",
    title: "A fourth rotor, a new variable",
    text: "The naval M4 added a thin Greek rotor beside its thin reflector. This rotor could be set by the operator but did not step as letters were typed.",
    source: "naval",
    question: "Try it for yourself",
    detail:
      "Choose M4 in Explore and type a few letters. Watch the leftmost window stay still while the fast rotor advances.",
  },
];
