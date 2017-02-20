const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotorTypes = require('./rotorTypes');


function numToAlpha(i) {
  return String.fromCharCode(i + 65);
}

class Rotor {
  constructor(rotorType, ringSetting, position) {
    this.ring = ALPHABET.slice(ringSetting) + ALPHABET.slice(0, ringSetting);

    this.alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.encoding = rotorTypes[rotorType].encoding;
    this.decoding = '';
    for (var i = 0; i < 26; i++) {
      this.decoding += numToAlpha(this.encoding.indexOf(ALPHABET[i]))
    }
    this.turnover = rotorTypes[rotorType].turnover;
    this.ringSetting = ringSetting;
    this.position = 0;

    this.cycle(position - ringSetting);
  }

  cycle(n) {
    this.ring = this.ring.slice(n) + this.ring.slice(0, n);
    this.alpha = this.alpha.slice(n) + this.alpha.slice(0, n);
    this.encoding = this.encoding.slice(n) + this.encoding.slice(0, n);
    this.decoding = this.decoding.slice(n) + this.decoding.slice(0, n);
    this.position += n;
  }

  setPosition(position) {
    this.cycle(position - this.ringSetting);
  }

  setRingSetting(ringSetting) {
    this.ring = ALPHABET.slice(ringSetting) + ALPHABET.slice(0, ringSetting);
  }
}

module.exports = Rotor;
