import enigma from "enigma-simulator";

export const MESSAGE_LIMIT = 500;
export interface Entry {
  before: enigma.Snapshot;
  trace: enigma.Trace;
}
export interface Session {
  start: enigma.Snapshot;
  snapshot: enigma.Snapshot;
  entries: Entry[];
}
export type Action =
  | { type: "key"; letter: string }
  | { type: "append"; text: string }
  | { type: "reset" }
  | { type: "undo" }
  | { type: "configure"; snapshot: enigma.Snapshot };
export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const letters = (positions: readonly number[]) =>
  positions.map((n) => alphabet[n]).join("");
export const normalizeMessage = (text: string) =>
  text.replace(/[^a-z]/gi, "").toUpperCase();
export const groupLetters = (text: string) =>
  text.match(/.{1,5}/g)?.join(" ") ?? "";
export function sessionFromSnapshot(snapshot: enigma.Snapshot): Session {
  const validated = enigma.fromSnapshot(snapshot).snapshot();
  return { start: validated, snapshot: validated, entries: [] };
}
export function createSession(model: enigma.Model = "EnigmaI"): Session {
  return sessionFromSnapshot(enigma({ model }).snapshot());
}
export function sessionReducer(session: Session, action: Action): Session {
  if (action.type === "configure") return sessionFromSnapshot(action.snapshot);
  if (action.type === "undo") {
    const last = session.entries.at(-1);
    return last
      ? {
          ...session,
          snapshot: last.before,
          entries: session.entries.slice(0, -1),
        }
      : session;
  }
  if (action.type === "reset") return sessionFromSnapshot(session.start);
  const text = action.type === "key" ? action.letter : action.text;
  // Reject the whole batch, so no prefix is silently enciphered.
  if (
    !/^[A-Z]+$/.test(text) ||
    session.entries.length + text.length > MESSAGE_LIMIT
  )
    return session;
  const machine = enigma.fromSnapshot(session.snapshot);
  const entries = [...session.entries];
  for (const letter of text) {
    const before = machine.snapshot();
    entries.push({ before, trace: machine.pressKeyWithTrace(letter) });
  }
  return { ...session, snapshot: machine.snapshot(), entries };
}
