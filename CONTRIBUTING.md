# Contributing

The repository contains an independent CommonJS simulator and a React learning guide. See [the roadmap](ROADMAP.md) for planned scope and [the decisions](docs/decisions/) for behavior already agreed. Keep changes small enough to review with their relevant evidence.

## Develop and verify

Use Node.js 22.12 or newer:

```sh
npm ci --ignore-scripts
npm test
npm run test:types
npm run dev
```

For frontend or packaging changes:

```sh
npm run build:web
npx playwright install chromium firefox webkit
npm run test:web
npm run test:package
```

`test:web` serves the built frontend, so rebuild after changing app code. `test:package` packs the library into a temporary directory, installs that tarball into a fresh consumer, checks its contents and CommonJS entry point, then builds and runs a browser consumer with Vite and Chromium. It checks all reference vectors and snapshot continuation for all three profiles. It uses the repository's development tools but no source alias to the engine. It removes its temporary files afterward. Neither command publishes anything.

Engine changes need independently supported known-answer or transition tests where applicable. A round trip alone cannot establish correct historical behavior. For UI changes, verify the affected workflow, keyboard access, narrow layouts, and reduced motion. Automated accessibility checks supplement the [manual checks](docs/accessibility-checks.md); record what was actually tested.

## Historical evidence and corrections

Readers can use the Reference page's correction link or [open a correction issue](https://github.com/tfogo/enigma-simulator/issues/new?template=historical-correction.md). Include the passage or claim ID, what appears wrong, and supporting source with a page/section when available. Report inaccessible sources or broken links even if you cannot supply replacement evidence. Submitting an issue requires a GitHub account; a patch with a written explanation is also welcome.

When editing historical content:

1. Read the source and record its exact locator and access limitations in `docs/sources.json`. Distinguish primary documents, transcriptions, later accounts, and explanatory deductions.
2. For the reviewed History passages, update supported propositions and source IDs in `docs/history-claims.json`. Preserve uncertainty and disagreements.
3. After reviewing changed wording, update the relevant SHA-256 digest of the exact UTF-8 `text` or `detail` string. The reference test flags copy changes; merely updating a digest is not historical verification.
4. Keep examples reproducible with full settings, provenance, and expected output in `test/fixtures/reference-vectors.json` when applicable. Label invented teaching messages.
5. Check contextual links, keyboard navigation, and readable source notes. Update the citation audit with the scope actually reviewed.

Write original explanations. Before adding photographs, scans, transcripts, or other media, record permission/license, required attribution, source URL, and alt text. Linking a work does not grant permission to reproduce it. Credit sources without implying their authors endorse this project.

Do not commit participant identities, recordings, private observations, or personal messages. The [beginner trial protocol](docs/beginner-trial.md) describes how to collect useful observations separately.

## Pull requests

Explain the concrete behavior changed, why it helps, the evidence supporting historical or mechanical claims, and checks run. Identify remaining verification limits. Keep the runtime free of frontend dependencies and check the packed artifact when changing package boundaries. Publication and release versioning are separate maintainer decisions.
