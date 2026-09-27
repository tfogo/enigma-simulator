# 0008: Glossary and source navigation

Status: implemented and locally verified, 27 September 2026.

## Reading support

Reference now includes ten searchable terms: plaintext, ciphertext, rotor, window position, ring setting, plugboard, reflector, indicator, crib, and Bombe. Definitions describe the mechanisms and examples used by the guide. Indicator terminology is explicitly scoped to the 1930 example rather than presented as a universal wartime procedure.

Every term opens its matching source record. Contextual Source & further reading notes in lessons, historical chapters, and the historical example also offer View source record. Opening a record clears resource filters, expands its evidence disclosure, scrolls it into view, and focuses the card. Tab then reaches the external source link. A return control restores the originating view with its in-memory lesson or experiment state intact. Ordinary navigation clears this temporary citation context. External source links continue to open separately.

Source records show selected checked claims alongside locators, attribution, review date, and evidence limitations. This exposes the ledger rather than implying that every statement on an external page has been endorsed.

## Citation audit boundary

Automated checks cover every current history section, glossary term, and lesson. Each source alias must resolve to a unique curated record with a locator, an HTTPS URL, and at least one recorded claim. Browser checks cover both contextual and glossary navigation, focus, return state, accessible names, and responsive overflow.

These are structural and interaction checks. They do not establish that every sentence has undergone a new independent historical review. The source ledger remains the record of the particular claims reviewed. Finer-grained claim IDs and a sentence-level historical audit are still open.

The latest attempt to revisit Crypto Museum's working-principle page returned a verification interstitial. Its previously checked evidence is retained, and a separate access-outcome note is shown in the UI. The existing review date is not presented as proof of a new successful verification.

## Verification and next work

Forty desktop/mobile test cases pass, including all prior simulator, lesson, and historical-example flows. Six reference-focused cases also pass after the final access-note and navigation cleanup. Production build, engine tests, and type checks pass. Manual screen-reader listening, physical-device testing, and beginner trials remain open.

Next work: deepen historical coverage and audit claims individually, then prepare a concrete beginner trial and release-readiness checklist. No public release or deployment has been performed.
