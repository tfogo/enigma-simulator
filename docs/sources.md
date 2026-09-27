# Foundation source ledger

The machine and test fixtures use these checked references. Structured records are in [sources.json](sources.json); ciphertext fixtures, full settings, source IDs, and transcription notes are in [reference-vectors.json](../test/fixtures/reference-vectors.json).

| Source | Evidence used | What to read next |
| --- | --- | --- |
| [Crypto Museum: wiring catalogue](https://www.cryptomuseum.com/crypto/enigma/wiring.htm) | Model component sets and reflector A | Military and commercial wiring tables, with notation conventions |
| [Crypto Museum: Enigma explained](https://www.cryptomuseum.com/crypto/enigma/working.htm) | Pre-signal stepping, index-ring notches, consecutive double-step sequence, plugboard capacity | Illustrated beginner explanation of the electrical and mechanical paths; see the period discrepancy below |
| [Py-Enigma user's guide](https://py-enigma.readthedocs.io/en/latest/guide.html#example-communication-procedure) | Published three-rotor message-key and body examples with nonzero rings and plugs | A software-oriented send/receive walkthrough; the teaching message is not an authentic intercept |
| [M4 Project: first break](https://www.bytereef.org/m4-project-first-break.html) | Original published ciphertext and raw recovered text with full M4 settings | Research result, interpretation, and a pointer to the historical diary; we have not inspected that diary ourselves |
| [Crypto Museum: M4](https://www.cryptomuseum.com/crypto/enigma/m4/index.htm) | Matching Greek-rotor/thin-reflector combinations | How the fourth rotor and reflector fit together |
| [Hamer, Sullivan and Weierud: Enigma Variations](https://cryptocellar.org/pubs/enigvar.pdf) | Single-notch three-wheel period of 16,900 | Specialist research into different mechanical families |

### Recorded disagreement: stepping period

Crypto Museum's working-principle page gives 16,926. The specialist paper *Enigma Variations* gives 16,900 for single-notch three-wheel Enigma stepping. We use the latter and independently enumerate all 16,900 distinct states from AAA before returning to AAA. This claim is specific to single-notch rotors; it is not a blanket period for all naval/multi-notch configurations. Retaining both citations makes the editorial decision auditable.

Accessed 27 September 2026. Fixture normalization uppercases letters, removes line breaks, converts letter settings to zero-based indices, and spaces plugboard pairs. It does not correct recovered spelling or infer missing letters. The test suite checks the cited data in both directions.

This is the initial evidence ledger for M0–M1, not the complete visitor-facing bibliography planned in M5. Keep exact locators and any limitations when adding new references. Wiring tables, date-specific model histories, and new lesson claims need their own records as those features are implemented.
