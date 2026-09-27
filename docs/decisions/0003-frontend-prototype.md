# 0003: Teaching frontend prototype

Status: implemented for review, 27 September 2026. M3 user review remains open.

## Scope and structure

React and TypeScript provide a static Vite application in `web/`. The independent CommonJS engine remains the only source of cipher behavior. Frontend dependencies are development dependencies and the npm package allowlist excludes the site.

Learn, Explore, History, and Reference are four views. Learn offers a complete first-keypress lesson with observation, circuit inspection, and corrective quiz feedback. Explore exposes Enigma I/M3/M4, rotors, rings, initial windows, reflector, and plugboard configuration. Separate in-memory sessions preserve experiments while moving between views. Applying valid settings starts a fresh message; invalid settings preserve the current session. Undo restores the snapshot before the last keypress.

The warm paper, green machine, brass highlights, serif headings, and monospaced technical labels establish the visual direction. The circuit diagram keeps physical left-to-right rotor order and distinguishes outbound and return paths using direction labels, arrowheads, solid/dashed lines, and color. A table supplies the complete textual trace. Replay inspects an already-computed keypress; it does not advance the engine again.

## Input and accessibility

Keyboard typing applies only while focus is inside the machine keyboard. Native buttons support pointer, touch, Enter, and Space. Navigation moves focus to the new heading. Controls expose labels, configuration failures are alerts, and output has a live text announcement. The mobile diagram scrolls within a keyboard-focusable region. Reduced-motion preferences disable decorative transitions; replay begins only when requested and can be paused or advanced manually.

Desktop and 390px mobile Chromium checks cover the lesson, round-trip enciphering, undo, rejected settings, M4, navigation state, reference filtering, overflow, and automated axe scans. Automated checks do not replace screen-reader testing or usability sessions. Physical mobile devices and other browser engines remain release verification work.

## Sources and next boundary

Every history card has a directly linked source and locator. Eight annotated resources introduce museums, an institutional historical account, specialist research, and a historical transcription. These four history cards are representative content, not a complete wartime narrative. The research note preserves a documented disagreement about rotor period. Frontend annotations currently live in `web/src/content.ts`; the shared editorial schema and claim-level pipeline are M5 work.

Prototype limits: 80 letters per session, no persistence across reloads, no URL routing/sharing, no saved lessons, and one lesson. Fonts use Google Fonts with local system fallbacks. Review the teaching flow and visual direction before expanding the curriculum and simulator interface. Next work follows M4 in the roadmap: stronger message/state workflows, sharing, and broader interaction validation.
