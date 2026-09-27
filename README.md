# Enigma Simulator
An npm module for Enigma Machines. It can simulate a Wehrmacht Enigma I and Kriegsmarine M3 and M4 variants.

## Install

The development version requires Node.js 22.12 or newer. Foundation changes in this checkout are unreleased; `npm install` retrieves the published package.

```
npm install enigma-simulator
```

## Example Usage

Require the `enigma-simulator` module:

```js
var enigma = require('enigma-simulator');
```

Create a Wehrmacht Enigma I Machine with a B reflector and rotors III, II, I with default positions and ring settings:

```js
var e1 = enigma();
e1.encodeString('ABC'); // 'FUV'
```

Or create an Enigma machine with your own settings (rotors, positions, ringSettings, reflector, plugboardPairs):

```js
var m3 = enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AS TH LR');
m3.encodeString('ABC'); // 'IGT'
```

Create a Kriegsmarine M4 Enigma Machine:

```js
var m4 = enigma(['Gamma','III','II','I'], [0,0,0,0], [0,0,0,0], 'BThin');
m4.encodeString('ABC'); // 'BPF'
```

## Documentation

### enigma()

#### Syntax
```
enigma(rotors, positions, ringSettings, reflector, plugboardPairs)
```

#### Output

Returns an instance of `EnigmaMachine`.

#### Parameters

**rotors** Optional. An array of strings which represent the rotor types to use in which position (left to right). Available rotors are:

| Rotor | Encoding | Turnover | Notes |
| --- | --- | --- | --- |
| `'I'` | EKMFLGDQVZNTOWYHXUSPAIBRCJ | Q | Wehrmacht Enigma I |
| `'II'` | AJDKSIRUXBLHWTMCQGZNPYFVOE | E | Wehrmacht Enigma I |
| `'III'` | BDFHJLCPRTXVZNYEIWGAKMUSQO | V | Wehrmacht Enigma I |
| `'IV'` | ESOVPZJAYQUIRHXLNFTGKDCMWB | J | Enigma I, M3 and M4 |
| `'V'` | VZBRGITYUPSDNHLXAWMJQOFECK | Z | Enigma I, M3 and M4 |
| `'VI'` | JPGVOUMFYQBENHZRDKASXLICTW | Z & M | Naval M3 and M4 |
| `'VII'` | NZJHGRCXMYSWBOUFAIVLPEKQDT | Z & M | Naval M3 and M4 |
| `'VIII'` | FKQHTLXOCBJSPDZRAMEWNIUYGV | Z & M | Naval M3 and M4 |
| `'Beta'` | LEYJVCNIXWPBQMDRTAKZGFUHOS |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |
| `'Gamma'` | FSOKANUERHMBTIYCWLQPZXVGJD |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |

The array requires three distinct moving rotors from I–VIII, or a leftmost Beta/Gamma followed by three distinct moving rotors. The Greek rotor does not advance on keypresses. Three-rotor machines require B/C; four-rotor machines require BThin/CThin. Enigma I used I–V; M3 and M4 also had VI–VIII. These are structural constraints, not date-specific historical profiles. See [Crypto Museum's wiring catalogue](https://www.cryptomuseum.com/crypto/enigma/wiring.htm) for historical component sets.

Defaults to `['III', 'II', 'I']`. Input arrays are copied, never reversed or modified in place.

**positions** Optional. One integer from 0 to 25 per rotor, left to right, representing the visible window (A=0). Defaults to zero for each selected rotor, including four-rotor machines.

**ringSettings** Optional. One integer from 0 to 25 per rotor, left to right, representing the ring setting (Ringstellung, A=0). Defaults to zero for each selected rotor. Historical numeric settings 01–26 must be converted to zero-based values.

**reflector** Optional. A string which represents the reflector type used. Available reflectors are:

| Reflector | Encoding | Notes |
| --- | --- | --- |
| `'B'` | YRUHQSLDPXNGOKMIEBFZCWVJAT |  |
| `'C'` | FVPJIAOYEDRZXWGCTKUQSBNMHL |  |
| `'BThin'` | ENKQAUYWJICOPBLMDXZVFTHRGS | Kriegsmarine M4 |
| `'CThin'` | RDOBJNTKVEHMLFCWZAXGYIPSUQ | Kriegsmarine M4 |

Defaults to `'B'`.

**plugboardPairs** Optional. Up to 13 disjoint pairs of uppercase letters separated by whitespace. Letters cannot be reused or connected to themselves. This represents the letters switched on the plugboard (Steckerbrett). Defaults to an empty string (no substitutions).

### EnigmaMachine.encodeString()

#### Syntax

```
enigmaMachine.encodeString(text)
```

#### Output

Returns a string which is the encoding/decoding of `text`.

#### Parameters

**text** A string containing only uppercase A–Z. The complete input is validated before any rotor moves. Invalid input throws; an empty string returns an empty string without stepping. Normalize text explicitly before passing it to the engine.

### Keypresses and resetting

```js
const machine = enigma();
const ciphertext = machine.encodeString('HELLO');
machine.reset(); // Restore the constructor's window positions.
machine.encodeString(ciphertext); // 'HELLO'

machine.setPosition([0, 0, 0]); // Absolute windows, left to right.
machine.encodeChar('A'); // 'N': inspect the current circuit WITHOUT stepping.
machine.pressKey('A');   // 'F': step first, then encode one letter.
```

`encodeChar()` retains its legacy non-stepping behavior. Use `pressKey()` for a physical keypress or `encodeString()` for a message. Both single-character methods reject anything except one uppercase A–Z letter without changing state. `cycleRotors()` advances the mechanism once without encoding.

`setPosition()` validates all positions before changing any of them. `reset()` restores the saved constructor windows, not rings altered through internal rotor objects. The public `rotors` array retains its legacy right-to-left order; direct internal mutation is not a supported configuration API. Rotor `position` is now the normalized visible position (0–25), and its string inspection properties are read-only derived views.

## Development

```sh
npm ci --ignore-scripts
npm test
```

Tests cover legacy outputs, invalid-input atomicity, setters, double stepping, both naval notches, complete single-notch stepping period, wiring invariants, and independently published ciphertexts. CI is configured for Node 22, 24, and 26 on Linux plus Node 24 on Windows.

Repository documentation:

- [Roadmap](ROADMAP.md)
- [Foundation decisions and compatibility changes](docs/decisions/0001-engine-foundation.md)
- [Sources and fixture provenance](docs/sources.md)

These documents are maintained in the repository and excluded from the npm runtime package. This increment fixes non-default M4 output, rejects formerly accepted invalid setups, and raises the supported Node baseline. It is intended for a future major release; no new version has been published.

## Learn More

A good introduction to the Enigma Machine is this [Numberphile video](https://www.youtube.com/watch?v=G2_Q9FoD-oQ). You can find out more about the details of the inner workings of the machine on [Dirk Rijmenants' website](http://users.telenet.be/d.rijmenants/en/enigmatech.htm). One of the more complex quirks of the Enigma Machine's mechanism is the "double step". You can see this in action in [this video](https://www.youtube.com/watch?v=hcVhQeZ5gI4).

## Contributors 🎉

[mrpjevans](https://github.com/mrpjevans)
