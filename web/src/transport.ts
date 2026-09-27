import enigma from "enigma-simulator";

const MAX_IMPORT_LENGTH = 12000;
export function parseSnapshot(text: string): enigma.Snapshot {
  if (text.length > MAX_IMPORT_LENGTH)
    throw new Error("The settings file is too large.");
  return enigma.deserialize(text).snapshot();
}
export function makeShareLink(start: enigma.Snapshot): string {
  const snapshot = enigma.fromSnapshot(start).snapshot();
  // Engine snapshots contain only validated ASCII model names, letters and numbers.
  const payload = btoa(JSON.stringify({ version: 1, snapshot }));
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = `enigma=${payload}`;
  return url.href;
}
export function readShareLink(hash: string): {
  snapshot?: enigma.Snapshot;
  error?: string;
} {
  if (!hash.startsWith("#enigma=")) return {};
  try {
    if (hash.length > MAX_IMPORT_LENGTH)
      throw new Error("Shared settings are too large.");
    const value = JSON.parse(atob(hash.slice(8)));
    if (
      !value ||
      typeof value !== "object" ||
      value.version !== 1 ||
      Object.keys(value).length !== 2 ||
      !Object.hasOwn(value, "snapshot")
    ) {
      throw new Error("Unsupported share-link version or format.");
    }
    return { snapshot: enigma.fromSnapshot(value.snapshot).snapshot() };
  } catch (error) {
    return {
      error: `Could not open shared settings. ${error instanceof Error ? error.message : "Invalid link."}`,
    };
  }
}
export function readGroupingPreference(): boolean {
  try {
    return localStorage.getItem("enigma.preferences.v1.groupOutput") === "true";
  } catch {
    return false;
  }
}
export function saveGroupingPreference(value: boolean): void {
  try {
    localStorage.setItem("enigma.preferences.v1.groupOutput", String(value));
  } catch {
    /* The preference still applies for this visit when storage is unavailable. */
  }
}
