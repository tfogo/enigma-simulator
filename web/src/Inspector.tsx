import type { Playback } from "./usePlayback";
import type enigma from "enigma-simulator";
import { alphabet, letters } from "./session";

const reasonText: Record<enigma.StepReason, string> = {
  keypress: "advances on every keypress",
  "right-neighbor-at-notch": "is pushed by the rotor to its right",
  "at-notch": "is at its own notch and advances with the rotor to its left",
  "no-turnover": "stays in place",
  stationary: "is set by hand and stays in place",
};
export default function Inspector({
  trace,
  playback,
}: {
  trace?: enigma.Trace;
  playback: Playback;
}) {
  const { active, playing } = playback;
  const length = trace?.stages.length ?? 0;
  const guided = playback.mode === "guided";
  const stage = trace?.stages[active - 1];
  const columns = trace
    ? [...trace.stages.filter((s) => s.direction === "forward")].reverse()
    : [];
  const diagram = trace
    ? [trace.stages.find((s) => s.kind === "reflector")!, ...columns]
    : [];
  const width = Math.max(560, diagram.length * 92);
  return (
    <section className="inspector" aria-labelledby="inspector-title">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">UNDER THE LID</span>
          <h2 id="inspector-title">Follow the signal</h2>
        </div>
        <span className="tag">
          {trace
            ? `${trace.input} → ${guided && active < length ? "…" : trace.output}`
            : "ONE KEYPRESS"}
        </span>
      </div>
      {!trace ? (
        <div className="inspector-empty">
          <span className="circuit-symbol" aria-hidden="true">
            ⌁
          </span>
          <p>Press a key to open the circuit.</p>
          <span className="muted">
            See every connection, from keyboard to lamp.
          </span>
        </div>
      ) : (
        <>
          <div
            className="signal-viewport"
            tabIndex={0}
            role="region"
            aria-label="Signal diagram"
          >
            <svg
              viewBox={`0 0 ${width} 154`}
              role="img"
              aria-label={`Circuit for key ${trace.input}. The signal goes through the rotors to the reflector and back. Current stage: ${active < 1 ? "rotor movement" : active}.`}
            >
              <defs>
                <marker
                  id="forward-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0 0 L6 3 L0 6" fill="#315f4a" />
                </marker>
                <marker
                  id="return-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0 0 L6 3 L0 6" fill="#985018" />
                </marker>
              </defs>
              <path
                d={`M${width - 35} 53 H38 Q18 53 18 76 Q18 104 38 104 H${width - 35}`}
                fill="none"
                stroke="#c9c7ba"
                strokeWidth="2"
              />
              <path
                d={`M${width - 42} 53 H42`}
                markerEnd="url(#forward-arrow)"
                stroke="#315f4a"
                strokeWidth="2"
              />
              <path
                d={`M42 104 H${width - 42}`}
                markerEnd="url(#return-arrow)"
                stroke="#985018"
                strokeDasharray="4 3"
                strokeWidth="2"
              />
              {diagram.map((item, i) => {
                const x = 10 + i * ((width - 10) / diagram.length);
                const returning = trace.stages.find(
                  (s) =>
                    s.componentId === item.componentId &&
                    s.direction === "return",
                );
                const forwardSeen =
                  !guided || active >= trace.stages.indexOf(item) + 1;
                const returnSeen =
                  !guided ||
                  (returning && active >= trace.stages.indexOf(returning) + 1);
                return (
                  <g key={item.componentId}>
                    <rect
                      x={x + 8}
                      y="26"
                      width="66"
                      height="100"
                      rx="7"
                      fill={
                        stage?.componentId === item.componentId
                          ? "#e2ebdd"
                          : "#f6f4ed"
                      }
                      stroke={
                        stage?.componentId === item.componentId
                          ? "#315f4a"
                          : "#d8d6c9"
                      }
                      strokeWidth={
                        stage?.componentId === item.componentId ? 2 : 1
                      }
                    />
                    <text
                      x={x + 41}
                      y="16"
                      textAnchor="middle"
                      className="svg-label"
                    >
                      {item.kind === "rotor"
                        ? item.name
                        : item.kind === "reflector"
                          ? `UKW ${item.name}`
                          : item.kind === "plugboard"
                            ? "PLUGS"
                            : "ETW"}
                    </text>
                    <text
                      x={x + 41}
                      y="59"
                      textAnchor="middle"
                      className="svg-contact forward"
                    >
                      {forwardSeen
                        ? `${item.outputLetter} ← ${item.inputLetter}`
                        : "… ← …"}
                    </text>
                    <text
                      x={x + 41}
                      y="109"
                      textAnchor="middle"
                      className="svg-contact returning"
                    >
                      {returning
                        ? returnSeen
                          ? `${returning.inputLetter} → ${returning.outputLetter}`
                          : "… → …"
                        : "↳"}
                    </text>
                    {item.kind === "rotor" && (
                      <text
                        x={x + 41}
                        y="146"
                        textAnchor="middle"
                        className="svg-label"
                      >
                        WINDOW{" "}
                        {
                          alphabet[
                            active < 0
                              ? trace.positionsBefore[item.slot]
                              : item.position
                          ]
                        }
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="signal-legend">
            <span>
              <i className="solid-line" /> To reflector ←
            </span>
            <span>
              <i className="dashed-line" /> Back to lamp →
            </span>
          </div>
          <div className="trace-description" aria-live="polite">
            <span className="step-number">
              {String(active + 2).padStart(2, "0")}
            </span>
            <div>
              <h3>
                {stage
                  ? `${stage.kind === "rotor" ? "Rotor " : ""}${stage.name}: ${stage.inputLetter} → ${stage.outputLetter}`
                  : active < 0
                    ? "Before the rotors move."
                    : "First, the rotors move."}
              </h3>
              <p>
                {stage
                  ? stage.kind === "rotor"
                    ? `Window ${alphabet[stage.position]}, ring ${alphabet[stage.ringSetting]}. The ${stage.direction === "forward" ? "outward" : "return"} signal enters contact ${stage.inputLetter} and leaves at ${stage.outputLetter}.`
                    : stage.kind === "reflector"
                      ? "The reflector sends the signal back through the rotors along a different connection."
                      : stage.kind === "entry-wheel"
                        ? "The entry wheel connects the keyboard circuit to the rotor stack. Here it leaves the letter unchanged."
                        : stage.input === stage.output
                          ? "This letter has no plugboard cable, so it passes through unchanged."
                          : "A plugboard cable swaps this letter with its connected partner."
                  : active < 0
                    ? `Windows ${letters(trace.positionsBefore)}. The key is pressed; rotor movement comes before the electrical circuit.`
                    : `${letters(trace.positionsBefore)} → ${letters(trace.positionsAfter)}. ${trace.stepping
                        .filter((s) => s.moved)
                        .map(
                          (s) =>
                            `Rotor ${s.rotor} ${s.reasons.map((r) => reasonText[r]).join(" and ")}`,
                        )
                        .join(". ")}.`}
              </p>
            </div>
          </div>
          <div className="trace-controls">
            <button className="secondary" onClick={playback.play}>
              {playing ? "Pause replay" : "Play replay"}
            </button>
            <button
              className="text-button"
              onClick={playback.back}
              aria-disabled={active === -1}
            >
              ← Back
            </button>
            <button
              className="text-button"
              onClick={playback.next}
              aria-disabled={active === length}
            >
              Next connection →
            </button>
            <button
              className="text-button"
              onClick={playback.finish}
              aria-disabled={active === length}
            >
              Show result now
            </button>
            <span className="tiny muted">
              {active + 2} / {length + 2}
            </span>
          </div>
          <details className="trace-table">
            <summary>Read the complete electrical trace</summary>
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Electrical trace table"
            >
              <table>
                <caption className="sr-only">
                  Electrical connections in traversal order
                </caption>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Direction</th>
                    <th>Input</th>
                    <th>Output</th>
                  </tr>
                </thead>
                <tbody>
                  {trace.stages.map((s, i) => (
                    <tr key={i}>
                      <td>{s.name}</td>
                      <td>{s.direction}</td>
                      <td>{s.inputLetter}</td>
                      <td>{s.outputLetter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}
