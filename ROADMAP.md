# Enigma Simulator: implementation and learning roadmap

Status: implementation underway, 27 September 2026. M0–M2 are implemented and locally verified; M3 is reviewed; M4 message workflows, snapshot restoration, and sharing are implemented. Guided stepping/signal playback is also implemented; full manual screen-reader and physical-device checks remain. CI configuration is added but has not run remotely. No release has been published.

## 1. Product direction

Build an interactive Enigma workbench for curious beginners, with deeper technical and historical material available on demand. Preserve a useful, independently installable simulation library underneath it.

The experience should answer three connected questions:

1. How does this machine transform a message?
2. How did people actually operate it and communicate during the war?
3. How did people discover ways to read those communications?

The first visit should require no cryptography knowledge. Within a few minutes, a visitor should be able to press a key, see the rotors move, follow the signal, and recover a short message by restoring the original settings. Returning visitors should be able to inspect contacts, compare models, explore sources, and reproduce historical examples.

Agreed direction: curious beginners first; optional depth for enthusiasts; both machine mechanics and wartime history. Stack, visual details, and release scope below are proposed defaults, not final commitments.

## 2. Experience and navigation

Use four connected destinations, all powered by the same simulation engine:

| Destination | Purpose | Main interactions |
| --- | --- | --- |
| Learn | A guided sequence with a clear next step | Predict, operate, observe, explain, check understanding |
| Explore | A free workbench | Configure, type, inspect, reset, replay, compare, share |
| History | A chronological and thematic account | Read a chapter, inspect an artifact, launch a related experiment |
| Reference | Technical depth and provenance | Browse models, components, glossary, sources, API documentation |

Lessons should link directly into a configured experiment. Experiments should link back to explanations and relevant history. Opening a lesson or shared example must preserve the visitor's existing workspace or offer an explicit way to return to it.

### Beginner presentation

- Start with one three-rotor machine and sensible fixed settings.
- Initially show the keyboard, lampboard, rotor windows, and a short instruction.
- Introduce controls when a lesson needs them; offer an always-available route to the complete workbench.
- Explain German terminology beside familiar English labels: ring setting / Ringstellung, for example.
- Keep “starting settings” visibly separate from “current positions.”
- Show physical stepping before showing the electrical signal.
- Pair every animation with a short textual explanation.

### Advanced presentation

- Expose full configuration, model constraints, component tables, contact indices, wiring offsets, and trace export.
- Offer historically constrained presets and a clearly labelled experimental configuration mode.
- Show sources and confidence notes for each model and historical example.
- Explain why an unavailable combination is incompatible.
- Let users compare two machines using identical input and an explicit starting state.

## 3. Repository baseline and verified issues

The current repository contains a CommonJS library, four source files, a factory entry point, a README, and synchronous Mocha tests. There is no frontend, CI configuration, or lockfile in the inspected checkout.

All 26 existing tests passed through a minimal synchronous harness during review. Normal `npm test` could not run because Mocha was not installed. This is a baseline observation, not a substitute for running the actual runner during implementation.

Fix these verified issues before using the engine in educational content:

- The constructor reverses caller arrays and repeatedly reverses position/ring arrays inside its loop. Non-default M4 settings are assigned incorrectly.
- Machine `setPosition()` is empty.
- Rotor `setPosition()` applies an additional rotation instead of setting an absolute position.
- Rotor `setRingSetting()` leaves the stored setting and electrical state inconsistent.
- Invalid text can produce literal `undefined` in output, after advancing machine state.
- Reused letters in plugboard pairs can create a non-bijective mapping.
- `encodeChar()` does not step, while `encodeString()` steps before every character. Public semantics need to be explicit and compatible.
- Numeric rotor state is not a reliable normalized representation of the visible window position.

Historical documentation also needs correction: I–V are shared by Enigma I and naval models; VI–VIII belong to both M3 and M4. The standard military rotor inventory is already present. Reflector A is absent. [S1]

## 4. Technical architecture

### Engine

Keep the runtime independent of the UI, browser APIs, animations, and lesson content. Introduce explicit concepts for:

