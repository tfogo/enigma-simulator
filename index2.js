var alphaToNum = function(string) {
  var arr = []
  for (var i = 0; i < string.length; i++) {
    arr.push(string[i].charCodeAt(0) - 65);
  }
  return arr;
};

var numToAlpha = function(arr) {
  var string = "";
  for (var i = 0; i < arr.length; i++) {
    string += String.fromCharCode(arr[i] + 65)
  }
  return string;
};

function Enigma(rotors) {
  this.rotors = rotors;
  this.reflector = alphaToNum("YRUHQSLDPXNGOKMIEBFZCWVJAT");
  this.turnover = function() {
    if (this.rotors[1].position === this.rotors[1].turnover) {
      console.log("turn1");
      rotors[0].cycle();
      rotors[1].cycle();
      rotors[2].cycle();
    } else if (this.rotors[0].position === this.rotors[0].turnover) {
      console.log("turn2");
      rotors[0].cycle();
      rotors[1].cycle();
    } else {
      console.log("turn3");
      rotors[0].cycle();
    }
  }
  this.encode = function(inputs) {
    var result = []
    var self = this;
    inputs.forEach(function(input) {
      self.turnover();
      rotors.forEach(function(r) {
        console.log("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        console.log(numToAlpha(r.ring));
        console.log("input[0]: " + input[0])
        input = r.encode(input);
        console.log("output: " + numToAlpha(input))
      })


      console.log("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      console.log(numToAlpha(self.reflector));
      input = [self.reflector[input[0]]];
      console.log(numToAlpha(input))

      rotors.reverse();
      rotors.forEach(function(r) {
        console.log("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        console.log(numToAlpha(r.ring));
        console.log("input[0]: " + input[0])
        input = r.decode(input[0]);
        console.log("output: " + numToAlpha(input))
      })
      rotors.reverse();

      console.log("----------");
      result.push(input[0])
    })
    return result

  }
}

function Rotor(encoding, turnover, position) {
  this.ring = alphaToNum(encoding);
  this.position = 0;
  this.turnover = alphaToNum(turnover)[0];
  this.encode = function(c) {
    // input is at the c position
    // output of the ring is this.ring[c]
    // which is at this.ring[c] + this.position (mod 26)
    console.log("this.ring[c]: " + this.ring[c]);
    console.log("this.position: " + this.position);
    console.log("encode output: " + [(26 + this.ring[c] - this.position)%26]);
    return [(26 + this.ring[c] - this.position)%26];
  };
  this.decode = function(c) {
    return [(26 + this.ring.indexOf(c + this.position))%26];
  };
  this.cycle = function() {
    this.ring.push(this.ring.shift());
    this.position = (this.position+1)%26;
    console.log(this.position);
  }

  for (var i = 0; i < position; i++) {
    this.cycle();
  }
}

var r1 = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 25);
var r2 = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E", 0);
var r3 = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V", 0);

rotors = [r1, r2, r3];

var e = new Enigma(rotors);

var input = alphaToNum("HELLOHELLOHELLO");
console.log(numToAlpha(e.encode(input)));
