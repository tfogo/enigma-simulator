# First learning release: deployment handoff

Status: local release candidate; deployment and npm publication are deferred. This document is the concrete handoff for the final publication decision, not permission to publish.

## What is ready

The static site includes four beginner lessons, the Enigma I/M3/M4 workbench, replay and message tools, seven sourced History passages, a runnable manual example, and a searchable glossary/reference library. The engine remains independently installable. See `CHANGELOG.md` for changes and `docs/migration.md` for breaking behavior.

## Reproduce the candidate

Use the committed lockfile and Node 22.12 or newer:

```sh
npm ci --ignore-scripts
npm test
npm run test:types
npm run build:web
npx playwright install chromium firefox webkit
npm run test:web
npm run test:package
npm run preview
```

The preview is local at `http://127.0.0.1:4173/`. `web/dist/` contains the complete site: `index.html`, hashed assets, and `THIRD_PARTY_NOTICES.txt`. Do not upload the repository or `node_modules`. There is no application server, database, account system, analytics script, or environment secret to configure.

Machine messages and current experiments are held in memory and disappear on reload. Lesson completion IDs and the grouping preference use browser-local storage. Settings links put validated settings in the URL fragment, with no message text. External source links open third-party sites; Google Fonts is requested separately and has system-font fallbacks.

## Publication choices needed at the end

Choose a static hosting account/project and the final public URL. No provider, account, domain, or deployment has been created. Root-hosted sites can use the default build. For a subdirectory such as `/enigma-simulator/`, build with:

```sh
npm run build:web -- --base=/enigma-simulator/
```

Use that exact build output on the matching path. The app uses same-document views and fragment-based settings links; it does not require server-side route rewrites for Learn/Explore/History/Reference. Preserve URL fragments through redirects. Serve JavaScript/CSS with their normal MIME types and keep the software notices accessible. Cache hashed assets long-term; serve `index.html` with revalidation so it does not strand visitors on removed asset filenames.

After hosting is selected, preview the actual production URL and check loading, reload, a shared M4 link, copy/export over HTTPS, all four views, and source/credit links. Keep the preceding deployment available for rollback. Do not publish the npm library as a side effect of publishing the site.

For a later npm release, agree the major version (4.0.0 is proposed), update the package and lockfile versions, rerun the packed-consumer check, and review `npm pack --dry-run`. Tag/push/publish only when explicitly authorized. The unchanged version 3.0.0 in this checkout is not a new release.

## Outstanding human validation

- Real VoiceOver/Safari and NVDA/browser speech checks, actual 200%/400% zoom, and a physical touch-device pass remain unperformed. Automated Chromium, Firefox, and WebKit results do not replace them.
- The beginner trial protocol is ready; no participants have been recruited and no results exist. Use those observations before declaring the first learning journey validated for beginners.
- Historical review is internal. Source limitations and the period disagreement are visible; the 1930 archival original has not been inspected.
- Remote CI will only be known after pushing. The correction issue template likewise becomes available on GitHub after that push.

The remaining curriculum, comparisons, detailed operating procedures, historical variants, and optional codebreaking/classroom tools are M7–M9. They are outside the first learning release and should build on feedback. Deferring deployment does not imply those optional expansions have already been implemented.

## Local verification result

Candidate `ecae330` passed a clean installation, 110 engine tests, consumer type checks, both root and subdirectory production builds, and the independent tarball/browser check. The full working-checkout browser run passed 96 cases across Chromium desktop/mobile, Firefox, and WebKit. The subdirectory smoke check covered M4 share/reload, every view, software credits, and unavailable external fonts. Nothing was pushed or deployed.
