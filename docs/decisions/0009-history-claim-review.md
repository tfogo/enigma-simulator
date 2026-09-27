# 0009: Passage-level historical evidence and beginner trial preparation

Status: implemented and locally verified, 27 September 2026. Trial protocol prepared; no user study conducted.

## Review scope

The six current History passages were compared with the relevant Crypto Museum K/M4 pages, GCHQ's Pyry account, TNMOC's Bombe account, and Weierud's 1930 transcription. These five pages returned readable source content on this review. No new claim is made about access to the separate working-principle page, whose earlier retry limitation remains recorded.

The existing introductory wording is supported within its stated scope. Sixteen claim records in `docs/history-claims.json` identify individual propositions, source IDs, locators, evidence types, and review dates. The institutional interpretation of Polish contributions is labelled as such. General statements about machine families and the communications workflow are labelled as syntheses. The manual's archival provenance remains a report from the transcription, not a claim of direct archival inspection.

Each History card exposes Evidence for this passage, showing the relevant propositions and links beside the narrative. This adds granularity without replacing the curated further-reading notes.

## Preventing unreviewed copy drift

The registry also stores the SHA-256 digest of each reviewed summary and detail passage. Tests fail when those texts change without an accompanying review update. This is an editorial reminder, not an automated fact checker: recomputing a hash alone does not constitute review. Contributors should inspect the source, update the supported claims and limitations as needed, and only then update the digest. Source IDs, claim IDs, and locators are validated as well.

This increment reviews the current History route. It does not certify every external source, every lesson sentence, the glossary, future historical expansions, or the historical interpretation of documents not inspected. Technical claims remain supported by their source records and engine fixtures, with a wider release audit still pending.

Verification: production build, strict library type checks, and all 110 engine tests passed. The desktop/mobile frontend run passed 42 cases; the two new editorial checks initially failed because of a Node JSON import issue. After correcting the test imports, all 10 reference cases passed, covering both previously failing checks. Together these runs verify all 44 frontend cases.

## Beginner trial

`docs/beginner-trial.md` contains a 30-minute formative protocol: setup, consent for notes, non-leading participant tasks, observation criteria, a private notes template, and a prioritization method. It tests explanations and recovery of plaintext rather than relying on quiz badges or satisfaction alone. No participants were contacted and no trial results have been invented. Actual beginner sessions and manual assistive-technology checks remain open.
