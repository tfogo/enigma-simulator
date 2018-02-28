const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Rotor = require('./rotor');
const reflectorTypes = require('./reflectorTypes');

function alphaToNum(c) {
  return c.charCodeAt(0) - 65;
}

class EnigmaMachine {
  constructor(rotors = ['III','II','I'], positions = [0,0,0], ringSettings = [0,0,0], reflector = 'B', plugboardPairs = '') {
    this.plugboard = this.generatePlugboard(plugboardPairs);
    this.rotors = [];
    rotors.reverse().forEach((r, i) => {
      this.rotors.push(new Rotor(r, ringSettings.reverse()[i], positions.reverse()[i]));
    });
    this.reflector = reflectorTypes[reflector];
  }

  generatePlugboard(pairs) {
    var pb = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pairs === '') {
      return pb;
    }
    pairs.split(' ').forEach((p) => {
      pb = pb.slice(0, alphaToNum(p[0])) + p[1] + pb.slice(alphaToNum(p[0]) + 1);
      pb = pb.slice(0, alphaToNum(p[1])) + p[0] + pb.slice(alphaToNum(p[1]) + 1);
    })
    return pb;
  }

  encodeChar(c) {
    // c to output of plugboard
    // This is the position the signal goes through the first rotor
    let nextInput = this.plugboard.indexOf(c)

    // through each rotor
    for (let i = 0; i < this.rotors.length; i++) {
      let outputChar = this.rotors[i].encoding[nextInput];
      //console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // reflected
    let outputChar = this.reflector[nextInput];
    //console.log(outputChar);
    nextInput = ALPHABET.indexOf(outputChar);

    // through each rotor again
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      let outputChar = this.rotors[i].decoding[nextInput];
      //console.log(outputChar);
      nextInput = this.rotors[i].alpha.indexOf(outputChar);
    }

    // mrpjevans: Final pass through the plugboard
    nextInput = this.plugboard.indexOf(ALPHABET[nextInput]);

    // output
    //console.log(ALPHABET[nextInput] + '/n');
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
    // NB: The fourth rotor on the M4 didn't move
    if (this.rotors[1].turnover.includes(this.rotors[1].ring[0])) {
      // if the second rotor is at the turnover position, it turns itself and the third rotor
      // This is the source of the "double step" of the middle rotor
      this.rotors[2].cycle(1);
      this.rotors[1].cycle(1);

      // the first rotor always turns
      this.rotors[0].cycle(1);
    } else if (this.rotors[0].turnover.includes(this.rotors[0].ring[0])) {
      // If the first rotor is at the turnover position, it turns the second rotor too
      this.rotors[1].cycle(1);
      this.rotors[0].cycle(1);
    } else {
      // The first rotor always turns
      this.rotors[0].cycle(1);
    }
  }

  setPosition(positions) {
  }
}

module.exports = EnigmaMachine;