- **Component definitions:** immutable rotor, reflector, entry-wheel, and plugboard-device data.
- **Machine profiles:** allowed components, slot roles, stepping strategy, alphabet, and historical metadata.
- **Configuration:** chosen components, ring settings, initial windows, and plugboard setup.
- **State:** current windows and the minimum information needed to resume exactly.
- **Transitions:** a deterministic keypress result containing the next state and signal trace.
- **Procedures:** message preparation and operator workflows, separate from the machine's electrical behavior.

Use normalized numeric offsets and immutable wiring permutations internally; derive display strings rather than rotating every wiring string as the primary state. Retain existing ciphertext behavior for valid configurations except where a documented bug is fixed.

Proposed capabilities, with exact names settled in the API milestone:

| Capability | Contract |
| --- | --- |
| Create from named configuration | Copy and validate inputs; never mutate caller-owned data |
| Press one key | Validate, step once, transform, return output and trace |
| Transform without stepping | Explicit inspection operation; no state mutation |
| Encode text | Validate the full input before mutation; agree with repeated keypresses |
| Inspect configuration/state | Return serializable copies with explicit left-to-right order |
| Reset / set windows | Absolute, predictable state changes |
| Snapshot / restore / clone | Exact deterministic replay with versioned serialization |
| Validate profile | Explain component and configuration incompatibilities |

A trace must include input/output, windows before/after, each stepping decision and reason, plugboard transformations, entry-wheel transformations, forward/reverse rotor contact mappings, and the reflector mapping. It must expose enough detail to draw wiring without duplicating cipher logic in the frontend.

Snapshots power undo; do not infer a previous state by mechanically reversing the stepping algorithm. Editing earlier text must replay deterministically from the saved starting state. Define behavior for paste, deletion, reset, changing configuration, and cancellation during animation.

### Frontend and content

Proposed default: a static TypeScript frontend with a component framework, SVG diagrams, and repository-owned content. React plus Vite is a reasonable implementation candidate; confirm maintained versions and packaging compatibility when implementation starts. No server, accounts, or database are needed for the first release.

Preserve the existing npm package boundary initially. A likely layout is `src/` for the library, `web/` for the app, `content/` for lessons/history, and `docs/` for architecture and sourcing records. Confirm packaging before choosing workspace tooling or moving files.

- Store lesson content and configuration fixtures as structured, validated data.
- Keep presentation state separate from machine state; animation consumes committed transitions.
- Use browser storage for optional local progress and preferences; provide reset/export controls.
- Share versioned configurations through links. Include message text only when explicitly chosen by the user.
- Reject invalid shared data cleanly; do not interpret it as HTML or executable content.
- Consider a worker only for later search challenges or workloads that cause noticeable UI delays.

## 5. Guided curriculum

Each lesson needs a learning objective, prerequisites, a reproducible starting configuration, a short explanation, an experiment, a prediction question, feedback, a reset control, and optional deeper reading. Wrong answers should explain the mechanism and allow retrying.

| Lesson | Learner activity | Understanding to check |
| --- | --- | --- |
| 1. Your first secret message | Type a short message and watch keys, windows, and lamps | A keypress advances the machine and lights an output letter |
| 2. Why repeated letters change | Type A repeatedly; inspect each transition | The substitution changes with state; output letters can still repeat |
| 3. Follow one signal | Pause at the plugboard, rotors, reflector, and return path | The signal passes through the rotors twice, in opposite directions |
| 4. Read the message again | Restore original settings and enter ciphertext | Decryption uses the same process from the same starting state |
| 5. Change the setup | Alter rotor selection/order and window positions | Configuration and current position are different concepts |
| 6. Connect the plugboard | Add pairs and compare outputs | The plugboard participates in both directions |
| 7. Rings and windows | Compare ring changes with window changes | The wiring offset differs from the visible index position |
| 8. The double step | Predict a short sequence near turnover | The middle rotor can step on consecutive keypresses |
| 9. A clue for codebreakers | Align a guessed word against ciphertext | A letter cannot encipher to itself on these reflector machines |
| 10. Send and receive | Follow one dated operator procedure with two machines | Daily settings, message settings, and indicators have distinct roles |
| 11. A fourth rotor | Compare M3 and M4, including compatible settings | The Greek rotor is settable but does not advance on keypresses |
| 12. Different Enigmas | Compare commercial and gear-driven variants | Enigma is a family with differing mechanics |

