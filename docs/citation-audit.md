# Citation coverage record

Structural checks and a review of the seven current History passages were completed on 27 September 2026. Source support and access limitations are recorded in `sources.json`; frontend annotations resolve those records in `web/src/content.ts`.

| Content | Source record | Evidence location / scope |
| --- | --- | --- |
| Commercial-machine chapter | crypto-museum-k | Introduction and standard version |
| 1930 procedure chapter and runnable example | crypto-cellar-1930 | Key settings, indicator description, Ciphertext only, Decrypts; transcription checked, archival original not inspected |
| Polish-sharing chapter | gchq-pyry | Opening account and 1939 exchange; retrospective institutional account |
| Interception and Bombe chapters | tnmoc-bombe | The Bombe paragraphs on Y stations, cribs, diagonal board, and BTM; loose prewar chronology not adopted |
| Naval fourth-rotor chapter | crypto-museum-m4 | Reflector and compatible operation; engine tests independently check stationary stepping and compatibility |
| First four lessons and mechanical glossary | crypto-museum-working | Circuit, stepping, and plugboard explanations; engine-backed experiments; period discrepancy explicitly disclosed |
| Plaintext, ciphertext, indicator glossary | crypto-cellar-1930 | The worked historical procedure; indicator definition scoped to this example |
| Crib and Bombe glossary | tnmoc-bombe | Crib-based key-search explanation |

`web/tests/reference.spec.ts` rejects dangling source aliases, missing locators, empty claim lists, duplicate curated IDs, and non-HTTPS source URLs. Browser tests check usable source navigation and retained session state. These checks are not live link monitoring or historical peer review.

Access recheck: the working-principle page returned readable content on a subsequent visit on 27 September 2026. The access note preserves the earlier verification interstitial and records the successful later content review. The period disagreement remains disclosed.

The current History passages now resolve nineteen stable claim IDs in `history-claims.json`, with locators and evidence-type labels. Reviewed passage digests flag later copy changes for another editorial review. See decision 0009 for scope. Remaining editorial work: extend this claim-level treatment to other content and any broader wartime narrative, obtain independent historical review where possible, and verify sources again before release. Never remove a limitation merely to make the audit appear complete.

## First-release content review, 27 September 2026

- Lessons 1–4: compared objectives, predictions, explanations, and feedback with the circuit, Rotor wiring, Rotor stepping, Reflector, and Steckerbrett sections of Crypto Museum’s working page. Repetition within thirty letters is an explicitly explained pigeonhole deduction, not a claim of randomness. HELLO/reset experiments use the real engine and their browser tests. Each lesson now has its own locator.
- All ten glossary definitions: checked against their respective mechanics, 1930 procedure, or Bombe sections. Each term now exposes a precise locator. The indicator definition remains scoped to the 1930 example.
- Seven History passages: nineteen checked claims. Added the museum’s attribution of women in the WRNS and men in the RAF, and a separate Lorenz/Colossus passage with engineering attribution.
- Component profiles and UI settings: backed by the wiring ledger, independent known-answer fixtures, invalid-configuration tests, turnover/reciprocity checks, and M3/M4 equivalence checks. Alphabetic window labels are a teaching convention; service-machine numeric markings are discussed in the wiring source. No date-specific daily keys are claimed.
- All nine reader-facing reference URLs returned readable content on this review. The additional Py-Enigma and M4 Project fixture sources also returned content. This is a dated check, not a guarantee of future availability.

No new photographs, archival scans, long quotations, or translated historical prose were copied. The 1930 transcription’s archival original remains uninspected. This is an internal review of the implemented release scope, not independent historical peer review or validation of future roadmap chapters.
