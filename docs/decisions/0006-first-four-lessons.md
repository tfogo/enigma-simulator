# 0006: First four guided lessons

Status: implemented and locally verified, 27 September 2026. M5 content work is underway; the outstanding M4 screen-reader and physical-device checks remain tracked separately.

## Learning sequence

The lesson catalogue records stable IDs, titles, objectives, recommended prerequisites, starting configurations, source IDs, prediction choices, and corrective feedback. The accepted first-keypress walkthrough retains its four-step interaction. Lessons 2–4 share an experiment component and controlled activity state:

1. Your first keypress: observe movement and a lamp, trace the circuit, and explain the changing route.
2. Why repeated letters change: predict and run thirty A keypresses. The observed repeated outputs distinguish changing state from guaranteed unique output. Restart reproduces the exact sequence.
3. Follow one signal: use plugboard pairs AB CD, press A, and inspect the outward and return circuit. The first plugboard pass and final lamp are read from the engine trace.
4. Read the message again: encipher HELLO, optionally try deciphering from the ending windows, then restore the lesson's starting state and enter the ciphertext. Only the correctly reset experiment returns HELLO.

Experiments use the same engine reducer and traces as Explore. Expected ciphertext is generated from the explicit lesson configuration, not embedded as a mock result. Automated tests compare observable output to an independent engine instance and check the round trip. The existing library's published known-answer fixtures remain the underlying correctness reference.

## Progress and state

All lessons are available without locks. Completion for lessons 2–4 requires both the experiment (including deciphering for lesson 4) and a correct prediction; wrong answers explain why and allow retry. First-lesson completion follows its existing experiment and final question.

Completed IDs are stored under `enigma.lessons.v1`, filtered against the catalogue on load, and can be cleared explicitly. Invalid or blocked storage falls back to in-memory behavior. Current experiment/answer state survives navigation during the visit; reloading retains completion marks only. Restarting or switching lessons restores the specified configuration and clears activity. Explore retains its separate session throughout.

Manual keypresses, undo, and machine reset invalidate the lesson experiment's observations, so explanatory text cannot keep claiming that a scripted run is still on the machine after the user changes it. The visitor can rerun the experiment. Lesson navigation focuses its heading; marking completion preserves focus on the completion control.

## Evidence and next work

Each lesson links its mechanical source with a locator and further-reading note. These are modern teaching experiments, not historical message procedures. Historical-message exercises and a unified claim-level source registry remain M5 work.

Thirty browser tests pass across desktop and mobile, covering prediction feedback, experiment gating, repeatability, plugboard traces, wrong-state deciphering and recovery, lesson navigation, Explore isolation, progress persistence/clearing, unavailable storage, and accessibility scans. Production build and type checks pass. Manual screen-reader listening and beginner usability trials remain unverified.

Next: expand the sourced history route and connect it to the shared source registry, glossary, and a reproducible historical example.
