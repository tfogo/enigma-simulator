import { useState } from "react";
import type enigma from "enigma-simulator";
import { letters, type Session } from "./session";
import { makeShareLink, parseSnapshot } from "./transport";

export default function SessionTools({
  session,
  onRestore,
}: {
  session: Session;
  onRestore: (snapshot: enigma.Snapshot) => void;
}) {
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [share, setShare] = useState("");
  function exportSettings() {
    const blob = new Blob([JSON.stringify(session.snapshot, null, 2) + "\n"], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "enigma-settings.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      `Settings exported at ${letters(session.snapshot.state.positions)}.`,
    );
  }
  return (
    <section className="session-tools" aria-labelledby="session-title">
      <p className="eyebrow">KEEP YOUR EXPERIMENT</p>
      <h2 id="session-title">Pick up where you left off.</h2>
      <p className="tiny muted">
        Save the current windows to continue later, or share the starting
        settings so someone can decipher your output. These contain settings
        only; your message is not included.
      </p>
      <div className="message-utilities">
        <button className="secondary" onClick={exportSettings}>
          Export current settings
        </button>
        <button
          className="secondary"
          onClick={async () => {
            const link = makeShareLink(session.start);
            setShare(link);
            try {
              await navigator.clipboard.writeText(link);
              setStatus("Starting-settings link copied.");
            } catch {
              setStatus("Select and copy the starting-settings link below.");
            }
          }}
        >
          Share starting settings
        </button>
      </div>
      {share && (
        <label>
          Starting-settings link
          <textarea
            rows={3}
            readOnly
            value={share}
            onFocus={(event) => event.target.select()}
          />
          <span className="tiny muted">
            This is the link generated when you pressed Share. Create another
            after changing settings.
          </span>
        </label>
      )}
      <details>
        <summary>Restore saved settings</summary>
        <p className="tiny muted">
          Paste the exported JSON. Restoring clears this message and resumes at
          the saved windows. Reset will return to those windows; the lesson is
          kept separately.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setStatus("");
            try {
              const snapshot = parseSnapshot(importText);
              onRestore(snapshot);
              setError("");
              setImportText("");
              setShare("");
              setStatus(
                `Settings restored. Message starts at ${letters(snapshot.state.positions)}.`,
              );
            } catch (cause) {
              setError(
                cause instanceof Error ? cause.message : "Invalid settings.",
              );
            }
          }}
        >
          <label>
            Saved settings JSON
            <textarea
              rows={5}
              maxLength={12001}
              spellCheck={false}
              value={importText}
              onChange={(event) => {
                setImportText(event.target.value);
                setError("");
              }}
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="secondary" disabled={!importText.trim()}>
            Restore settings & start fresh
          </button>
        </form>
      </details>
      <p className="tiny" role="status">
        {status}
      </p>
    </section>
  );
}
