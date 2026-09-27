# Beginner trial: first learning journey

Status: ready to run; no participants have been recruited and no sessions or results are recorded. Use this protocol after the separate accessibility checks, or explicitly record any known limitations in the session notes.

## Setup

Invite 3–5 willing adults who are curious about Enigma and have not used this simulator. Aim for a mix of desktop and phone users. This is a small formative study, not a representative survey. A session should take about 30 minutes.

Run `npm run dev` and use the local preview on the facilitator's computer. Use a separate browser profile so existing saved lesson progress does not affect the trial. For a participant using a remote or physical phone, arrange an approved accessible preview first; the localhost link on your computer will not work on their device. Do not expose the development server or publish the site as an implicit part of this protocol.

Record a participant code rather than a name. Ask permission before taking notes or recording audio/video; written notes are sufficient. Explain that they can stop or skip any task. Do not ask participants to encipher personal messages. Use the supplied example text. Keep observations in a private location outside the public repository; do not commit recordings or identifiable notes.

Read aloud: “We are testing how clearly the guide explains the machine. You can think aloud, ask questions, or stop at any time. If something is confusing, that helps us improve the guide.”

Before starting, ask what they already know about Enigma. Record familiarity without correcting them yet. Record browser, device, input method, zoom, and any accessibility settings they choose to disclose.

## Tasks and observations

Give one prompt at a time. Let the participant choose controls. Avoid naming a button until they ask for help or have been stuck for roughly a minute. Record exactly what help was provided.

| Task | Participant prompt | Observe / completion evidence |
| --- | --- | --- |
| 1 — First keypress, 4 min | “Explore the first lesson. Tell me what changes when you press a letter.” | Can they locate the action, notice the moving rightmost rotor, and relate input to the lamp? Record any confusion between live state and replay. |
| 2 — Prediction, 4 min | “What do you think will happen if you press the same letter many times? Find a way to check.” | Do they discover lesson 2 and revise an incorrect prediction? Can they explain that output can repeat without randomness? Do not award understanding solely for a completion badge. |
| 3 — Circuit, 4 min | “Show me the path from a key to its lamp, at a speed you can follow.” | Can they find guided mode, pause/step, and identify the return through the rotors? Do they believe replay enciphers another letter? |
| 4 — Read it again, 5 min | “Make a secret version of HELLO, then recover HELLO using the machine.” | Do they discover reset and preserve starting settings? Can they distinguish the wrong ending state from the correct starting state? Permit lesson 4, but record whether they needed it. |
| 5 — Historical evidence, 5 min | “Find a historical claim, show where it comes from, and tell me what the guide checked.” | Can they open the relevant source record, find its locator, recognize a transcription versus an archive original, and return without losing progress? Ask them to try the manual example if time permits. |
| 6 — Explain, 3 min | “How would you explain this machine to a friend? What would you still want to know?” | Capture their own wording before offering any correction. |

Keep the last few minutes for: “Where did you feel lost?”, “Which terms needed explanation?”, and “What did you expect a control to do that it did not do?” Ask about confidence only after the explanation tasks.

## Facilitator interpretation guide

Look for these ideas in participants' explanations, without requiring technical vocabulary:

- Movement changes the circuit before a key's signal passes; repeated output letters are still possible.
- The signal returns through the rotors after the reflector.
- Deciphering needs the corresponding configuration and starting state, using the same process.
- Enigma is a family of machines. The 1930 exercise is a manual example, and the Bombe has a different role.
- A citation leads to checkable evidence; a modern transcription is not the same thing as independently inspecting an archival original.

Do not treat a checked quiz answer as proof of understanding. If the explanation contradicts the choice, record the misconception. Different participants may need different levels of detail; note whether optional depth helped or distracted.

## Recording template

Copy this block per participant into a private notes file:

- Participant code / date:
- Build commit / browser / device / input / zoom:
- Prior familiarity:
- Consent for notes obtained:
- Tasks completed independently:
- Tasks completed with help (exact hint):
- Tasks not completed / skipped:
- Observed confusion (task, visible state, action, result):
- Participant's explanation in their own words:
- Accessibility or focus problems:
- Suggested change / evidence / severity:

For each task, record independent, assisted, not completed, or skipped. Approximate time can help locate friction but is not a speed test. Do not convert this small sample into population success percentages.

## Decide what to change

After the sessions, group observations by problem rather than by participant. Prioritize a single blocking accessibility failure, failure to recover plaintext, or materially misleading history explanation immediately. Treat confusion repeated by two participants as a strong reason to revise the corresponding wording or interaction, then try it with someone new. Preserve useful contrary observations rather than forcing agreement.

Create an issue or implementation task per actionable finding with a reproducible state, observed behavior, proposed change, and how to verify it. Update the roadmap trial checkbox only after real sessions have been conducted and findings recorded. The trial does not replace engine tests, historical review, or a screen-reader pass.
