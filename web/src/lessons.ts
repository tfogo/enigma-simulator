import type enigma from "enigma-simulator";

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  prerequisite: string;
  configuration: enigma.Configuration;
  source: string;
  question: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}
const configuration: enigma.Configuration = { model: "EnigmaI" };
export const lessons: Lesson[] = [
  {
    id: "first-keypress",
    title: "Your first keypress",
    objective: "See a keypress advance the machine and light a letter.",
    prerequisite: "No experience needed.",
    configuration,
    source: "mechanism",
    question: "Why can the same key produce a different letter?",
    choices: [
      {
        text: "The rotor changes the signal’s route.",
        correct: true,
        feedback: "The wiring is fixed, but its position changes.",
      },
      {
        text: "The keyboard chooses a random letter.",
        correct: false,
        feedback:
          "The circuit is deterministic: the same starting state and input give the same result.",
      },
    ],
  },
  {
    id: "repeated-letters",
    title: "Why repeated letters change",
    objective:
      "Distinguish a changing circuit from a guarantee of different output letters.",
    prerequisite: "Try lesson 1 first.",
    configuration,
    source: "mechanism",
    question: "Predict what happens when we press A thirty times.",
    choices: [
      {
        text: "The route changes; output letters can repeat.",
        correct: true,
        feedback:
          "Yes. A changing rotor position changes the substitution, but a later position can still light a letter seen before.",
      },
      {
        text: "Every output letter must be different.",
        correct: false,
        feedback:
          "There are only 26 lamps. Thirty keypresses must reuse at least one lamp, even though the rotor positions keep changing. Try again.",
      },
    ],
  },
  {
    id: "one-signal",
    title: "Follow one signal",
    objective:
      "Follow the plugboard, outward rotors, reflector, return rotors, and plugboard.",
    prerequisite: "Try lessons 1–2 first.",
    configuration: { model: "EnigmaI", plugboardPairs: "AB CD" },
    source: "mechanism",
    question: "How many times does one signal pass through each rotor?",
    choices: [
      {
        text: "Twice: outward and returning.",
        correct: true,
        feedback:
          "Exactly. The reflector connects the outward circuit to a return path. Each rotor and the plugboard participate in both directions.",
      },
      {
        text: "Once, before reaching the reflector.",
        correct: false,
        feedback:
          "The reflector sends the signal back through the rotor stack. Follow the dashed return line to the plugboard and lamp, then try again.",
      },
    ],
  },
  {
    id: "read-again",
    title: "Read the message again",
    objective:
      "Decipher using the same machine configuration and starting windows.",
    prerequisite: "Try lessons 1–3 first.",
    configuration,
    source: "mechanism",
    question:
      "What must we do before entering the ciphertext to read HELLO again?",
    choices: [
      {
        text: "Restore the same settings and starting windows.",
        correct: true,
        feedback:
          "Yes. Each ciphertext letter must meet the same circuit state as its original plaintext letter. The machine uses the same process in both directions.",
      },
      {
        text: "Keep the windows where encryption finished.",
        correct: false,
        feedback:
          "Those windows are already five steps ahead. Restore the starting state so the circuits line up with the original message, then try again.",
      },
    ],
  },
];
export interface LessonActivity {
  choice: number | null;
  ran: boolean;
  deciphered: boolean;
  triedWithoutReset: boolean;
}
export const freshActivity = (): LessonActivity => ({
  choice: null,
  ran: false,
  deciphered: false,
  triedWithoutReset: false,
});
const progressKey = "enigma.lessons.v1";
export function loadCompletions(): string[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(progressKey) ?? "[]",
    );
    return Array.isArray(saved)
      ? lessons.filter((l) => saved.includes(l.id)).map((l) => l.id)
      : [];
  } catch {
    return [];
  }
}
export function saveCompletions(ids: string[]) {
  try {
    localStorage.setItem(progressKey, JSON.stringify(ids));
  } catch {
    /* Optional progress works in memory when storage is unavailable. */
  }
}
