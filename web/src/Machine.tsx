import type { Dispatch } from "react";
import {
  alphabet,
  letters,
  groupLetters,
  MESSAGE_LIMIT,
  type Action,
  type Session,
} from "./session";

const rows = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
export default function Machine({
  session,
  dispatch,
  onKey,
  learning,
  grouped = false,
}: {
  session: Session;
  dispatch: Dispatch<Action>;
  onKey: (letter: string) => void;
  learning: boolean;
  grouped?: boolean;
}) {
  const { configuration: config, state } = session.snapshot;
  const last = session.entries.at(-1)?.trace;
  const plaintext = session.entries.map((e) => e.trace.input).join("");
  const ciphertext = session.entries.map((e) => e.trace.output).join("");
  return (
    <section className="machine-shell" aria-label="Enigma machine">
      <div className="panel-heading">
        <span className="eyebrow">THE MACHINE</span>
        <span className="muted tiny">Interactive reconstruction</span>
      </div>
      <div className="machine">
        <div className="machine-top">
          <span className="machine-name">
            {config.model === "EnigmaI" ? "ENIGMA I" : `ENIGMA ${config.model}`}
          </span>
          <span className="ready">
            <i />
            {last ? "CIRCUIT COMPLETE" : "READY TO ENCODE"}
          </span>
        </div>
        <div
          className="rotor-bank"
          role="group"
          aria-label={`Current windows ${letters(state.positions)}`}
        >
          {config.rotors.map((rotor, i) => (
            <div className="rotor" key={i}>
              <span className="rotor-name">{rotor}</span>
              <div
                className={`rotor-window ${last?.stepping[i].moved ? "moved" : ""}`}
              >
                <span className="ghost-letter" aria-hidden="true">
                  {alphabet[(state.positions[i] + 25) % 26]}
                </span>
                <strong>{alphabet[state.positions[i]]}</strong>
                <span className="ghost-letter" aria-hidden="true">
                  {alphabet[(state.positions[i] + 1) % 26]}
                </span>
              </div>
              <span className="rotor-detail">
                {config.model === "M4" && i === 0
                  ? "STATIONARY"
                  : i === config.rotors.length - 1
                    ? "FAST ROTOR"
                    : "ROTOR"}
              </span>
            </div>
          ))}
        </div>
        <div className="machine-rule">
          <span>LAMPBOARD</span>
          <span>{last ? `${last.input} → ${last.output}` : "OUTPUT"}</span>
        </div>
        <div
          className="lampboard"
          role="group"
          aria-label={
            last ? `Output lamp ${last.output}` : "No output lamp lit"
          }
        >
          {rows.map((row) => (
            <div className="key-row" key={row}>
              {[...row].map((letter) => (
                <span
                  aria-hidden="true"
                  className={`lamp ${last?.output === letter ? "lit" : ""}`}
                  key={letter}
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="machine-rule">
          <span>KEYBOARD</span>
          <span>INPUT</span>
        </div>
        <div
          className="keyboard"
          role="group"
          tabIndex={0}
          aria-label="Machine keyboard"
          aria-describedby="keyboard-help"
          onKeyDown={(event) => {
            if (
              event.ctrlKey ||
              event.metaKey ||
              event.altKey ||
              event.nativeEvent.isComposing ||
              event.repeat
            )
              return;
            if (/^[a-zA-Z]$/.test(event.key)) {
              event.preventDefault();
              onKey(event.key.toUpperCase());
            }
          }}
        >
          {rows.map((row) => (
            <div className="key-row" key={row}>
              {[...row].map((letter) => (
                <button
                  type="button"
                  aria-label={`Press ${letter}`}
                  className={`machine-key ${last?.input === letter ? "pressed" : ""} ${learning && !last && letter === "A" ? "suggested" : ""}`}
                  key={letter}
                  onClick={() => onKey(letter)}
                  disabled={session.entries.length >= MESSAGE_LIMIT}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </div>
        <p id="keyboard-help" className="keyboard-help">
          Click a key, or focus the keyboard and type A–Z.
        </p>
        <div className="machine-base">
          <span>REFLECTOR {config.reflector.replace("Thin", " · THIN")}</span>
          <span>
            RINGS {letters(config.ringSettings)} ·{" "}
            {config.plugboardPairs
              ? config.plugboardPairs.split(" ").length
              : 0}{" "}
            PLUGS
          </span>
        </div>
      </div>
      <div className="transcript" role="group" aria-label="Message record">
        <div>
          <span className="eyebrow">YOU TYPE</span>
          <p data-testid="plaintext">
            {plaintext || (
              <span className="placeholder">Your first letter…</span>
            )}
          </p>
        </div>
        <div>
          <span className="eyebrow">THE MACHINE LIGHTS</span>
          <p data-testid="ciphertext">
            {(grouped ? groupLetters(ciphertext) : ciphertext) || (
              <span className="placeholder">A new letter appears</span>
            )}
          </p>
        </div>
      </div>
      <div className="machine-actions">
        <span className="tiny muted">
          Start {letters(session.start.state.positions)}{" "}
          <span aria-hidden="true">/</span> Now {letters(state.positions)} ·{" "}
          {session.entries.length}/{MESSAGE_LIMIT} letters
        </span>
        <div>
          <button
            className="text-button"
            onClick={() => dispatch({ type: "undo" })}
            disabled={!last}
          >
            ↶ Undo
          </button>
          <button
            className="text-button"
            onClick={() => dispatch({ type: "reset" })}
            disabled={!last}
          >
            ↺ Reset message
          </button>
        </div>
      </div>
      <p className="sr-only" role="status">
        {last
          ? `${last.input} enciphered as ${last.output}. Current windows ${letters(state.positions)}.`
          : `Machine ready. Current windows ${letters(state.positions)}.`}
      </p>
    </section>
  );
}
