"use strict";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotorTypes = {
  I: {
    encoding: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    turnover: 'Q',
  },
  II: {
    encoding: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    turnover: 'E',
  },
  III: {
    encoding: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    turnover: 'V',
  },
  IV: {
    encoding: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    turnover: 'J'
  },
  V: {
    encoding: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    turnover: 'Z'
  }
}

const reflectorTypes = {
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'
}

function alphaToNum(c) {
  return c.charCodeAt(0) - 65;
}

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
    this.position = position;

    this.cycle(position - ringSetting);
  }

  cycle(n) {
    this.ring = this.ring.slice(n) + this.ring.slice(0, n);
    this.alpha = this.alpha.slice(n) + this.alpha.slice(0, n);
    this.encoding = this.encoding.slice(n) + this.encoding.slice(0, n);
    this.decoding = this.decoding.slice(n) + this.decoding.slice(0, n);
    this.position += n;
  }

  position(position) {
    this.cycle(position - this.ringSetting);
  }

  ringSetting(ringSetting) {
    this.ring = ALPHABET.slice(ringSetting) + ALPHABET.slice(0, ringSetting);
  }
}

class EnigmaMachine {
  constructor(rotors = ['III','II','I'], positions = [0,0,0], ringSettings = [0,0,0], reflector = 'B', plugboardPairs = []) {
    this.plugboard = this.generatePlugboard(plugboardPairs);
    this.rotors = [];
    rotors.forEach((r, i) => {
      this.rotors.push(new Rotor(r, ringSettings[i], positions[i]));
    });
    this.reflector = reflectorTypes[reflector];
  }

  generatePlugboard(pairs) {
    var pb = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    pairs.forEach((p) => {
      pb = pb.slice(0, alphaToNum(p[0])) + p[1] + pb.slice(alphaToNum(p[0]) + 1);
      pb = pb.slice(0, alphaToNum(p[1])) + p[0] + pb.slice(alphaToNum(p[1]) + 1);
    })
    return pb;
  }

  encodeChar(c) {
    // cycle machine

    // c to output of plugboard
    // This is the position the signal goes through the first rotor
    let nextInput = this.plugboard.indexOf(c)

    // through each rotor
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      let outputChar = this.rotors[i].encoding[nextInput];
      console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // reflected
    let outputChar = this.reflector[nextInput];
    console.log(outputChar);
    nextInput = ALPHABET.indexOf(outputChar);

    // through each rotor again
    for (let i = 0; i < this.rotors.length; i++) {
      let outputChar = this.rotors[i].decoding[nextInput];
      console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // output
    return ALPHABET[nextInput];

  }

  encodeString(s) {
    let result = '';
    for (var c of s) {
      this.cycleRotors();
      result += this.encodeChar(c);
    }
    return result;
  }

  cycleRotors() {
    // Assumes 3 rotors for now
    // TODO: Make it work for the M4 Naval Enigma Machine
    // NB: The fourth rotor on the M4 didn't move anyway?
    if (this.rotors[1].ring[2] === this.rotors[1].turnover) {
      // if the second rotor is at the turnover position, it turns itself and the third rotor
      // This is the source of the "double step" of the middle rotor
      this.rotors[1].cycle(1);
      this.rotors[2].cycle(1);

      // the first rotor always turns
      this.rotors[2].cycle(1);
    } else if (this.rotors[2].ring[2] === this.rotors[2].turnover) {
      // If the first rotor is at the turnover position, it turns the second rotor too
      this.rotors[2].cycle(1);
      this.rotors[1].cycle(1);
    } else {
      // The first rotor always turns
      this.rotors[2].cycle(1);
    }
  }

  setPosition(positions) {

  }

}

module.exports = (rotors, positions, ringSettings, reflector, ...plugboardPairs) => {
  return new EnigmaMachine(rotors, positions, ringSettings, reflector, plugboardPairs);
}