Lessons 1–4 form the initial learning release. Later lessons become available as their engine capabilities and historical content are verified. Do not advertise unfinished lessons as usable.

## 6. History curriculum

Build a chronological spine with optional topic and people pages. Each chapter should connect an artifact, human activity, and technical idea. The table is a writing/research brief; exact dates, anecdotes, and operational claims require claim-level verification before publication.

| Chapter | Coverage | Connected experience |
| --- | --- | --- |
| Before the war | Commercial origins, the need for secure communication, military adaptation | Compare commercial and military machine features |
| The Polish breakthrough | Rejewski, Różycki, Zygalski, the Polish Cipher Bureau, French intelligence cooperation, and sharing with allies | A carefully labelled simplified indicator-pattern activity |
| A wartime communications network | German Army, Air Force, and Navy use; radio networks; operators; key distribution | Set a machine from a reproduced key-sheet example |
| From interception to intelligence | Interception, transcription, cryptanalysis, checking results, translation, analysis, dissemination | Follow one message through the workflow |
| Bletchley Park and its collaborators | Turing, Welchman, other cryptanalysts, engineers, women operators, clerical staff, and international work | Compare human reasoning and machine-assisted candidate elimination |
| Naval communications | M3/M4, changing procedures, short signals, captured material, interruptions in access to traffic | Reproduce a sourced naval example |
| Adaptation during the war | Changing keys/procedures, additional rotors, M4, UKW-D, and Uhr | Compare the effect of one change at a time |
| After the war | Continued machine use, secrecy, later disclosure, preservation, and reconstruction | Explore a postwar wiring variant and museum sources |

Editorial requirements:

- Explain the context of Nazi Germany's war and the Allied effort in plain, age-appropriate language.
- Present codebreaking as a collaborative, continuing effort across networks and dates, not a single permanent breakthrough by one person.
- Distinguish the Polish bomba and British Bombe; explain each at the appropriate level without implying identical mechanisms.
- Distinguish Enigma/Bombe from Lorenz/Colossus. Colossus addressed Lorenz traffic. [S12]
- Include women and operational staff as part of the main narrative, supported by role-specific sources. [S13]
- Investigate captures and codebooks through museum/archival sources; do not publish popular anecdotes without checking them.
- Avoid unsupported numerical claims about lives saved or years by which the war was shortened.
- Label invented lesson messages, reconstructed examples, and authentic transcripts distinctly.
- Use contextual artifact imagery; avoid turning wartime material into decorative spectacle.

### Historical research and asset workflow

Create a claim ledger with claim text, source URL, author/institution, relevant page/section, access date, confidence, and any disagreement. Important disputed dates need comparison across sources before entering the timeline.

For each authentic message, retain ciphertext, plaintext/transcription, settings, procedure, provenance, known corrections, and expected engine output. Link to originals. Verify reproduction rights before copying photographs, scans, transcripts, or long text. Write original explanations and provide captions and alt text for approved assets.

Offer citations beside the relevant explanation and a readable bibliography. The historical model catalogue may describe machines whose simulation is not yet available; show that distinction explicitly.

### Reader-facing references and further learning

References are a core product requirement. Readers should be able to check the evidence for historical claims and find approachable routes into original documents, museum collections, specialist websites, articles, books, and research papers.

- **Citations in context:** attach references to the historical statement or short passage they support, including timeline events, biographies, artifact captions, model descriptions, and lesson history notes. A chapter-level reading list alone is insufficient.
- **Expandable source notes:** clicking a citation opens an accessible note with the title, author/institution, publication date when known, exact page/section or archival identifier, and a link to the original. Opening the source must not discard lesson progress or machine state.
- **Chapter and lesson reading:** end each topic with a short annotated “Learn more” list. Explain what each resource adds and label its level, such as beginner introduction, technical explanation, or original research/document.
- **Searchable reference library:** provide a dedicated area within Reference, filterable by topic, person, machine variant, resource type, and reading level. Support books and archival material without online full text through complete bibliographic records.
- **Evidence versus further reading:** distinguish sources that support a particular claim from resources suggested for broader exploration. Make primary documents, later historical analysis, and modern reconstructions identifiable.
- **Disagreements and uncertainty:** show a brief note and the relevant sources where interpretations or dates differ. Label our own explanatory deductions and simplified teaching models explicitly.
- **Access information:** indicate language, translations, PDF format, and access restrictions where known. Prefer an accessible route when available; do not imply a paywalled work was checked without reading it.
- **Durable attribution:** use canonical links, DOI links, and archival catalogue identifiers where available. Add a verified archive link as a fallback when useful, preserving the original citation. Record last link verification and provide a way to report corrections or broken links.

