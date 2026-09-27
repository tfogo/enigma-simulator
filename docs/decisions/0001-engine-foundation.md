# 0001: Engine foundation and compatibility

Status: implemented foundation decision, 2026-09-27. No release published.

## Scope

The first implementation increment is roadmap M0–M1: establish a reproducible baseline and repair the existing military-machine engine. The initial product target remains I/M3/M4, four beginner lessons, a short history route, and a sourced message example. Trace data, model metadata, the named configuration API, and the frontend follow in later milestones.

## Decisions

- Retain the CommonJS factory and its positional arguments. The default rotor order remains III–II–I from left to right. Preserve the existing internal right-to-left `rotors` array order.
- Keep `encodeChar()` as a non-stepping inspection operation. Add `pressKey()` for one validated character with stepping before transformation. `encodeString()` agrees with repeated keypresses.
- Validate an entire string or setting array before modifying state. Inputs remain strictly uppercase A–Z; UI normalization is a later, explicit feature.
- Use window position and ring setting as distinct normalized numbers in 0–25. Immutable numeric wiring permutations perform the signal transformations. Existing `ring`, `alpha`, `encoding`, and `decoding` inspection strings are derived read-only views.
- Changing a ring setting preserves the visible window position. Setting a position is absolute. `reset()` restores the constructor's window positions; it does not restore rings modified through internal rotor objects.
- Require three distinct moving rotors I–VIII, or a leftmost Beta/Gamma followed by three distinct moving rotors. Require thick B/C for three rotors and thin B/C for four. This is structural validation, not a claim that all combinations were used in every period/network. Historical profiles and experimental configurations remain M2 work.
- Accept 0–13 disjoint plugboard pairs, separated by whitespace. This is physical capacity, not a universal wartime operating procedure. No self-pairs or reused letters.
- Keep JavaScript for the engine increment, with no runtime dependencies. A TypeScript rewrite is not necessary for these repairs.
- Establish a maintained development baseline at Node >=22.12.0 with Mocha 12 and a committed lockfile. CI targets Node 22, 24, and 26 on Linux plus Node 24 on Windows. This intentionally replaces the package's malformed legacy Node 7 engine declaration; older runtimes are not supported by this increment.
- Limit npm package contents to the entry point, runtime source, README, and npm's automatically included metadata/license files. Research and fixture data stay in the repository.

## Compatibility consequences

Valid documented three-rotor examples and existing all-zero M4 vectors retain their outputs. Non-default M4 output changes where the constructor previously assigned settings incorrectly. Malformed/impossible setups now throw useful errors rather than running or failing unpredictably. Direct mutation/serialization of rotor internals is not a supported state API; versioned snapshots are planned.

These stricter validation and runtime requirements should be released as a major version with migration notes. Version 3.0.0 is left untouched until a release is prepared; nothing is published as part of this work.

## Baseline and evidence

The original 26 tests passed with actual Mocha 12 before engine edits. New regression tests then produced 29 failures against the old implementation. Two legacy expectations were updated deliberately: a changed ring no longer moves the window, and a complete revolution has normalized position 0 rather than 26.

The custom-settings README example's `IRD` comment was stale: both original HEAD and the repaired engine produce `IGT`. The documentation and a regression now record the actual preserved behavior.

Tests now include independently published three-rotor examples, the M4 Project's recovered message, and sourced stepping behavior. See [the source ledger](../sources.md) and [fixture manifest](../../test/fixtures/reference-vectors.json). Round-trip tests supplement these references; they do not establish correctness alone.

## Next boundary

M2 should add a stable configuration/state schema, sourced historical profiles, and traces derived from this engine's actual transition path. It must not make the frontend infer cipher logic from legacy strings.
