# 0010: Reflow, package-consumer checks, and correction workflow

Status: implemented and locally verified, 27 September 2026. No public release or deployment.

## Narrow layouts and keyboard entry

The browser suite now checks all four views at 320 CSS pixels, including expanded historical evidence and M4 operation. Machine keys remain within the viewport and at least 24 × 24 CSS pixels. A separate keyboard check activates the skip link and confirms that subsequent navigation enters main content.

These checks passed without layout changes. A 320px viewport models the reflow width of a 1280px viewport at 400% zoom; it does not test actual browser zoom, speech output, or physical touch usability. The manual accessibility checklist remains open.

## Verify the distributed artifact

The app normally imports the engine through a repository alias, which cannot prove that an installed package works independently. `npm run test:package` now packs the library, inspects its file list, installs the tarball into a temporary consumer, and checks its CommonJS entry point and absence of runtime dependencies. It builds a production browser consumer with Vite without the app's alias, then runs it in Chromium.

The browser consumer reproduces all five sourced vectors in both directions and checks trace availability and serialized continuation for Enigma I, M3, and M4. The temporary consumer uses the repository's Vite and Playwright tools, but imports the engine solely from its installed tarball. This verifies the candidate package, not a package fetched from the public registry or every possible bundler. The script cleans up its server, browser, and temporary files.

This check is added to the frontend CI job after Chromium installation. Remote CI execution is still unverified.

## Contributions and corrections

Reference now links to a historical/citation correction issue template. Readers can report a passage, source, uncertainty, or broken link and supply supporting evidence. The link opens the repository's issue form; it does not submit an issue. The template becomes available remotely after the commit is pushed to the default branch.

`CONTRIBUTING.md` documents development checks, source-review expectations, package boundaries, rights and attribution for proposed media, and handling of participant notes. The README links it, includes the package check, and clarifies that completion markers persist while live message state does not.

## Verification and remaining work

The production build and all 48 desktop/mobile browser cases passed. The packed consumer check passed on the local environment. No engine implementation changed in this increment; its 110-test suite and type checks passed in the preceding increment.

Screen-reader speech, actual browser zoom, physical devices, real beginner sessions, the wider editorial/link audit, release licensing/media review, release notes, hosting, and publication remain separate work. None is marked complete by these automated checks.
