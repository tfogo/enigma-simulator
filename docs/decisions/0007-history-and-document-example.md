# 0007: Shared sources and a reproducible historical example

Status: implemented and locally verified, 27 September 2026. M5 remains in progress.

## Source records

The frontend's curated reading annotations now resolve their URLs, access dates, evidence notes, and checked claims from `docs/sources.json`. Presentation aliases preserve existing lesson links; source IDs provide a stable connection to the ledger. Missing records fail explicitly. Contextual notes and Reference's Evidence & access disclosures expose the scope of verification, including cases where a web transcription was checked instead of an archival original.

This is a shared registry, not a completed claim-by-claim audit of every sentence. Further editorial work should connect finer-grained claim IDs and precise locators as the narrative grows. Museum and institutional accounts remain distinct from historical document transcriptions.

## Historical route

The introductory route now has six sections: commercial use, operator procedure through a 1930 manual example, Polish knowledge sharing, interception and cribs, the Bombe search, and the naval fourth rotor. The new interception and search material follows the National Museum of Computing's Bombe description. Its loose prewar chronology is not adopted; the source record retains that limitation.

The manual card uses Frode Weierud's transcription and explicitly distinguishes a training example predating the war from an intercepted wartime message. The underlying archive reference is HW25/9; the archival document has not been inspected. Source pages for this increment were checked on 27 September 2026.

## Document to experiment

The indicator and body presets reuse `test/fixtures/reference-vectors.json`, so the UI and engine correctness suite share the same historical settings and raw letter streams. Both use reflector A, rotor order II–I–III, rings XMV, and the documented six plugboard pairs. The indicator starts at FOL; the body starts at ABL.

Loading an example explicitly starts a fresh Explore session and puts its ciphertext in the draft. The visitor reviews the input and submits it through the normal message workflow. The indicator reproduces ABLABL; the body reproduces the source's uncorrected letter stream. The interface reports a match only while both input and output exactly match the fixture. Undo or further typing removes that success message. Applying other settings dismisses the example context. Learn remains independent.

The expected result, raw-spelling policy, original numeric ring values, source locator, and evidence limitation are available beside the experiment. The example demonstrates operation with known settings; it does not simulate cryptanalytic recovery of unknown keys.

## Verification and next boundary

Thirty-four desktop/mobile browser tests pass, including both historical decrypts, source-record consistency, evidence disclosures, independent lesson state, accessibility scans, and overflow checks. The historical vectors also remain covered by the library's known-answer tests. Production build and type checks pass.

Next M5 work: glossary and deeper artifact/source navigation, a finer-grained citation audit, broader historical context, and beginner usability trials. The separate manual screen-reader and physical-device verification checklist remains open.
