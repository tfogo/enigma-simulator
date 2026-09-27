# 0012: Cross-browser verification and local release candidate

Status: release preparation, 27 September 2026. Publication is deferred by the user until the end.

The browser suite now includes Firefox desktop and WebKit at a narrow mobile viewport alongside Chromium desktop/mobile. CI installs all three engines. Native clipboard read/write verification uses Chromium's supported automation permission; blocked-storage/clipboard recovery runs on every engine. WebKit keyboard traversal uses Option/Alt+Tab to include links, and completion-focus retention is tested by keyboard activation rather than assuming a mouse click focuses a native button.

The first expanded run found unsupported clipboard permission requests and those focus assumptions in the tests. One WebKit pointer activation of an evidence disclosure also failed; it passed a rerun and three repetitions without an app change. Keep this recorded rather than claiming a diagnosed app fix.

The repository now includes the MIT license already declared in package metadata, draft major-release notes, an asset/attribution inventory, and the third-party MIT notices for bundled React, React DOM, and Scheduler. The production site links its software notices and supplies a no-JavaScript explanation. No external image or archival scan has been added. Google Fonts remains an external request with system fallbacks.

`docs/release-handoff.md` specifies the static output, root/subdirectory build choices, local verification commands, separate npm publication flow, and outstanding human checks. There is no deployment, remote push, new package version, or npm publication in this increment.

Local verification: all 96 browser cases passed across the four projects, along with the production build, 110 engine tests, strict consumer type checks, and packed-artifact browser checks. Desktop/mobile screenshots were inspected and saved in `docs/images/`. The production JavaScript is about 309 kB (97 kB gzip) and CSS about 24 kB (6 kB gzip); these are build measurements, not physical-device performance results.
