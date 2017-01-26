# Enigma Simulator
An npm module for simulating an M3 Enigma Machine.

## Install
```
npm install enigma-simulator
```

## Usage
```js
var enigma = require('enigma-machine');

/* Creates an M3 with a B reflector and rotors III, II, I, 
 * with ring settings 0, 0, 0 in position 0, 0, 0. 
 * There are no plugboard substitutions.
 */
var em = enigma();
em.encodeString('ABC'); // 'FUV'

// Create an Enigma machine with your own settings
// rotors, positions, ringSettings, reflector, ...plugboardPairs
var em2 = enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AS', 'TH', 'LR');
em.encodeString('ABC'); // 'IRD'
```

- Available rotors: I, II, III, IV, V
- Available reflectors: B, C
