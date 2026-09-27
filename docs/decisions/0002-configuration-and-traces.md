# 0002: Public configuration, snapshots, and traces

Status: M2 implementation in progress, 27 September 2026.

## Configuration and model families

The factory accepts either the legacy positional arguments or one named configuration object. Named configuration defaults to M3, preserving the existing default behavior. Explicit model IDs are `EnigmaI`, `M3`, and `M4`. Model-specific defaults make `enigma({ model: 'M4' })` usable without supplying four position/ring entries or a thin reflector manually.

Profiles describe compatible component families with source locators, not year-specific operating rules. Reflector A is added to Enigma I; the named M3 profile excludes it. Legacy positional construction infers M4 from four rotors, EnigmaI from reflector A, and M3 otherwise. Unknown fields and mixed calling styles are errors, so misspelled settings do not silently become defaults.

All public arrays use left-to-right order. `getConfiguration().positions` is the reset/initial position; `getState().positions` is the live position. Returned data is detached. Plugboard pairs are normalized alphabetically for stable serialization; direction and ordering of ordinary pair swaps do not affect the circuit.

## Snapshots

Version 1 is a complete, portable object:

```json
{
  "schemaVersion": 1,
  "configuration": {
    "model": "M3",
    "rotors": ["III", "II", "I"],
    "positions": [0, 0, 0],
    "ringSettings": [0, 0, 0],
    "reflector": "B",
    "plugboardPairs": ""
  },
  "state": { "positions": [0, 0, 1] }
}
```

Import requires all fields and rejects unknown fields, unsupported versions, and invalid settings. `restore()` validates a replacement before modifying the live machine. Restoration may change the complete model/configuration. Snapshots do not contain input/output text, animation progress, lesson state, or user preferences; those belong to the frontend.

`clone()`, `snapshot()`, `restore()`, `serialize()`, `enigma.fromSnapshot()`, and `enigma.deserialize()` use the same schema. Undo should restore a snapshot rather than invert stepping. Direct mutation of legacy internals remains unsupported.

## Trace contract

String-returning methods remain unchanged. `pressKeyWithTrace()` performs one physical keypress; `traceChar()` inspects without stepping. Both traverse the same electrical operations as ordinary encoding. Trace output is versioned, serializable data with stable slot identifiers, normalized contacts, visible letters, wiring-relative offsets, positions before/after, and explicit mechanical reasons. SVG geometry and animation timing are not engine concerns.

The `stepping` array is left-to-right, and describes each rotor's pre-step notch state, movement, and all applicable reasons. Electrical `stages` are in traversal order, including the identity entry wheel on both passes. Every rotor stage includes a `slot`, `position`, `ringSetting`, `offset`, `wiringInput`, and `wiringOutput`, so a renderer does not need to reconstruct cipher operations. Directions are `forward`, `reflect`, and `return`. Trace schema version 1 is independent of snapshot schema version 1.

The reflector A addition is verified against the indicator and body of the 1930 manual example transcribed by Frode Weierud. The archival original has not been inspected; source records make that distinction explicit.

## Types and compatibility

Retain the JavaScript/CommonJS runtime and ship handwritten TypeScript declarations tested with a strict TypeScript consumer. This provides frontend/editor contracts without introducing a build requirement for runtime consumers. Snapshot and trace schema versions are independent of the unreleased npm version.
