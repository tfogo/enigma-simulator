import { useState } from "react";
import enigma from "enigma-simulator";
import { alphabet } from "./session";

export default function Settings({
  configuration,
  onApply,
}: {
  configuration: enigma.ResolvedConfiguration;
  onApply: (snapshot: enigma.Snapshot) => void;
}) {
  const [draft, setDraft] = useState(configuration);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const profiles = enigma.getModelProfiles();
  const profile = profiles.find((p) => p.id === draft.model)!;
  function changeArray(
    field: "positions" | "ringSettings",
    slot: number,
    value: number,
  ) {
    setSaved("");
    setDraft((d) => ({
      ...d,
      [field]: d[field].map((v, i) => (i === slot ? value : v)),
    }));
  }
  return (
    <form
      className="settings-card"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          const machine = enigma(draft);
          onApply(machine.snapshot());
          setDraft(machine.getConfiguration());
          setError("");
          setSaved("Settings applied. Ready for a new message.");
        } catch (e) {
          setError((e as Error).message);
          setSaved("");
        }
      }}
    >
      <span className="eyebrow">SET UP YOUR MACHINE</span>
      <h2>
        Change one thing.
        <br />
        See what happens.
      </h2>
      <label>
        Machine model
        <select
          value={draft.model}
          onChange={(event) => {
            setDraft(
              enigma({
                model: event.target.value as enigma.Model,
              }).getConfiguration(),
            );
            setError("");
            setSaved("");
          }}
        >
          {profiles.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <div className="setting-rotors">
        {draft.rotors.map((rotor, slot) => (
          <fieldset key={slot}>
            <legend>
              Slot {slot + 1}
              {slot === 0
                ? " · left"
                : slot === draft.rotors.length - 1
                  ? " · right"
                  : ""}
            </legend>
            <label>
              Rotor
              <select
                aria-label={`Rotor in slot ${slot + 1}`}
                value={rotor}
                onChange={(event) => {
                  setSaved("");
                  setDraft((d) => ({
                    ...d,
                    rotors: d.rotors.map((r, i) =>
                      i === slot ? (event.target.value as enigma.RotorName) : r,
                    ),
                  }));
                }}
              >
                {(draft.model === "M4" && slot === 0
                  ? profile.greekRotors
                  : profile.movingRotors
                ).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              Start
              <select
                aria-label={`Start in slot ${slot + 1}`}
                value={draft.positions[slot]}
                onChange={(e) =>
                  changeArray("positions", slot, Number(e.target.value))
                }
              >
                {[...alphabet].map((a, i) => (
                  <option key={a} value={i}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ring
              <select
                aria-label={`Ring in slot ${slot + 1}`}
                value={draft.ringSettings[slot]}
                onChange={(e) =>
                  changeArray("ringSettings", slot, Number(e.target.value))
                }
              >
                {[...alphabet].map((a, i) => (
                  <option key={a} value={i}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
        ))}
      </div>
      <label>
        Reflector
        <select
          value={draft.reflector}
          onChange={(e) => {
            setSaved("");
            setDraft((d) => ({
              ...d,
              reflector: e.target.value as enigma.ReflectorName,
            }));
          }}
        >
          {profile.reflectors.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label>
        Plugboard pairs
        <input
          placeholder="AB CD EF"
          value={draft.plugboardPairs}
          spellCheck={false}
          autoCapitalize="characters"
          onChange={(e) => {
            setSaved("");
            setDraft((d) => ({ ...d, plugboardPairs: e.target.value }));
          }}
        />
      </label>
      <p className="tiny muted">
        Use uppercase pairs. Each letter can have one partner.
      </p>
      <p className="tiny">
        Applying settings starts a new message. Your lesson is kept separately.
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="success">
          {saved}
        </p>
      )}
      <button className="primary" type="submit">
        Apply & start fresh <span>→</span>
      </button>
      <details className="source-note">
        <summary>About this model</summary>
        <p>{profile.notes}</p>
        <a href={profile.sources[0].url} target="_blank" rel="noreferrer">
          Check the historical wiring ↗
        </a>
      </details>
    </form>
  );
}
