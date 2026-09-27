const assert = require('node:assert/strict');
const enigma = require('..');
const Rotor = require('../src/rotor');
const vectors = require('./fixtures/reference-vectors.json');

function windows(machine) {
  return machine.rotors.map(rotor => rotor.ring[0]).reverse().join('');
}

describe('Engine foundation regressions', () => {
  it('preserves the custom-settings README example (its old IRD comment was stale)', () => {
    assert.equal(enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AS TH LR').encodeString('ABC'), 'IGT');
  });

  it('copies frozen caller arrays and preserves asymmetric M4 settings', () => {
    const rotors = Object.freeze(['Gamma', 'III', 'II', 'I']);
    const positions = Object.freeze([1, 2, 3, 4]);
    const rings = Object.freeze([5, 6, 7, 8]);
    const machine = enigma(rotors, positions, rings, 'BThin');
    assert.equal(windows(machine), 'BCDE');
    assert.deepEqual(machine.rotors.map(r => r.ringSetting).reverse(), rings);
  });

  it('defaults omitted M4 positions and rings to four zeroes', () => {
    const machine = enigma(['Beta', 'I', 'II', 'III'], undefined, undefined, 'BThin');
    assert.equal(windows(machine), 'AAAA');
    assert.deepEqual(machine.rotors.map(r => r.ringSetting), [0, 0, 0, 0]);
  });

  it('sets positions absolutely after use and resets to constructor windows', () => {
    const machine = enigma(['III', 'II', 'I'], [1, 2, 3], [4, 5, 6]);
    const ciphertext = machine.encodeString('HELLOWORLD');
    machine.setPosition([0, 0, 0]);
    machine.setPosition([0, 0, 0]);
    assert.equal(windows(machine), 'AAA');
    machine.reset();
    assert.equal(windows(machine), 'BCD');
    assert.equal(machine.encodeString(ciphertext), 'HELLOWORLD');
  });

  it('sets rotor windows absolutely and preserves the window when changing rings', () => {
    const rotor = new Rotor('I', 7, 20);
    rotor.cycle(9);
    rotor.setPosition(1);
    rotor.setPosition(1);
    assert.equal(rotor.position, 1);
    assert.equal(rotor.ring[0], 'B');
    rotor.setRingSetting(4);
    assert.equal(rotor.ringSetting, 4);
    assert.equal(rotor.ring[0], 'B');
    assert.equal(rotor.encoding, new Rotor('I', 4, 1).encoding);
    rotor.cycle(-54);
    assert.equal(rotor.position, 25);
    rotor.cycle(53);
    assert.equal(rotor.position, 0);
  });

  for (const text of ['HELLO WORLD', 'ABCd', 'AB1', 'AB\n', 'Ä', null, 42, ['A']]) {
    it(`rejects invalid text atomically: ${JSON.stringify(text)}`, () => {
      const machine = enigma();
      const before = JSON.stringify(machine);
      assert.throws(() => machine.encodeString(text), /text/i);
      assert.equal(JSON.stringify(machine), before);
    });
  }

  it('keeps encodeChar non-stepping and provides a stepping keypress', () => {
    const machine = enigma();
    assert.equal(machine.encodeChar('A'), 'N');
    assert.equal(windows(machine), 'AAA');
    assert.equal(machine.pressKey('A'), enigma().encodeString('A'));
    assert.equal(windows(machine), 'AAB');
    for (const value of ['', 'AB', 'a', 'A\n', 'A\r', null]) {
      assert.throws(() => machine.encodeChar(value), /character/i);
      assert.throws(() => machine.pressKey(value), /character/i);
      assert.equal(windows(machine), 'AAB');
    }
  });

  for (const pairs of ['AB AC', 'AA', 'AB BA', 'A', 'ABC', 'ab', 'AB C1', null]) {
    it(`rejects invalid plugboard: ${JSON.stringify(pairs)}`, () => {
      assert.throws(() => enigma(undefined, undefined, undefined, undefined, pairs), /plugboard/i);
    });
  }

  it('accepts whitespace between disjoint plugs, including all 13 pairs', () => {
    const pairs = ' AB\tCD EF GH IJ KL MN OP QR ST UV WX YZ ';
    const machine = enigma(undefined, undefined, undefined, undefined, pairs);
    assert.equal(new Set(machine.plugboard).size, 26);
    const ciphertext = machine.encodeString('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    machine.reset();
    assert.equal(machine.encodeString(ciphertext), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  });

  it('rejects invalid configurations with useful errors', () => {
    for (const rotors of [[], ['I', 'II'], ['I', 'II', 'bogus'], ['I', 'I', 'II'], ['I', 'II', 'toString'], ['Beta', 'II', 'III'], ['I', 'II', 'III', 'IV'], ['Beta', 'Gamma', 'I', 'II']]) {
      assert.throws(() => enigma(rotors), /rotor/i);
    }
    for (const reflector of ['bogus', 'toString', 'BThin', null]) {
      assert.throws(() => enigma(undefined, undefined, undefined, reflector), /reflector/i);
    }
    assert.throws(() => enigma(['Beta', 'I', 'II', 'III'], undefined, undefined, 'B'), /reflector/i);
    for (const values of [[0, 0], [0, 0, 26], [0, -1, 0], [0, 1.5, 0], [0, NaN, 0], [0, '1', 0], new Array(3), null]) {
      assert.throws(() => enigma(undefined, values), /positions/i);
      assert.throws(() => enigma(undefined, undefined, values), /ringSettings/i);
      const machine = enigma();
      assert.throws(() => machine.setPosition(values), /positions/i);
      assert.equal(windows(machine), 'AAA');
    }
  });

  it('matches the sourced consecutive double-step sequence with nonzero rings', () => {
    const machine = enigma(['III', 'II', 'I'], [0, 3, 14], [7, 11, 19]);
    const actual = [windows(machine)];
    for (let i = 0; i < 6; i++) {
      machine.cycleRotors();
      actual.push(windows(machine));
    }
    assert.deepEqual(actual, ['ADO', 'ADP', 'ADQ', 'AER', 'BFS', 'BFT', 'BFU']);
  });

  it('steps once when both the fast and middle rotors are at a notch', () => {
    const machine = enigma(['III', 'II', 'I'], [0, 4, 16]);
    machine.cycleRotors();
    assert.equal(windows(machine), 'BFR');
  });

  for (const rotor of ['VI', 'VII', 'VIII']) {
    for (const position of [12, 25]) {
      it(`turns over ${rotor} at ${position} independently of ring setting`, () => {
        const machine = enigma(['III', 'II', rotor], [0, 0, position], [3, 5, 7]);
        machine.cycleRotors();
        assert.equal(windows(machine), position === 12 ? 'ABN' : 'ABA');
      });
    }
  }

  it('keeps the Greek rotor stationary and agrees for chunked input', () => {
    const create = () => enigma(['Gamma', 'VIII', 'VI', 'VII'], [17, 23, 12, 25], [4, 8, 10, 20], 'CThin', 'AZ BY');
    const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(100);
    const whole = create();
    const chunked = create();
    assert.equal(whole.encodeString(text), chunked.encodeString(text.slice(0, 111)) + chunked.encodeString(text.slice(111)));
    assert.equal(windows(whole)[0], 'R');
    assert.equal(windows(whole), windows(chunked));
  });

  for (const [greek, thick, thin] of [['Beta', 'B', 'BThin'], ['Gamma', 'C', 'CThin']]) {
    it(`reproduces M3 with ${greek} and ${thin} at the reference setting`, () => {
      const m3 = enigma(['VIII', 'VI', 'II'], [2, 12, 4], [15, 10, 7], thick, 'AB CD EF');
      const m4 = enigma([greek, 'VIII', 'VI', 'II'], [0, 2, 12, 4], [0, 15, 10, 7], thin, 'AB CD EF');
      const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(20);
      assert.equal(m4.encodeString(text), m3.encodeString(text));
    });
  }

  for (const vector of vectors) {
    it(`matches independent reference: ${vector.id}`, () => {
      const machine = enigma(vector.rotors, vector.positions, vector.ringSettings, vector.reflector, vector.plugboard);
      assert.equal(machine.encodeString(vector.plaintext), vector.ciphertext);
      machine.reset();
      assert.equal(machine.encodeString(vector.ciphertext), vector.plaintext);
    });
  }
});
