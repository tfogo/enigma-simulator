# 0005: Guided keypress playback

Status: implemented and locally verified, 27 September 2026.

## Presentation follows an immutable trace

The keypress display selector offers Immediate result (the default) and Follow the keypress. Guided playback starts with the pre-step windows, advances the moving rotors, visits electrical stages in order, and lights the lamp at the final plugboard output. Each stage lasts 700 ms during playback. The rotor letter transition lasts 350 ms, finishing before the first electrical stage. Inspector contact labels are revealed as their stages are reached.

The engine still computes keypresses synchronously and the transcript updates immediately. Playback never calls the engine. The machine panel identifies its temporary windows as Playback windows; the message record retains actual current state. Inspecting a historical entry does not rewind the live machine panel. A pasted batch is fully enciphered in order, then playback presents its last keypress. These distinctions are explained beside the display selector.

Pause, Back, Next connection, and Show result now control the presentation. Completing or rewinding to a boundary uses aria-disabled controls with clamped handlers, preserving keyboard focus instead of removing the focused button from the tab order. Playing a completed trace restarts at the pre-step windows.

## Cancellation and motion preferences

The playback hook associates every frame and timer with its trace, view, and display mode. New input replaces playback with the newest trace; older callbacks are cancelled. Reset, undo, configuration changes, imported settings, history selection, and mode changes invalidate the old presentation. Navigation pauses playback and returning to a machine view waits for an explicit play or step action. Live engine state remains independent.

When reduced motion is enabled, guided playback starts paused and the rotor transition is disabled. Users may still explicitly request Play replay or advance a stage at a time. A change to the operating-system preference during a visit also pauses playback.

## Verification

Twenty-two browser tests pass on desktop and mobile Chromium, including exact stepping/signal/lamp order, timed replay, pause, immediate completion, no duplicate enciphering, replacement input, reset and configuration cancellation, navigation, reduced motion, keyboard activation, focus retention, and automated accessibility scans. Existing message, sharing, and lesson tests remain green.

A live check in the macOS in-app browser verified the accessible controls and descriptions, keyboard pause/step/completion, Tab focus progression, the final F lamp for A at the default settings, and focus retention at completion. A full screen-reader listening pass and physical mobile-device checks remain open; see the accessibility checklist.
