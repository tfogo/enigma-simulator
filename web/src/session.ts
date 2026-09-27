import enigma from "enigma-simulator";

export interface Entry {
  before: enigma.Snapshot;
  trace: enigma.Trace;
}
export interface Session {
  snapshot: enigma.Snapshot;
  entries: Entry[];
}
export type Action =
  | { type: "key"; letter: string }
  | { type: "reset" }
  | { type: "undo" }
  | { type: "configure"; snapshot: enigma.Snapshot };
export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const letters = (positions: readonly number[]) =>
  positions.map((n) => alphabet[n]).join("");
export function createSession(model: enigma.Model = "EnigmaI"): Session {
  return { snapshot: enigma({ model }).snapshot(), entries: [] };
}
export function sessionReducer(session: Session, action: Action): Session {
  if (action.type === "configure")
    return { snapshot: action.snapshot, entries: [] };
  if (action.type === "undo") {
    const last = session.entries.at(-1);
    return last
      ? { snapshot: last.before, entries: session.entries.slice(0, -1) }
      : session;
  }
  const machine = enigma.fromSnapshot(session.snapshot);
  if (action.type === "reset") {
    machine.reset();
    return { snapshot: machine.snapshot(), entries: [] };
  }
  if (session.entries.length >= 80) return session;
  const before = machine.snapshot();
  const trace = machine.pressKeyWithTrace(action.letter);
  return {
    snapshot: machine.snapshot(),
    entries: [...session.entries, { before, trace }],
  };
}