Maintain one structured source registry with stable IDs so the same work can be cited across lessons, history, component definitions, and test fixtures. Separate bibliographic metadata from claim-specific locators and explanatory notes. Record title, creators, institution/publisher, dates, resource type, URL/DOI/archive reference, language, access status, topics, reading level, and a short original annotation. Preserve rights/credit information for reproduced material separately.

Publication gate: every substantive historical claim must have a checked supporting citation or an explicit uncertainty note with its evidence. Each published history chapter must include an annotated route to further reading. Source records must be navigable by keyboard and on mobile, and content validation must detect missing source IDs and orphaned citation targets. Check external links before release and during scheduled maintenance; successful link resolution alone does not verify a claim.

## 7. Historical model and component expansion

| Priority | Scope | Required work and verification |
| --- | --- | --- |
| Initial | Accurate Enigma I / M3 / M4 profiles | Slot constraints, shared rotor sets, stationary Greek rotor, thick/thin reflector compatibility; date-specific notes where verified |
| Initial | Reflector A | Sourced wiring, validation, and a verified early-machine example |
| Initial | M3-compatible M4 settings | Test Beta + thin B and Gamma + thin C at matching reference settings against thick B/C [S2] |
| Next | Enigma K / Swiss-K | Nonidentity entry mapping and inverse, variant-specific wirings, no plugboard, settable reflector [S3] |
| Later | UKW-D | Rewirable reflector, fixed-pair and contact-notation rules; M4 installation replaces both Greek rotor and thin reflector [S4] |
| Later | Uhr | Forty positions, ordered connections, directional substitutions; verify machine-wide reciprocity [S5] |
| Later | Enigma G | Separate gear-driven stepping and driven reflector; select a documented specimen/profile [S6] |
| Optional | Tirpitz / Enigma T | Eight distinct rotors, five notches each, distinct entry wiring [S7] |
| Optional | Norwegian postwar variant | Sourced replacement wirings and historical context [S1] |
| Reference first | Railway, KD, early machines, digits-only Z | Research entries; assess simulation separately, including alphabet/mechanical differences [S1, S8] |

Do not treat all additional machines as new strings in the existing rotor table. Entry wiring, notch conventions, reflector behavior, and stepping can differ. Keep original source notation alongside normalized engine data. Some early wirings are unknown; describe uncertainty rather than inventing authentic presets. [S1]

## 8. Delivery milestones

Each milestone should be a reviewable change or small series of changes. Check the completion criteria before beginning dependent work. Effort labels describe relative scope, not calendar commitments.

### M0 — Record decisions and baseline (small)

- [x] Confirm first-release scope: I/M3/M4, initial lessons, and an initial history sequence.
- [x] Record public API compatibility policy and supported environments.
- [x] Run the real test suite after installing an appropriate reproducible development setup.
- [x] Preserve current valid examples as baseline fixtures and record known incorrect cases.
- [x] Create an architecture decision record, source ledger, and fixture manifest.

Done when: the baseline is reproducible and engine/API/history decisions are recorded.

### M1 — Repair and verify the engine (medium)

Depends on M0.

- [x] Fix array mutation and M4 configuration ordering.
- [x] Implement normalized state and absolute position/ring setters.
- [x] Implement machine reset and clear stepping/encoding semantics.
- [x] Validate rotors, positions, rings, reflectors, plugboard, and text before state changes.
- [x] Preserve existing factory usage through a compatibility layer where practical.
- [x] Add targeted regression tests for the verified bugs.
- [x] Add sourced vectors and invariants: reciprocity after reset, no self-encipherment, permutation integrity, double-step sequences, dual notches, stationary Greek rotor, and chunked versus whole-message encoding.
- [x] Modernize package metadata, test tooling, lockfile, and CI with a deliberate support matrix.

