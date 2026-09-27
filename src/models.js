'use strict';

const source = {
  id: 'crypto-museum-wiring',
  title: 'Crypto Museum: Enigma wiring',
  url: 'https://www.cryptomuseum.com/crypto/enigma/wiring.htm',
};
const militaryRotors = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const profiles = [
  {
    id: 'EnigmaI', name: 'Enigma I',
    movingRotors: militaryRotors.slice(0, 5), greekRotors: [], reflectors: ['A', 'B', 'C'],
    defaultRotors: ['III', 'II', 'I'], defaultReflector: 'B',
    entryWheel: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', stepping: 'military-pawls',
    notes: 'Army/Air Force component family. Reflector A is an earlier option. This profile does not imply every component was available in every year.',
    sources: [{ ...source, locator: 'Enigma I / Service Enigma' }],
  },
  {
    id: 'M3', name: 'Naval Enigma M3',
    movingRotors: militaryRotors, greekRotors: [], reflectors: ['B', 'C'],
    defaultRotors: ['III', 'II', 'I'], defaultReflector: 'B',
    entryWheel: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', stepping: 'military-pawls',
    notes: 'Three moving naval rotors. Date- and network-specific operating rules are outside this component profile.',
    sources: [{ ...source, locator: 'Enigma M3' }],
  },
  {
    id: 'M4', name: 'Naval Enigma M4',
    movingRotors: militaryRotors, greekRotors: ['Beta', 'Gamma'], reflectors: ['BThin', 'CThin'],
    defaultRotors: ['Beta', 'III', 'II', 'I'], defaultReflector: 'BThin',
    entryWheel: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', stepping: 'military-pawls',
    notes: 'Leftmost Greek rotor is stationary during keypresses. Crossed Greek/reflector combinations are allowed but are not M3-compatible.',
    sources: [{ ...source, locator: 'Enigma M4' }],
  },
];

// Return detached data; callers cannot change validation rules through the catalogue.
function getModelProfiles() {
  return JSON.parse(JSON.stringify(profiles));
}

function objectFields(value, allowed, label, required = []) {
  if (value === null || typeof value !== 'object' || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) {
    throw new TypeError(`${label} must be a plain object`);
  }
  for (const key of Reflect.ownKeys(value)) {
    if (!allowed.includes(key)) throw new TypeError(`Unknown ${label} field: ${String(key)}`);
  }
  for (const key of required) {
    if (!Object.hasOwn(value, key) || value[key] === undefined) {
      throw new TypeError(`Missing ${label} field: ${key}`);
    }
  }
}

const configFields = ['model', 'rotors', 'positions', 'ringSettings', 'reflector', 'plugboardPairs'];

function resolveConfiguration(options) {
  objectFields(options, configFields, 'configuration');
  const model = options.model === undefined ? 'M3' : options.model;
  const profile = profiles.find(p => p.id === model);
  if (!profile) throw new RangeError(`Unknown model: ${String(model)}`);
  const rotors = options.rotors === undefined ? profile.defaultRotors : options.rotors;
  if (!Array.isArray(rotors) || rotors.length !== profile.defaultRotors.length) {
    throw new RangeError(`${model} requires ${profile.defaultRotors.length} rotors`);
  }
  for (let slot = 0; slot < rotors.length; slot++) {
    const allowed = model === 'M4' && slot === 0 ? profile.greekRotors : profile.movingRotors;
    if (!allowed.includes(rotors[slot])) {
      throw new RangeError(`Rotor ${String(rotors[slot])} is not allowed in ${model} slot ${slot}`);
    }
  }
  const reflector = options.reflector === undefined ? profile.defaultReflector : options.reflector;
  if (!profile.reflectors.includes(reflector)) {
    throw new RangeError(`Reflector ${String(reflector)} is not allowed in ${model}`);
  }
  return { ...options, model, rotors: [...rotors], reflector };
}

module.exports = { getModelProfiles, resolveConfiguration, objectFields, configFields };
