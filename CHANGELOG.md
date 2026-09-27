# Changelog

## Unreleased — next major library release and first learning guide

No version has been published by this work. The package version remains 3.0.0 until publication is agreed. The breaking changes below call for a major release; 4.0.0 is the proposed next library version.

### Library

- Correct non-default M4 ring/window assignments and stop mutating caller arrays.
- Use normalized rotor positions and absolute position/ring setters; validate full inputs before changing machine state.
- Add named Enigma I, M3, and M4 profiles, reflector A, and explicit component constraints.
- Add stepping keypresses, detailed traces, cloning, versioned snapshots, restore, and serialization.
- Ship TypeScript declarations with the independent CommonJS runtime.
- Require Node.js 22.12 or later. Invalid configurations/text now throw instead of producing unreliable output.

Existing valid three-rotor examples retain their output. `encodeChar()` still inspects without stepping. See [the migration guide](docs/migration.md) before upgrading, especially for ciphertext created with the old M4 configuration bug.

### Interactive guide

- Four beginner experiments with predictions, feedback, restart, and local completion markers.
- Configurable workbench, signal replay, textual traces, undo, batch input preview, and copy/export tools.
- Versioned starting-settings links and current-state exports that omit message text.
- Sourced history, a runnable 1930 manual example, glossary, reference search, and evidence notes.
- Keyboard controls, reduced-motion playback, responsive layouts, and automated accessibility checks.

Manual assistive-technology testing and beginner trials remain recorded release-validation gaps. These educational simulations should not be used to protect sensitive communications.
