# Enigma Simulator
An npm module for simulating an M3 Enigma Machine.

## Install
```
npm install enigma-simulator
```

## Example Usage

Require the `enigma-machine` module:

```js
var enigma = require('enigma-machine');
```

Create a Wehrmacht Enigma I Machine with a B reflector and rotors III, II, I with default positions and ring settings:

```js
var m3 = enigma();
m3.encodeString('ABC'); // 'FUV'
```

Or create an Enigma machine with your own settings (rotors, positions, ringSettings, reflector, plugboardPairs):

```js
var m3 = enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AS TH LR');
m3.encodeString('ABC'); // 'IRD'
```

Create a Kriegsmarine M4 Enigma Machine:

```js
var m3 = enigma(['Gamma','III','II','I'], [0,0,0,0], [0,0,0,0], 'BThin');
m3.encodeString('ABC'); // 'BPF'
```

## Documentation

### \#constructor()

#### Syntax
```
new Enigma(rotors, positions, ringSettings, reflector, plugboardPairs)
```

#### Parameters

**rotors** Optional. An array of strings which represent the rotor types to use in which position (left to right). Available rotors are:

| Rotor | Encoding | Turnover | Notes |
| --- | --- | --- | --- |
| `'I'` | EKMFLGDQVZNTOWYHXUSPAIBRCJ | Q | Wehrmacht Enigma I |
| `'II'` | AJDKSIRUXBLHWTMCQGZNPYFVOE | E | Wehrmacht Enigma I |
| `'III'` | BDFHJLCPRTXVZNYEIWGAKMUSQO | V | Wehrmacht Enigma I |
| `'IV'` | ESOVPZJAYQUIRHXLNFTGKDCMWB | J | M3 |
| `'V'` | VZBRGITYUPSDNHLXAWMJQOFECK | Z | M3 |
| `'VI'` | JPGVOUMFYQBENHZRDKASXLICTW | Z & M | Kriegsmarine M4 |
| `'VII'` | NZJHGRCXMYSWBOUFAIVLPEKQDT | Z & M | Kriegsmarine M4 |
| `'VIII'` | FKQHTLXOCBJSPDZRAMEWNIUYGV | Z & M | Kriegsmarine M4 |
| `'Beta'` | LEYJVCNIXWPBQMDRTAKZGFUHOS |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |
| `'Gamma'` | FSOKANUERHMBTIYCWLQPZXVGJD |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |

The array expects 3 items (to simulate the Wehrmacht Enigma I or M3) or 4 items (for the Kriegsmarine M4). If the Enigma Machine is initialized with four rotors, it is assumed the left-most rotor is a Beta/Gamma rotor in an M4. Therefore the left-most rotor will not rotate.

Defaults to `[III, II, I]`.

**positions** Optional. An array of integers `[0..25]` which represent the positions of the rotors. Defaults to `[0, 0, 0]`.

**ringSettings** Optional. An array of integers `[0..25]` which represent the ring settings (or Ringstellung) of the rotors. Defaults to `[0, 0, 0]`.

**reflector** Optional. A string which represents the reflector type used. Available reflectors are:

| Reflector | Encoding | Notes |
| --- | --- | --- |
| `'B'` | YRUHQSLDPXNGOKMIEBFZCWVJAT |  |
| `'C'` | FVPJIAOYEDRZXWGCTKUQSBNMHL |  |
| `'BThin'` | ENKQAUYWJICOPBLMDXZVFTHRGS | Kriegsmarine M4 |
| `'BThin'` | RDOBJNTKVEHMLFCWZAXGYIPSUQ | Kriegsmarine M4 |

Defaults to `'B'`.

**plugboardPairs** Optional. A string containing a list of pairs of letters separated by spaces. This represents the letters that should be switched on the plugboard (or Steckerbrett). Defaults to an empty string (no substitutions).

### \#encodeString()

#### Syntax

```
enigmaMachine.encodeString(text)
```

#### Parameters

**text** The text to encode/decode. The text is required to only contain uppercase letters from the latin alphabet.
