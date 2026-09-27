import enigma from "enigma-simulator";
import vectors from "../../test/fixtures/reference-vectors.json";

export const historicalExamples = [
  "enigma-i-1930-indicator",
  "enigma-i-1930-body",
].map((id) => {
  const vector = vectors.find((item) => item.id === id)!;
  const configuration: enigma.Configuration = {
    model: "EnigmaI",
    rotors: vector.rotors as enigma.RotorName[],
    positions: vector.positions,
    ringSettings: vector.ringSettings,
    reflector: vector.reflector as enigma.ReflectorName,
    plugboardPairs: vector.plugboard,
  };
  // Validate the shared fixture at startup rather than accept a broken preset.
  const snapshot = enigma(configuration).snapshot();
  return {
    id,
    title: id.endsWith("indicator") ? "1930 indicator" : "1930 message body",
    snapshot,
    ciphertext: vector.ciphertext,
    plaintext: vector.plaintext,
    locator: vector.locator,
    notes: vector.notes,
  };
});
