# Citation coverage record

Structural checks and a review of the six current History passages were completed on 27 September 2026. Source support and access limitations are recorded in `sources.json`; frontend annotations resolve those records in `web/src/content.ts`.

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

Latest access exception: the working-principle page returned a verification interstitial on a repeat visit. Earlier checked evidence is retained with a visible access update. Do not mark a verification page as successful content access.

The current History passages now resolve sixteen stable claim IDs in `history-claims.json`, with locators and evidence-type labels. Reviewed passage digests flag later copy changes for another editorial review. See decision 0009 for scope. Remaining editorial work: extend this claim-level treatment to other content and any broader wartime narrative, obtain independent historical review where possible, and verify sources again before release. Never remove a limitation merely to make the audit appear complete.
