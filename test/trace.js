const assert = require('node:assert/strict');
const enigma = require('..');
const rotorTypes = require('../src/rotorTypes');
const vectors = require('./fixtures/reference-vectors.json');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

describe('Signal and stepping traces', () => {
  it('explains a default A keypress with the known circuit and post-step wiring', () => {
    const machine = enigma();
    const trace = machine.pressKeyWithTrace('A');
    assert.equal(trace.schemaVersion, 1);
    assert.equal(trace.stepped, true);
    assert.equal(trace.output, 'F');
    assert.deepEqual(trace.positionsBefore, [0, 0, 0]);
    assert.deepEqual(trace.positionsAfter, [0, 0, 1]);
    assert.deepEqual(trace.stages.map(s => s.componentId), [
      'plugboard', 'entry-wheel', 'rotor-2', 'rotor-1', 'rotor-0', 'reflector',
      'rotor-0', 'rotor-1', 'rotor-2', 'entry-wheel', 'plugboard',
    ]);
    assert.equal(trace.stages.map(s => s.outputLetter).join(''), 'AAJBDHDCFFF');
    assert.deepEqual(trace.stages[2], {
      kind: 'rotor', componentId: 'rotor-2', name: 'I', direction: 'forward',
      input: 0, output: 9, inputLetter: 'A', outputLetter: 'J', slot: 2,
      position: 1, ringSetting: 0, offset: 1, wiringInput: 1, wiringOutput: 10,
    });
    assert.deepEqual(trace.stepping.map(s => s.reasons), [['no-turnover'], ['no-turnover'], ['keypress']]);
    assert.deepEqual(machine.getState().positions, trace.positionsAfter);
  });

  it('inspects the same circuit without stepping or modifying state', () => {
    const machine = enigma();
    const before = machine.serialize();
    const trace = machine.traceChar('A');
    assert.equal(trace.output, 'N');
    assert.equal(trace.stepped, false);
    assert.deepEqual(trace.stepping, []);
    assert.deepEqual(trace.positionsBefore, trace.positionsAfter);
    assert.equal(machine.serialize(), before);
  });

  it('explains consecutive double steps and simultaneous notch causes', () => {
    const machine = enigma({ positions: [0, 3, 16], ringSettings: [2, 8, 19] });
    const first = machine.pressKeyWithTrace('A');
    assert.deepEqual(first.positionsAfter, [0, 4, 17]);
    assert.deepEqual(first.stepping[1].reasons, ['right-neighbor-at-notch']);
    const second = machine.pressKeyWithTrace('A');
    assert.deepEqual(second.positionsAfter, [1, 5, 18]);
    assert.deepEqual(second.stepping[0].reasons, ['right-neighbor-at-notch']);
    assert.deepEqual(second.stepping[1].reasons, ['at-notch']);
    assert.equal(second.stepping[1].atNotch, true);
    machine.setPosition([0, 4, 16]);
    const both = machine.pressKeyWithTrace('A');
    assert.deepEqual(both.stepping[1].reasons, ['right-neighbor-at-notch', 'at-notch']);
    assert.deepEqual(both.positionsAfter, [1, 5, 17]);
  });

  it('labels the stationary M4 rotor and wraps the fast rotor once', () => {
    const machine = enigma({ model: 'M4', positions: [7, 0, 0, 25] });
    const trace = machine.pressKeyWithTrace('A');
    assert.deepEqual(trace.stepping[0], {
      componentId: 'rotor-0', slot: 0, rotor: 'Beta', role: 'greek',
      before: 7, after: 7, atNotch: false, moved: false, reasons: ['stationary'],
    });
    assert.equal(trace.stepping[3].after, 0);
    assert.equal(trace.stages.length, 13);
  });

  for (const vector of vectors) {
    it(`traces every letter of ${vector.id}, using the actual cipher path`, () => {
      const machine = enigma(vector.rotors, vector.positions, vector.ringSettings, vector.reflector, vector.plugboard);
      const untraced = machine.clone();
      let ciphertext = '';
      for (const letter of vector.plaintext) {
        const before = machine.snapshot();
        const trace = machine.pressKeyWithTrace(letter);
        assert.equal(trace.output, untraced.pressKey(letter));
        assert.deepEqual(trace.positionsBefore, before.state.positions);
        assert.deepEqual(machine.snapshot(), untraced.snapshot());
        const replay = enigma.fromSnapshot(before).pressKeyWithTrace(letter);
        assert.deepEqual(replay, trace);
        let contact = alphabet.indexOf(letter);
        for (const stage of trace.stages) {
          assert.equal(stage.input, contact);
          assert.equal(stage.inputLetter, alphabet[stage.input]);
          assert.equal(stage.outputLetter, alphabet[stage.output]);
          assert.ok(stage.output >= 0 && stage.output < 26);
          if (stage.kind === 'rotor') {
            const wiring = rotorTypes[stage.name].encoding;
            assert.equal(stage.position, trace.positionsAfter[stage.slot]);
            assert.equal((stage.input + stage.offset) % 26, stage.wiringInput);
            assert.equal((stage.wiringOutput - stage.offset + 26) % 26, stage.output);
            if (stage.direction === 'forward') {
              assert.equal(wiring[stage.wiringInput], alphabet[stage.wiringOutput]);
            } else {
              assert.equal(wiring[stage.wiringOutput], alphabet[stage.wiringInput]);
            }
          }
          contact = stage.output;
        }
        assert.equal(alphabet[contact], trace.output);
        ciphertext += trace.output;
      }
      assert.equal(ciphertext, vector.ciphertext);
    });
  }

  it('returns detached serializable traces and rejects bad characters before stepping', () => {
    const machine = enigma({ model: 'M4' });
    const trace = machine.pressKeyWithTrace('A');
    const serialized = JSON.stringify(trace);
    assert.deepEqual(JSON.parse(serialized), trace);
    const snapshot = machine.serialize();
    trace.positionsAfter[0] = 25;
    trace.stepping[0].reasons.push('changed');
    trace.stages[0].output = 25;
    assert.equal(machine.serialize(), snapshot);
    for (const input of ['', 'AB', 'A\n', 'a', null, 1]) {
      assert.throws(() => machine.pressKeyWithTrace(input), /character/);
      assert.throws(() => machine.traceChar(input), /character/);
      assert.equal(machine.serialize(), snapshot);
    }
  });
});