Done when: documented supported configurations pass sourced fixtures, invalid operations leave state unchanged, and the actual test command runs in CI.

### M2 — Configuration, trace, and replay API (medium)

Depends on M1.

- [x] Add the named configuration API and historical model profiles, including reflector A.
- [x] Add inspection, cloning, snapshots, restoration, and versioned export/import.
- [x] Produce trace data from the actual encoding path.
- [x] Add explicit stepping reasons and stable component/slot identifiers.
- [x] Test replay, trace consistency, serialization, malformed imports, and M3/M4 equivalence.
- [x] Write API examples and a compatibility/migration guide; add type definitions or adopt TypeScript after recording the choice.

Done when: one keypress can be explained and replayed exactly without the frontend implementing cryptography.

Verified locally: 110 runtime tests plus strict TypeScript consumer checks on Node 22.12, 24, and 26. The packed npm artifact installs independently, replays all three profiles, and exposes usable declarations to an external consumer. CI has not run remotely. See [the M2 API decision](docs/decisions/0002-configuration-and-traces.md) and [migration guide](docs/migration.md).

### M3 — UX prototype and visual system (medium; can overlap M1–M2)

- [x] Sketch Learn, Explore, History, and Reference navigation for desktop and mobile.
- [x] Prototype one complete keypress and one short lesson with representative content.
- [x] Choose a readable machine-inspired visual style, typography, signal colors, and diagram conventions.
- [x] Show both signal directions with labels and shapes as well as color.
- [x] Design rotor/ring controls, plugboard editing, errors, starting/current states, and reset.
- [x] Define focus order, keyboard operations, reduced-motion behavior, and textual alternatives.
- [x] Review with the user before expanding into the full interface.

Done when: the intended beginner interaction and advanced controls are concrete and reviewable at both screen sizes.

### M4 — Working simulator frontend (large)

Depends on M2 and M3.

- [x] Set up the frontend build while preserving independent library packaging.
- [x] Implement keyboard, lampboard, windows, model selection, rotor/ring configuration, reflector, and plugboard.
- [x] Implement input/output with an explicit normalization preview for free text.
- [x] Animate stepping before the signal; provide pause, next stage, and immediate-result modes.
- [x] Add textual traces, reset, undo through snapshots, history replay, and copy/export.
- [x] Define and test rapid input, paste, edits, configuration changes, and navigation mid-animation.
- [x] Add versioned share links and local preferences.
- [ ] Verify responsive layouts and assistive-technology behavior manually as well as automatically.

Done when: a visitor can encrypt, restore settings, decrypt, and inspect a letter on desktop and mobile without reading the library README.

### M5 — Beginner lessons and initial history (large; research/writing can start after M0)

Integration uses the implemented M4 workflows. Manual M4 accessibility verification remains open; the first four lessons are implemented and recorded in [the lesson decision](docs/decisions/0006-first-four-lessons.md).

- [x] Build the lesson schema, progress controls, prediction questions, feedback, and deterministic resets.
- [x] Implement lessons 1–4 with automated checks and optional deeper reading (available in the local preview; public publication remains M6).
- [ ] Publish a concise, sourced history route covering origins, the Polish contribution, wartime operation, and the Allied codebreaking workflow.
- [ ] Add the glossary and first artifact/source pages.
- [x] Implement the shared source registry, contextual citation notes, and searchable reference library.
- [x] Add annotated further reading to every implemented history chapter and relevant lesson.
- [ ] Verify claim-level citations, precise locators, source-access labels, and accessible navigation between content and references.
- [x] Include one fully sourced historical example that runs in the simulator (1930 manual indicator and body, with transcription access clearly labelled).
- [ ] Review all machine claims against fixtures and all historical claims against the ledger.
- [ ] Trial with a small group of beginners; observe confusion rather than relying only on satisfaction ratings.

Done when: beginners can explain why state changes, why reset is needed, and how the machine fits into a wider human communications system.

The shared source registry and 1930 example are recorded in [the history decision](docs/decisions/0007-history-and-document-example.md). The initial route now has six sourced sections; a fuller historical narrative and finer-grained citation audit remain open.

