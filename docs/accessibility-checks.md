# Accessibility verification

Last updated: 27 September 2026. This is a verification record, not a conformance claim.

## Completed locally

- Automated Chromium desktop/mobile, Firefox desktop, and WebKit narrow-viewport checks, including axe scans of Learn, Explore, History, Reference, expanded trace/import controls, and guided playback at desktop and 390px mobile widths.
- Browser tests of keyboard input, Enter activation, focus retention at playback completion, and reduced-motion behavior.
- Live keyboard and native accessibility-tree inspection in the macOS in-app browser: playback controls have names and states; Enter operates pause, next, and result; Tab reaches the result control; completion retains focus and exposes the F lamp and AAB windows.
- Responsive visual inspection and page-overflow checks. The diagram and trace table have focusable scrolling regions.
- Automated 320 CSS-pixel reflow checks of all four views, including M4 windows, reachable machine keys of at least 24 × 24 CSS pixels, and expanded History evidence. This models the layout width of 1280px at 400% zoom; actual browser zoom and physical touch usability remain separate manual checks.
- Automated keyboard skip-link checks confirm the next Tab enters main content in both browser test projects.

## Manual screen-reader pass still required

Use VoiceOver with Safari and NVDA with Firefox or Chrome. Record browser/reader versions and actual observations for each check; do not infer speech behavior from the DOM or axe results.

1. Navigate from the skip link through main navigation, headings, lesson actions, machine controls, and the inspector. Confirm names, order, current-view state, and visible focus.
2. Type A inside the machine keyboard. Confirm the output announcement is understandable and occurs once. Type into a message draft and confirm it does not trigger machine keypresses.
3. Choose Follow the keypress. Confirm Playback windows are distinguishable from live message state, stage announcements are usable, and pause prevents excessive announcements. Verify the result button retains focus when it becomes unavailable.
4. Enable reduced motion. Confirm guided playback waits for input, the rotor transition is absent, and explicit Play/Next still works.
5. Open the complete electrical trace and navigate its caption, headers, and cells. Pan the diagram/table by keyboard without trapping focus.
6. Submit invalid plugboard settings and malformed imported JSON. Confirm errors are announced and entered text and machine state are preserved.
7. Follow a source note and return to the app. Check that lesson and experiment state remain available and links announce their purpose.
8. Test at 200% and 400% zoom and on a physical touch device. Verify reachability, readable reflow, and sufficiently usable touch controls.

Log failures with the interaction, expected result, actual speech/focus behavior, and a reproducible configuration before marking the M4 manual-verification checkbox complete.

The expanded 96-case suite passed locally. WebKit uses Option/Alt+Tab to include links; keyboard completion checks activate with Enter. Native clipboard-grant testing runs in Chromium; denied clipboard/storage recovery is covered on all engines. Desktop/mobile screenshots of the release candidate were inspected and are stored in `docs/images/`.
