function alphaToNum(c) {
  return c.charCodeAt(0) - 65;
}

function numToAlpha(i) {
  return String.fromCharCode(i + 65);
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Rotor {
  constructor(encoding, turnover, ringSetting, position) {
    this.ring = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.encoding = encoding;
    this.decoding = "";
    for (var i = 0; i < ALPHA.length; i++) {
      this.decoding += numToAlpha(encoding.indexOf(ALPHA[i]))
    }
    this.turnover = turnover;
    this.ringSetting = ringSetting;
    this.position = position;
  }

  // TODO: Cycle ring to correct position
  // TODO: Take ring setting into account

  cycle() {
    this.ring = this.ring.slice(1) + this.ring.slice(0, 1);
    this.alpha = this.alpha.slice(1) + this.alpha.slice(0, 1);
    this.encoding = this.encoding.slice(1) + this.encoding.slice(0, 1);
    this.decoding = this.decoding.slice(1) + this.decoding.slice(0, 1);
    this.position++;
  }
}

class EnigmaMachine {
  constructor(plugboard, rotors, reflector) {
    this.plugboard = plugboard;
    this.rotors = rotors;
    this.reflector = reflector;
  }

  encodeChar(c) {
    // cycle machine

    // c to output of plugboard
    // This is the position the signal goes through the first rotor
    let nextInput = this.plugboard.indexOf(c)

    // through each rotor
    for (let i = 0; i < this.rotors.length; i++) {
      let outputChar = rotors[i].encoding[nextInput];
      console.log(outputChar);
      nextInput = rotors[i].alpha.indexOf(outputChar);
    }

    // reflected
    let outputChar = this.reflector[nextInput];
    console.log(outputChar);
    nextInput = ALPHA.indexOf(outputChar);

    // through each rotor again
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      let outputChar = rotors[i].decoding[nextInput];
      console.log(outputChar);
      nextInput = rotors[i].alpha.indexOf(outputChar);
    }

    // output
    return ALPHA[nextInput];

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
    if (this.rotors[1].alpha[0] === this.rotors[1].turnover) {
      // if the second rotor is at the turnover position, it turns itself and the third rotor
      // This is the source of the "double step" of the middle rotor
      this.rotors[1].cycle();
      this.rotors[2].cycle();

      // the first rotor always turns
      this.rotors[0].cycle();
    } else if (this.rotors[0].alpha[0] === this.rotors[0].turnover) {
      // If the first rotor is at the turnover position, it turns the second rotor too
      this.rotors[0].cycle(1);
      this.rotors[1].cycle(1);
    } else {
      // The first rotor always turns
      this.rotors[0].cycle(1);
    }
  }

}

var plugboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var rotorI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 0);
var rotorII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E", 0, 0);
var rotorIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V", 0, 0);

var rotors = [
  rotorI,
  rotorII,
  rotorIII
];

var reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

let em = new EnigmaMachine(plugboard, rotors, reflector);

console.log(em.encodeString('ABC'));