### M6 — First public release (medium)

Depends on M5.

- [ ] Complete engine, integration, accessibility, link, content, and packaging checks.
- [ ] Validate source references and external links; audit historical claim coverage and provide a citation-correction route.
- [ ] Verify a clean install/build and a browser import of the published package contents.
- [ ] Add screenshots, quick start, contribution guidance, source acknowledgements, and licensing files.
- [ ] Check rights for all included media and document attribution requirements.
- [ ] Choose hosting, preview the production build, and verify direct navigation/deep links.
- [ ] Decide versioning for changed behavior, prepare release notes, and agree publishing details before deployment/npm publication.
- [ ] Record known limitations and create a feedback route.

Done when: the first learning journey works end to end from a deployed URL and the library can be consumed independently.

### M7 — Full core curriculum and history (large)

Depends on feedback from M6.

- [ ] Add lessons 5–11, including ring settings, double stepping, and the no-self-encipherment clue.
- [ ] Add side-by-side comparison with shared input and explicit starting states.
- [ ] Add a dated send/receive procedure and interactive key-sheet walkthrough.
- [ ] Expand naval communications, people/roles, adaptation, and postwar chapters.
- [ ] Add additional authentic-message fixtures and contextual translations.
- [ ] Add a family timeline linking historical changes to runnable comparisons.

Done when: the full military-machine curriculum is coherent, sourced, and usable independently or as a sequence.

### M8 — Historical extensions (several medium/large releases)

- [ ] Introduce commercial K/Swiss-K with entry-wheel and settable-reflector support.
- [ ] Add a lesson comparing commercial and military configurations.
- [ ] Implement UKW-D, then Uhr, with their own sourced validation fixtures.
- [ ] Implement one well-documented Enigma G profile and a stepping comparison.
- [ ] Assess Tirpitz, Norwegian, Railway, KD, and Z against educational demand and research confidence.

Done for each model when: wiring and mechanics have provenance, independent behavioral checks pass, compatibility constraints work, and at least one explanatory activity exists.

### M9 — Codebreaking playground and classroom tools (optional larger expansion)

- [ ] Add crib alignment and self-letter elimination with immediate explanations.
- [ ] Add a bounded search exercise with some settings deliberately known.
- [ ] Display candidate elimination and uncertainty, not just an answer.
- [ ] Add an introductory Bombe/menu explanation only after its historical and technical scope is reviewed; distinguish it from simple exhaustive search.
- [ ] Provide hints, challenge links, teacher notes, and printable activities if learners request them.
- [ ] Use cancellable background work for searches; define limits and prevent UI blocking.

Done when: learners understand why a clue reduces uncertainty and what has been simplified relative to historical cryptanalysis.

## 9. Verification and release standards

- **Engine:** independent known-answer fixtures plus targeted properties; round trips alone cannot establish historical correctness.
- **Stepping:** exercise consecutive transitions near notches, simultaneous notch conditions, nonzero rings, all supported slot roles, and full relevant cycles where useful.
- **Frontend:** test typing, paste/edit/replay, reset, configuration changes, importing links, and navigation with active animation.
- **Learning:** every lesson has a repeatable start and an explanation tied to actual trace data.
- **Accessibility:** keyboard-only use, visible focus, meaningful labels, adequate contrast, non-color cues, reduced motion, scalable text, and text alternatives. Check screen-reader output manually; avoid announcing every animation frame.
- **History:** cite claims near the text, track disputed points, check artifacts and translations, and review source/media rights.
- **Performance:** agree measurable budgets after the prototype; verify on a modest mobile device and long-message workflows before release.
- **Packaging:** prevent frontend/content assets from unintentionally bloating the library package; test supported Node and browser consumption paths.
- **User comprehension:** observe whether users can reset/decrypt, distinguish rings/windows, and distinguish machine behavior from operating procedure.

## 10. Scope boundaries and decisions to revisit

First release excludes accounts, multiplayer, a backend, photorealistic 3D, exhaustive historical model coverage, and a complete Bombe implementation. Keep these as optional future directions rather than prerequisites.

Resolve decisions when their milestone needs them:

