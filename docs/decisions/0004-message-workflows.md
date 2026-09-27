# 0004: Message workflows, checkpoints, and sharing

Status: implemented and locally verified, 27 September 2026. The user accepted the M3 visual direction. M4 remains in progress for sequenced animation and manual assistive-technology verification.

## Message input and inspection

Explore accepts typed or pasted drafts with an exact normalized preview before submission. Only ASCII A–Z letters are retained, lowercase becomes uppercase, and all other characters are omitted. We explicitly describe this as a teaching convention, not a historical operating procedure. Editing a draft does not alter the machine or transcript. Drafts and selected history entries survive navigation between views during the visit.

Messages are capped at 500 letters, replacing the prototype's 80-letter cap. A batch that would exceed the limit is rejected in full; it is never truncated. The reducer processes each letter synchronously through the library's traced keypress API. Rapid input retains order, undo removes one letter, and all state mutations return inspection to the latest keypress. The inspector can replay any earlier entry without changing live windows. Navigation stops replay when the inspector unmounts.

Output can be grouped in fives and copied. This changes presentation only. The grouping preference is stored under `enigma.preferences.v1.groupOutput`; unavailable browser storage falls back to session-only behavior. Clipboard denial leaves readable, selectable output or a link to copy manually.

## Starting settings versus a live checkpoint

Each frontend session now retains both its starting snapshot and current snapshot. Reset returns to the session's starting snapshot. A normal configured session starts at its configured positions. A restored checkpoint starts at its saved live positions, so reset lets the visitor repeat that resumed segment. Undo uses the immediately preceding snapshot. This frontend reset behavior does not change the engine's existing `reset()` contract.

Export current settings downloads the existing engine snapshot schema as JSON. Import validates it through the engine before changing any state, clears the transcript, and starts at the saved live windows. Malformed or oversized input leaves the machine intact. Export/import does not save message text or history.

Share starting settings creates a URL fragment containing a base64 JSON envelope `{ version: 1, snapshot }`. The snapshot is the session start, allowing another visitor to decipher the same message from the same state. The URL contains no plaintext or ciphertext. Both initial page load and subsequent hash navigation accept validated version-1 links. Unknown formats, versions, and invalid engine settings produce an inline error without overwriting the current machine. Existing path is retained so static subdirectory hosting remains possible; query parameters are excluded. Link generation is local and does not publish the site.

## Verification and remaining work

Sixteen Chromium browser checks pass across desktop and 390px mobile viewports, including reduced-motion mobile settings. Coverage includes normalization, full-capacity input, rapid typing, undo/reset, history selection, draft navigation during replay, an M4 starting-link decrypt, checkpoint continuation, malformed imports/links, clipboard and storage denial, and expanded-tool accessibility scans. The original 110 runtime tests and type checks remain part of verification.

Visual review covers the new message and save/restore panels at both sizes. This is not a manual screen-reader or physical-device certification. M4 still needs coordinated stepping/signal animation, explicit immediate-result mode selection, and manual assistive-technology checks. Saved complete sessions, public deployment, and broader curriculum are outside this increment.
