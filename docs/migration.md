# Migration from the published 3.0.0 package

These changes are unreleased and intended for a future major version. No frontend or publication is included in M2.

## Existing applications

The positional factory and default ciphertext remain supported:

```js
const enigma = require('enigma-simulator');
const machine = enigma(['III', 'II', 'I'], [0, 0, 0], [0, 0, 0], 'B', '');
machine.encodeString('ABC'); // FUV
```

- The supported Node baseline is now 22.12.0. The development setup uses a lockfile, modern Mocha, and TypeScript only for declaration tests.
- Non-default M4 output is corrected: version 3.0.0 repeatedly reversed settings arrays and assigned some positions/rings incorrectly. Existing ciphertext generated with that bug may not decode under its intended settings; recover and record the actual old configuration before migrating that data.
- Caller arrays are no longer modified. Invalid settings, duplicate/misplaced rotors, incompatible reflectors, and malformed/reused plugboard pairs throw errors.
- Text must be uppercase A–Z. An invalid character anywhere in a message rejects the whole operation before stepping. Apply a deliberate normalization policy before calling the engine.
- `encodeChar()` continues to inspect without stepping. Use `pressKey()` for a keypress, and `pressKeyWithTrace()` when you need an explanation. Neither requires a separate call to `cycleRotors()`.
- Rotor positions are normalized visible windows. Setting positions is absolute; changing a ring preserves the window. Internal string views are derived and read-only.
- The legacy internal `rotors` array remains right-to-left. New public configuration, state, and stepping arrays use left-to-right order. Do not serialize or mutate rotor internals as an application state API.

## Named configurations

```js
const machine = enigma({
  model: 'EnigmaI',
  rotors: ['II', 'I', 'III'],
  positions: [5, 14, 11],
  ringSettings: [23, 12, 21],
  reflector: 'A',
  plugboardPairs: 'AM FI NV PS TU WZ',
});
machine.encodeString('ABLABL'); // PKPJXI, the sourced 1930 example indicator
```

Named configurations default to `M3`; choose `EnigmaI` or `M4` explicitly for their component constraints/defaults. Unknown properties are rejected. The model catalogue includes source citations; it describes component families, not a specific day's key sheet. Experimental arbitrary rotor combinations remain out of scope.

## Undo, persistence, and replay

```js
const before = machine.snapshot();
const trace = machine.pressKeyWithTrace('A');
machine.restore(before); // Undo exactly, including model and configuration.
const replay = machine.pressKeyWithTrace('A'); // Same trace and output.
const resumed = enigma.deserialize(machine.serialize());
const copy = resumed.clone(); // Independent state.
```

Snapshot schema version 1 stores complete configuration and current positions, with initial/reset positions separately preserved. `restore()` is atomic and can change the complete model. Pass objects to `restore()`/`fromSnapshot()` and JSON strings to `deserialize()`. Store message history and lesson progress separately. No pre-existing raw-object snapshot format is implicitly imported.

## Rendering the signal

`traceChar()` returns a non-stepping trace. `pressKeyWithTrace()` first decides stepping from pre-step notches, advances once, and traces the post-step circuit. Its `stepping` array records all causes, so a middle rotor at its own notch and next to a notched fast rotor still advances only once.

Trace stages appear in electrical traversal order. A stage's `input`/`output` use stationary contact indices, with corresponding letters. Rotor stages additionally expose the fixed-wiring contact indices and the position/ring offset used in the actual calculation. For an SVG, identify a rotor by `componentId`/`slot`, not by its changing letter or array index in the legacy internals.

All trace data is detached and JSON-compatible. Geometry, timing, audio, input queues, and reduced-motion behavior remain frontend responsibilities. Traces explain a transition; a snapshot is what restores it.

## Types

`index.d.ts` exposes the factory namespace (`enigma.Configuration`, `enigma.Snapshot`, `enigma.Trace`, and others). Narrow stages on `stage.kind === 'rotor'` to access rotor-specific fields. Types document shape; runtime validation checks ranges, counts, and compatibility.

See the [source ledger](sources.md) for provenance and [API decision](decisions/0002-configuration-and-traces.md) for schema details.
