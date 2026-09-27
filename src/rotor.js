'use strict';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rotorTypes = require('./rotorTypes');
const { setting } = require('./validation');
const mod26 = n => ((n % 26) + 26) % 26;
const rotate = (text, offset) => text.slice(offset) + text.slice(0, offset);

// Wiring never changes; only window position and ring offset change.
const wirings = Object.fromEntries(Object.entries(rotorTypes).map(([name, type]) => {
  const forward = Array.from(type.encoding, c => ALPHABET.indexOf(c));
  const reverse = Array(26);
  forward.forEach((output, input) => { reverse[output] = input; });
  return [name, Object.freeze({
    forward: Object.freeze(forward),
    reverse: Object.freeze(reverse),
    turnover: type.turnover,
  })];
}));
Object.freeze(wirings);

class Rotor {
  constructor(rotorType, ringSetting = 0, position = 0) {
    if (typeof rotorType !== 'string' || !Object.hasOwn(wirings, rotorType)) {
      throw new TypeError(`Unknown rotor type: ${String(rotorType)}`);
    }
    setting(ringSetting, 'ringSetting');
    setting(position, 'position');
    this.rotorType = rotorType;
    this.ringSetting = ringSetting;
    this.position = position;
  }

  get offset() { return mod26(this.position - this.ringSetting); }
  get turnover() { return wirings[this.rotorType].turnover; }
  get ring() { return rotate(ALPHABET, this.position); }
  get alpha() { return rotate(ALPHABET, this.offset); }

  // Read-only legacy inspection views, derived from normalized state.
  get encoding() {
    return rotate(wirings[this.rotorType].forward.map(n => ALPHABET[n]).join(''), this.offset);
  }

  get decoding() {
    return rotate(wirings[this.rotorType].reverse.map(n => ALPHABET[n]).join(''), this.offset);
  }

  forward(contact) {
    return mod26(wirings[this.rotorType].forward[mod26(contact + this.offset)] - this.offset);
  }

  backward(contact) {
    return mod26(wirings[this.rotorType].reverse[mod26(contact + this.offset)] - this.offset);
  }

  atNotch() {
    return this.turnover.includes(ALPHABET[this.position]);
  }

  cycle(n = 1) {
    if (!Number.isSafeInteger(n)) throw new TypeError('step count must be a safe integer');
    this.position = mod26(this.position + mod26(n));
  }

  setPosition(position) {
    setting(position, 'position');
    this.position = position;
  }

  setRingSetting(ringSetting) {
    setting(ringSetting, 'ringSetting');
    // Adjust wiring relative to the index ring without changing the window.
    this.ringSetting = ringSetting;
  }
}

module.exports = Rotor;
