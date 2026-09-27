import { useState } from "react";
import {
  groupLetters,
  MESSAGE_LIMIT,
  normalizeMessage,
  type Session,
} from "./session";

export default function MessageTools({
  session,
  draft,
  onDraft,
  onAppend,
  selected,
  onSelect,
  grouped,
  onGrouped,
}: {
  session: Session;
  draft: string;
  onDraft: (text: string) => void;
  onAppend: (text: string) => void;
  selected: number | null;
  onSelect: (index: number | null) => void;
  grouped: boolean;
  onGrouped: (value: boolean) => void;
}) {
  const [status, setStatus] = useState("");
  const normalized = normalizeMessage(draft);
  const omitted = [...draft].length - normalized.length;
  const remaining = MESSAGE_LIMIT - session.entries.length;
  const output = session.entries.map((entry) => entry.trace.output).join("");
  return (
    <section className="message-tools" aria-labelledby="message-title">
      <p className="eyebrow">YOUR MESSAGE</p>
      <h2 id="message-title">Write, check, then send.</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!normalized || normalized.length > remaining) return;
          onAppend(normalized);
          onDraft("");
          setStatus(`${normalized.length} letters added to the message.`);
        }}
      >
        <label>
          Message to append
          <textarea
            maxLength={5000}
            rows={3}
            value={draft}
            onChange={(event) => {
              onDraft(event.target.value);
              setStatus("");
            }}
            placeholder="Type or paste a message…"
            aria-describedby="normalization-rule"
          />
        </label>
        <p id="normalization-rule" className="tiny muted">
          Only A–Z letters are sent. Lowercase becomes uppercase; spaces,
          punctuation, digits, and accented letters are omitted. This is a
          teaching convention, not a historical message procedure.
        </p>
        <div className="message-preview">
          <span className="eyebrow">EXACT INPUT PREVIEW</span>
          <p data-testid="normalized-preview">
            {normalized || "No letters to send yet."}
          </p>
        </div>
        <p className="tiny" role="status">
          {normalized.length} letters to send · {omitted} characters omitted ·{" "}
          {remaining} spaces remaining
        </p>
        {normalized.length > remaining && (
          <p role="alert" className="error">
            This would exceed {MESSAGE_LIMIT} letters. Shorten the draft or
            reset the message; nothing has been added.
          </p>
        )}
        <button
          className="primary"
          disabled={!normalized || normalized.length > remaining}
        >
          Append previewed letters →
        </button>
      </form>
      <div className="message-utilities">
        <label className="check-label">
          <input
            type="checkbox"
            checked={grouped}
            onChange={(event) => onGrouped(event.target.checked)}
          />{" "}
          Group output in fives
        </label>
        <button
          className="secondary"
          disabled={!output}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                grouped ? groupLetters(output) : output,
              );
              setStatus("Output copied.");
            } catch {
              setStatus(
                "Clipboard unavailable. Select the output in the machine’s message record and copy it.",
              );
            }
          }}
        >
          Copy output
        </button>
      </div>
      {session.entries.length > 0 && (
        <label>
          Inspect a keypress
          <select
            value={selected ?? "latest"}
            onChange={(event) =>
              onSelect(
                event.target.value === "latest"
                  ? null
                  : Number(event.target.value),
              )
            }
          >
            <option value="latest">Latest keypress</option>
            {session.entries.map((entry, index) => (
              <option key={index} value={index}>
                {index + 1}. {entry.trace.input} → {entry.trace.output}
              </option>
            ))}
          </select>
          <span className="tiny muted">
            Inspecting earlier letters leaves the live machine unchanged.
          </span>
        </label>
      )}
      <p role="status" className="tiny">
        {status}
      </p>
    </section>
  );
}
