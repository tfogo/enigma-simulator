const assert = require('node:assert/strict');
const enigma = require('..');
const Rotor = require('../src/rotor');
const rotorTypes = require('../src/rotorTypes');
const reflectors = require('../src/reflectorTypes');

describe('Electrical and state invariants', () => {
  for (const name of Object.keys(rotorTypes)) {
    it(`${name}: forward and return wiring are inverse at every ring/window setting`, () => {
      const rotor = new Rotor(name);
      for (let ring = 0; ring < 26; ring++) {
        rotor.setRingSetting(ring);
        for (let position = 0; position < 26; position++) {
          rotor.setPosition(position);
          const outputs = [];
          for (let input = 0; input < 26; input++) {
            const output = rotor.forward(input);
            outputs.push(output);
            assert.equal(rotor.backward(output), input);
          }
          assert.equal(new Set(outputs).size, 26);
        }
      }
    });
  }

  for (const [name, wiring] of Object.entries(reflectors)) {
    it(`${name}: reflector contacts form 13 disjoint pairs`, () => {
      assert.match(wiring, /^[A-Z]{26}$/);
      assert.equal(new Set(wiring).size, 26);
      for (let input = 0; input < 26; input++) {
        const output = wiring.charCodeAt(input) - 65;
        assert.notEqual(output, input);
        assert.equal(wiring.charCodeAt(output) - 65, input);
      }
    });

    it(`${name}: the complete fixed-state mapping is reciprocal and has no self letters`, () => {
      const thin = name.endsWith('Thin');
      const machine = enigma(
        thin ? ['Gamma', 'V', 'VIII', 'VI'] : ['V', 'VIII', 'VI'],
        thin ? [9, 1, 12, 25] : [1, 12, 25],
        thin ? [5, 20, 2, 19] : [20, 2, 19],
        name, 'AZ BV CU DT ES FR GQ HP IO JN'
      );
      for (let state = 0; state < 100; state++) {
        machine.cycleRotors();
        for (const input of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
          const output = machine.encodeChar(input);
          assert.notEqual(output, input);
          assert.equal(machine.encodeChar(output), input);
        }
      }
    });
  }

  it('returns the three single-notch rotor windows to AAA after 16900 keypresses', () => {
    const machine = enigma();
    const seen = new Set();
    for (let step = 0; step < 16900; step++) {
      const windows = machine.rotors.map(rotor => rotor.position).join(',');
      assert.equal(seen.has(windows), false);
      seen.add(windows);
      machine.cycleRotors();
    }
    assert.deepEqual(machine.rotors.map(rotor => rotor.position), [0, 0, 0]);
  });

  it('leaves empty input and rejected rotor operations unchanged', () => {
    const machine = enigma();
    assert.equal(machine.encodeString(''), '');
    assert.deepEqual(machine.rotors.map(rotor => rotor.position), [0, 0, 0]);
    const rotor = new Rotor('I', 7, 12);
    const before = JSON.stringify(rotor);
    for (const invalid of [-1, 26, 0.5, NaN, Infinity, '2', null]) {
      assert.throws(() => rotor.setPosition(invalid), /position/);
      assert.throws(() => rotor.setRingSetting(invalid), /ringSetting/);
      assert.throws(() => new Rotor('I', 0, invalid), /position/);
      assert.throws(() => new Rotor('I', invalid, 0), /ringSetting/);
    }
    for (const invalid of [0.5, NaN, Infinity, '2', Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => rotor.cycle(invalid), /step count/);
    }
    assert.throws(() => new Rotor('toString'), /rotor/);
    assert.equal(JSON.stringify(rotor), before);
  });
});
