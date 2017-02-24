# Enigma Simulator
An npm module for Enigma Machines. It can simulate a Wehrmacht Enigma I and Kriegsmarine M3 and M4 variants.

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
var e1 = enigma();
e1.encodeString('ABC'); // 'FUV'
```

Or create an Enigma machine with your own settings (rotors, positions, ringSettings, reflector, plugboardPairs):

```js
var m3 = enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AS TH LR');
m3.encodeString('ABC'); // 'IRD'
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
| `'IV'` | ESOVPZJAYQUIRHXLNFTGKDCMWB | J | Kriegsmarine M3 |
| `'V'` | VZBRGITYUPSDNHLXAWMJQOFECK | Z | Kriegsmarine M3 |
| `'VI'` | JPGVOUMFYQBENHZRDKASXLICTW | Z & M | Kriegsmarine M4 |
| `'VII'` | NZJHGRCXMYSWBOUFAIVLPEKQDT | Z & M | Kriegsmarine M4 |
| `'VIII'` | FKQHTLXOCBJSPDZRAMEWNIUYGV | Z & M | Kriegsmarine M4 |
| `'Beta'` | LEYJVCNIXWPBQMDRTAKZGFUHOS |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |
| `'Gamma'` | FSOKANUERHMBTIYCWLQPZXVGJD |  | Kriegsmarine M4, fourth rotor, didn't rotate, used with thin reflectors |

The array expects 3 items (to simulate the Wehrmacht Enigma I or Kriegsmarine M3) or 4 items (for the Kriegsmarine M4). If the Enigma Machine is initialized with four rotors, it is assumed the left-most rotor is a Beta/Gamma rotor in an M4. Therefore the left-most rotor will not rotate.

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

### EnigmaMachine.encodeString()

#### Syntax

```
enigmaMachine.encodeString(text)
```

#### Output

Returns a string which is the encoding/decoding of `text`.

#### Parameters

**text** The text to encode/decode. The text is required to only contain uppercase letters from the latin alphabet.

## Learn More

A good introduction to the Enigma Machine is this [Numberphile video](https://www.youtube.com/watch?v=G2_Q9FoD-oQ). You can find out more about the details of the inner workings of the machine on [Dirk Rijmenants' website](http://users.telenet.be/d.rijmenants/en/enigmatech.htm). One of the more complex quirks of the Enigma Machine's mechanism is the "double step". You can see this in action in [this video](https://www.youtube.com/watch?v=hcVhQeZ5gI4).