| Decision | Proposed default | Resolve by |
| --- | --- | --- |
| Existing API compatibility | Retain factory; add explicit APIs; document bug fixes | M0 |
| Engine language | Minimize disruption initially; supply strong public types | M2 |
| Frontend stack | TypeScript, component framework, static build, SVG | M3 |
| Visual style | Readable machine-inspired 2D design | M3 |
| History depth at launch | Short coherent route, with sources and optional detail | M5 |
| Tracking/progress | Local progress, no accounts or analytics requirement | M4–M6 |
| Hosting/domain/publication | Select after a working production preview exists | M6 |
| Historical extensions | K/Swiss-K first, then UKW-D/Uhr/G | M8 |

M0–M1 implementation is recorded in [the foundation decision](docs/decisions/0001-engine-foundation.md), and M2 in [the configuration and trace decision](docs/decisions/0002-configuration-and-traces.md). The M3 prototype now provides those interactions; see [the frontend decision](docs/decisions/0003-frontend-prototype.md). The user accepted the visual direction. M4 message workflows are recorded in [the workflow decision](docs/decisions/0004-message-workflows.md); guided playback is recorded in [the playback decision](docs/decisions/0005-guided-playback.md). Complete the remaining [manual accessibility checks](docs/accessibility-checks.md) before marking M4 fully verified. Historical content research can progress alongside that milestone. Revisit this document after each milestone and turn its remaining checkboxes into implementation tasks as needed.

## 11. Starting bibliography

These are starting points, not blanket verification of every future narrative claim. Prefer original documents or specialist research, compare conflicting accounts, and record the exact passage used in the claim ledger.

- **S1:** [Crypto Museum — Enigma wiring](https://www.cryptomuseum.com/crypto/enigma/wiring.htm): component tables, conventions, military and other variants.
- **S2:** [Crypto Museum — M4](https://www.cryptomuseum.com/crypto/enigma/m4/index.htm): Greek rotors, reflectors, and compatibility.
- **S3:** [Crypto Museum — Enigma K](https://www.cryptomuseum.com/crypto/enigma/k/index.htm): commercial variants and settable reflector.
- **S4:** [Crypto Museum — UKW-D](https://www.cryptomuseum.com/crypto/enigma/ukwd/index.htm): wiring constraints, notation, and naval installation.
- **S5:** [Crypto Museum — Uhr](https://www.cryptomuseum.com/crypto/enigma/uhr/index.htm): directional mappings and reciprocity.
- **S6:** [Crypto Museum — Enigma G](https://www.cryptomuseum.com/crypto/enigma/g/index.htm): gear-driven stepping and specimen variations.
- **S7:** [Crypto Museum — Enigma T](https://www.cryptomuseum.com/crypto/enigma/t/index.htm): entry wiring and multi-notch rotors.
- **S8:** [Crypto Museum — Enigma Z](https://www.cryptomuseum.com/crypto/enigma/z/index.htm): numerical machine family.
- **S9:** [Dirk Rijmenants — Enigma message procedures](https://www.ciphermachinesandcryptology.com/en/enigmaproc.htm): procedures and reproduced key material; verify the specific period/network selected for a lesson.
- **S10:** [Frode Weierud — Enigma collection](https://cryptocellar.org/enigma/): original documents, instructions, and authentic test messages.
- **S11:** [GCHQ — The Pyry Forest Meeting](https://www.gchq.gov.uk/information/the-pyry-forest-meeting) and [Polish Foreign Intelligence Agency — Enigma decryption](https://aw.gov.pl/en/history/enigma-decryption/183,Enigma-decryption.html): Polish work and international cooperation.
- **S12:** [The National Museum of Computing — Colossus](https://www.tnmoc.org/colossus): Lorenz/Colossus distinction.
- **S13:** [Bletchley Park — Activity role profiles](https://bletchleypark.org.uk/wp-content/uploads/2025/01/Bletchley-Park-Activity-Role-Profiles-V3-small.pdf): roles and operational work; starting point for deeper personnel research.
- **S14:** [Science Museum Group Journal — Zygalski sheets](https://journal.sciencemuseum.ac.uk/article/zygalski-sheets-polish-codebreaking-and-the-role-of-reconstruction-in-the-top-secret-exhibition-at-the-science-museum/): Polish methods, artifacts, and reconstruction.
