var alphaToNum = function(c) {
  return c.charCodeAt(0) - 65;
};

var numToAlpha = function(i) {
  return String.fromCharCode(i + 65);
};

function Rotor(encoding, turnover, ringSetting, position) {
  this.alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  this.encoding = encoding;
  this.decoding = "";
  for (var i = 0; i < this.alpha.length; i++) {
    this.decoding += numToAlpha(encoding.indexOf(this.alpha[i]))
  }
  this.turnover = turnover;
  this.ringSetting = ringSetting;
  this.position = position;

  this.cycle(position);
}

Rotor.prototype.cycle = function(cycles) {
  this.encoding = this.encoding.slice(cycles) + this.encoding.slice(0, cycles);
  this.decoding = this.decoding.slice(cycles) + this.decoding.slice(0, cycles);
  this.alpha = this.alpha.slice(cycles) + this.alpha.slice(0, cycles);
};

var plugboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var rotor1 = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 14);
var rotor2 = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E", 0, 4);
var rotor3 = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V", 0, 0);

var reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

var setup = {
  plugboard: plugboard,
  rotors: [
    rotor1,
    rotor2,
    rotor3
  ],
  reflector: reflector
};

console.log(setup);

var plaintext = "GKODTBZDQR";

var cycle = function(rotors) {
  if (rotors[1].alpha[0] === rotors[1].turnover) {
    rotors[0].cycle(1);
    rotors[1].cycle(1);
    rotors[2].cycle(1);
  } else if (rotors[0].alpha[0] === rotors[0].turnover) {
    rotors[0].cycle(1);
    rotors[1].cycle(1);
  } else {
    rotors[0].cycle(1);
  }
}

var passForward = function(c, rotor) {
  if (rotor === 0) {
    return setup.rotors[rotor].encoding[setup.plugboard.indexOf(c)];
  } else {
    return setup.rotors[rotor].encoding[setup.rotors[rotor - 1].alpha.indexOf(c)];
  }
};

var reflect = function(c) {
  return setup.reflector[setup.rotors[2].alpha.indexOf(c)];
}

var passBackward = function(c, rotor) {
  if (rotor === 2) {
    return setup.rotors[rotor].decoding[alphaToNum(c)];
  } else {
    return setup.rotors[rotor].decoding[setup.rotors[rotor + 1].alpha.indexOf(c)];
  }
};

var backPlugboard = function(c) {
  return setup.plugboard[setup.rotors[0].alpha.indexOf(c)];
};

var fullpass = function(c) {
  
  for (var i = 0; i < 3; i++) {
    c = passForward(c, i);
    console.log(c);
  }

  c = reflect(c);
  console.log(c);
  
  for (var i = 2; i >= 0; i--) {
    c = passBackward(c, i);
    console.log(c);
  }

  c =backPlugboard(c);
  console.log(c);
  
  return c;
};

var encryptString = function(str) {
  var ciphertext = "";
  
  for (var i = 0; i < str.length; i++) {
    cycle(setup.rotors);
    console.log("\n");
    ciphertext += fullpass(str[i]);
  }

  return ciphertext;
}

console.log(encryptString(plaintext));
