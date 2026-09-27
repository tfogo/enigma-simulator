"use strict";

const EnigmaMachine = require('./src/enigmaMachine');
const { getModelProfiles } = require('./src/models');

function enigma(rotors, positions, ringSettings, reflector, plugboardPairs) {
  if (rotors !== null && typeof rotors === 'object' && !Array.isArray(rotors)) {
    if (arguments.length !== 1) throw new TypeError('Do not mix named configuration and positional arguments');
    return EnigmaMachine.fromConfiguration(rotors);
  }
  return new EnigmaMachine(rotors, positions, ringSettings, reflector, plugboardPairs);
}

enigma.fromSnapshot = snapshot => EnigmaMachine.fromSnapshot(snapshot);
enigma.deserialize = json => EnigmaMachine.deserialize(json);
enigma.getModelProfiles = getModelProfiles;

module.exports = enigma;
