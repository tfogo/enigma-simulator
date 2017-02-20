"use strict";

const EnigmaMachine = require('./src/enigmaMachine');

module.exports = (rotors, positions, ringSettings, reflector, plugboardPairs) => {
  return new EnigmaMachine(rotors, positions, ringSettings, reflector, plugboardPairs);
}
