export const glossary = [
  {
    term: "Plaintext",
    definition:
      "The readable letters entered before enciphering, or recovered after deciphering.",
    source: "1930",
    locator: "Ciphertext only; Decrypts",
  },
  {
    term: "Ciphertext",
    definition:
      "The enciphered letters. To recover the original message, the receiving machine needs the corresponding settings and starting state.",
    source: "1930",
    locator: "Key settings; Ciphertext only; Decrypts",
  },
  {
    term: "Rotor",
    definition:
      "A wired wheel that connects input contacts to output contacts. Turning it changes the connections presented to the rest of the circuit.",
    source: "mechanism",
    locator: "Rotor wiring, first paragraph",
  },
  {
    term: "Window position",
    definition:
      "The letter visible at a rotor window. It records that rotor’s current rotational position; it is distinct from the ring setting.",
    source: "mechanism",
    locator: "Rotor wiring; Rotor stepping, window description",
  },
  {
    term: "Ring setting",
    definition:
      "The alignment of a rotor’s alphabet ring relative to its wired core. Changing a ring setting is different from simply turning the window to another letter.",
    source: "mechanism",
    locator: "Setup paragraph before Rotors; Rotor stepping, index-ring paragraph",
  },
  {
    term: "Plugboard",
    definition:
      "Paired cables swap letters before the rotor stack and again on the return path. An unpaired letter passes through unchanged.",
    source: "mechanism",
    locator: "The Steckerbrett; circuit description",
  },
  {
    term: "Reflector",
    definition:
      "The component that redirects the outward signal back through the rotors along a different connection.",
    source: "mechanism",
    locator: "Reflector UKW, first paragraph",
  },
  {
    term: "Indicator",
    definition:
      "Message information used as part of an operating procedure. In the 1930 example, its first six enciphered letters recover a repeated three-letter message key. Procedures differed over time.",
    source: "1930",
    locator: "Paragraph after Enciphered message; indicator PKPJXI and repeated key ABL",
  },
  {
    term: "Crib",
    definition:
      "Suspected plaintext compared with ciphertext to constrain a search for settings.",
    source: "bombe",
    locator: "The Bombe, paragraph on Turing’s crib-based attack",
  },
  {
    term: "Bombe",
    definition:
      "A separate codebreaking machine used to help search for Enigma settings using constraints derived from cribs.",
    source: "bombe",
    locator: "The Bombe, opening and mechanisation paragraphs",
  },
];
