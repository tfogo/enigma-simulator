'use strict';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Rotor = require('./rotor');
const rotorTypes = require('./rotorTypes');
const reflectorTypes = require('./reflectorTypes');
const { settings, character } = require('./validation');
const { resolveConfiguration, objectFields, configFields } = require('./models');
const GREEK_ROTORS = ['Beta', 'Gamma'];

class EnigmaMachine {
  constructor(rotors = ['III', 'II', 'I'], positions, ringSettings, reflector = 'B', plugboardPairs = '') {
    if (!Array.isArray(rotors) || ![3, 4].includes(rotors.length)) {
      throw new TypeError('rotors must contain three moving rotors, or a Greek rotor followed by three moving rotors');
    }
    for (let i = 0; i < rotors.length; i++) {
      const name = rotors[i];
      if (typeof name !== 'string' || !Object.hasOwn(rotorTypes, name)) {
        throw new TypeError(`Unknown rotor type at slot ${i}: ${String(name)}`);
      }
      const requiresGreek = rotors.length === 4 && i === 0;
      if (GREEK_ROTORS.includes(name) !== requiresGreek) {
        throw new RangeError('A Greek rotor belongs only in the leftmost slot of a four-rotor machine');
      }
    }
    if (new Set(rotors).size !== rotors.length) {
      throw new RangeError('rotors must not contain duplicates');
    }
    if (typeof reflector !== 'string' || !Object.hasOwn(reflectorTypes, reflector)) {
      throw new TypeError(`Unknown reflector: ${String(reflector)}`);
    }
    if (reflector.endsWith('Thin') !== (rotors.length === 4)) {
      throw new RangeError('Use a thin reflector with four rotors and a thick reflector with three rotors');
    }
    if (reflector === 'A' && rotors.some(name => !['I', 'II', 'III', 'IV', 'V'].includes(name))) {
      throw new RangeError('Reflector A requires the Enigma I rotor family I-V');
    }
    if (positions === undefined) positions = Array(rotors.length).fill(0);
    if (ringSettings === undefined) ringSettings = Array(rotors.length).fill(0);
    settings(positions, rotors.length, 'positions');
    settings(ringSettings, rotors.length, 'ringSettings');

    this.plugboard = this.generatePlugboard(plugboardPairs);
    // Preserve the existing internal fast-to-slow array order.
    this.rotors = rotors.map((name, i) => new Rotor(name, ringSettings[i], positions[i])).reverse();
    this.reflector = reflectorTypes[reflector];
    this.reflectorType = reflector;
    this.model = rotors.length === 4 ? 'M4' : reflector === 'A' ? 'EnigmaI' : 'M3';
    this.initialPositions = Object.freeze([...positions]);
  }

  static fromConfiguration(options) {
    const config = resolveConfiguration(options);
    const machine = new EnigmaMachine(config.rotors, config.positions, config.ringSettings, config.reflector, config.plugboardPairs);
    machine.model = config.model;
    return machine;
  }

  static fromSnapshot(snapshot) {
    objectFields(snapshot, ['schemaVersion', 'configuration', 'state'], 'snapshot', ['schemaVersion', 'configuration', 'state']);
    if (snapshot.schemaVersion !== 1) throw new RangeError('Unsupported snapshot schemaVersion');
    objectFields(snapshot.configuration, configFields, 'configuration', configFields);
    objectFields(snapshot.state, ['positions'], 'state', ['positions']);
    const machine = EnigmaMachine.fromConfiguration(snapshot.configuration);
    machine.setPosition(snapshot.state.positions);
    return machine;
  }

  static deserialize(json) {
    if (typeof json !== 'string') throw new TypeError('Serialized snapshot must be a JSON string');
    return EnigmaMachine.fromSnapshot(JSON.parse(json));
  }

  getConfiguration() {
    const pairs = [];
    for (let i = 0; i < 26; i++) {
      if (this.plugboard[i] > ALPHABET[i]) pairs.push(ALPHABET[i] + this.plugboard[i]);
    }
    return {
      model: this.model,
      rotors: this.rotors.map(r => r.rotorType).reverse(),
      positions: [...this.initialPositions],
      ringSettings: this.rotors.map(r => r.ringSetting).reverse(),
      reflector: this.reflectorType,
      plugboardPairs: pairs.join(' '),
    };
  }

  getState() {
    return { positions: this.rotors.map(r => r.position).reverse() };
  }

  snapshot() {
    return { schemaVersion: 1, configuration: this.getConfiguration(), state: this.getState() };
  }

  serialize() {
    return JSON.stringify(this.snapshot());
  }

  restore(snapshot) {
    // Build and validate a complete replacement before touching the live machine.
    const restored = EnigmaMachine.fromSnapshot(snapshot);
    Object.assign(this, restored);
  }

  clone() {
    return EnigmaMachine.fromSnapshot(this.snapshot());
  }

  generatePlugboard(pairs) {
    if (typeof pairs !== 'string') throw new TypeError('plugboard pairs must be a string');
    const plugs = pairs.trim() === '' ? [] : pairs.trim().split(/\s+/);
    const used = new Set();
    const mapping = [...ALPHABET];
    for (const pair of plugs) {
      if (!/^[A-Z]{2}$/.test(pair) || pair[0] === pair[1]) {
        throw new TypeError('Each plugboard pair must contain two distinct uppercase letters A-Z');
      }
      if (used.has(pair[0]) || used.has(pair[1])) {
        throw new RangeError('Each plugboard letter can be connected only once');
      }
      used.add(pair[0]);
      used.add(pair[1]);
      mapping[ALPHABET.indexOf(pair[0])] = pair[1];
      mapping[ALPHABET.indexOf(pair[1])] = pair[0];
    }
    return mapping.join('');
  }

  // Inspection at the current state: intentionally does NOT step (legacy API).
  encodeChar(c) {
    character(c);
    let contact = ALPHABET.indexOf(this.plugboard[ALPHABET.indexOf(c)]);
    for (const rotor of this.rotors) contact = rotor.forward(contact);
    contact = ALPHABET.indexOf(this.reflector[contact]);
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      contact = this.rotors[i].backward(contact);
    }
    return this.plugboard[contact];
  }

  pressKey(c) {
    character(c);
    this.cycleRotors();
    return this.encodeChar(c);
  }

  encodeString(text) {
    if (typeof text !== 'string' || /[^A-Z]/.test(text)) {
      throw new TypeError('text must contain only uppercase letters A-Z');
    }
    let result = '';
    for (const c of text) result += this.pressKey(c);
    return result;
  }

  cycleRotors() {
    const [fast, middle, slow] = this.rotors;
    // Decide from pre-step windows. Ring offsets do not move these notches.
    const middleAtNotch = middle.atNotch();
    const fastAtNotch = fast.atNotch();
    if (middleAtNotch) slow.cycle();
    if (middleAtNotch || fastAtNotch) middle.cycle();
    fast.cycle();
  }

  setPosition(positions) {
    settings(positions, this.rotors.length, 'positions');
    positions.forEach((position, i) => {
      this.rotors[this.rotors.length - 1 - i].setPosition(position);
    });
  }

  reset() {
    this.setPosition(this.initialPositions);
  }
}

module.exports = EnigmaMachine;
