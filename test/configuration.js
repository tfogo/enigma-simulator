const assert = require('node:assert/strict');
const enigma = require('..');
const vectors = require('./fixtures/reference-vectors.json');

describe('Named configuration and snapshots', () => {
  it('retains the positional default and chooses model-specific named defaults', () => {
    assert.equal(enigma({}).encodeString('ABC'), enigma().encodeString('ABC'));
    assert.deepEqual(enigma({ model: 'EnigmaI' }).getConfiguration(), {
      model: 'EnigmaI', rotors: ['III', 'II', 'I'], positions: [0, 0, 0],
      ringSettings: [0, 0, 0], reflector: 'B', plugboardPairs: '',
    });
    assert.deepEqual(enigma({ model: 'M4' }).getConfiguration(), {
      model: 'M4', rotors: ['Beta', 'III', 'II', 'I'], positions: [0, 0, 0, 0],
      ringSettings: [0, 0, 0, 0], reflector: 'BThin', plugboardPairs: '',
    });
  });

  it('enforces model constraints and rejects typo or mixed configuration fields', () => {
    for (const config of [
      { model: 'unknown' }, { model: null }, { model: 'EnigmaI', rotors: ['VI', 'II', 'I'] },
      { model: 'M3', reflector: 'A' }, { model: 'M4', reflector: 'B' },
      { model: 'M4', rotors: ['I', 'II', 'III', 'IV'] }, { model: 'M3', rotors: ['I', 'I', 'II'] },
      { model: 'EnigmaI', position: [0, 0, 0] }, { [Symbol('extra')]: true },
    ]) assert.throws(() => enigma(config));
    assert.throws(() => enigma({ model: 'M4' }, [0, 0, 0, 0]), /mix/);
    assert.throws(() => enigma(['VI', 'II', 'I'], undefined, undefined, 'A'), /Reflector A/);
    assert.equal(enigma({ model: 'EnigmaI', reflector: 'A' }).getConfiguration().reflector, 'A');
  });

  it('returns detached model profiles with source locators and slot capabilities', () => {
    const profiles = enigma.getModelProfiles();
    assert.deepEqual(profiles.map(p => p.id), ['EnigmaI', 'M3', 'M4']);
    assert.deepEqual(profiles[0].reflectors, ['A', 'B', 'C']);
    assert.deepEqual(profiles[2].greekRotors, ['Beta', 'Gamma']);
    for (const profile of profiles) {
      assert.ok(profile.sources[0].url.startsWith('https://'));
      assert.ok(profile.sources[0].locator);
    }
    profiles[0].movingRotors.push('VI');
    profiles[0].sources[0].url = 'changed';
    assert.throws(() => enigma({ model: 'EnigmaI', rotors: ['VI', 'II', 'I'] }));
    assert.notEqual(enigma.getModelProfiles()[0].sources[0].url, 'changed');
  });

  it('distinguishes initial and current windows and returns detached copies', () => {
    const input = { model: 'M4', positions: [1, 2, 3, 4], ringSettings: [5, 6, 7, 8], plugboardPairs: 'ZA DC' };
    const machine = enigma(input);
    input.positions[0] = 25;
    input.ringSettings[0] = 25;
    machine.pressKey('A');
    const config = machine.getConfiguration();
    const state = machine.getState();
    assert.deepEqual(config.positions, [1, 2, 3, 4]);
    assert.deepEqual(config.ringSettings, [5, 6, 7, 8]);
    assert.equal(config.plugboardPairs, 'AZ CD');
    assert.deepEqual(state.positions, [1, 2, 3, 5]);
    config.positions[0] = 25;
    state.positions[0] = 25;
    assert.equal(machine.getState().positions[0], 1);
    machine.reset();
    assert.deepEqual(machine.getState().positions, [1, 2, 3, 4]);
  });

  for (const vector of vectors) {
    it(`round-trips and resumes ${vector.id} across JSON and independent clones`, () => {
      const options = { model: vector.rotors.length === 4 ? 'M4' : 'EnigmaI', rotors: vector.rotors,
        positions: vector.positions, ringSettings: vector.ringSettings, reflector: vector.reflector, plugboardPairs: vector.plugboard };
      const machine = enigma(options);
      const split = Math.floor(vector.plaintext.length / 2);
      assert.equal(machine.encodeString(vector.plaintext.slice(0, split)), vector.ciphertext.slice(0, split));
      const snapshot = machine.snapshot();
      const clone = machine.clone();
      for (const copy of [clone, enigma.fromSnapshot(snapshot), enigma.deserialize(machine.serialize())]) {
        assert.deepEqual(copy.snapshot(), snapshot);
        assert.equal(copy.encodeString(vector.plaintext.slice(split)), vector.ciphertext.slice(split));
        assert.deepEqual(machine.snapshot(), snapshot);
        copy.reset();
        assert.equal(copy.encodeString(vector.ciphertext), vector.plaintext);
      }
      machine.encodeString('ABC');
      machine.restore(snapshot);
      assert.equal(machine.encodeString(vector.plaintext.slice(split)), vector.ciphertext.slice(split));
    });
  }

  it('restores a different complete configuration without sharing state', () => {
    const target = enigma();
    const source = enigma({ model: 'M4', positions: [1, 2, 3, 4], reflector: 'CThin' });
    source.encodeString('ABC');
    const snapshot = source.snapshot();
    target.restore(snapshot);
    snapshot.configuration.positions[0] = 25;
    snapshot.state.positions[0] = 25;
    assert.deepEqual(target.snapshot(), source.snapshot());
  });

  it('rejects malformed snapshots atomically, including missing and unknown fields', () => {
    const machine = enigma({ model: 'M4' });
    machine.encodeString('ABC');
    const before = machine.serialize();
    const mutations = [
      s => { s.schemaVersion = 2; }, s => { s.schemaVersion = '1'; },
      s => { delete s.configuration.positions; }, s => { s.configuration.ringSettings = undefined; },
      s => { s.configuration.rotors = ['Beta', 'I', 'I', 'II']; },
      s => { s.configuration.plugboardPairs = 'AB AC'; }, s => { s.configuration.model = 'EnigmaI'; },
      s => { s.state.positions[2] = 26; }, s => { s.state.positions = [0]; },
      s => { s.state.positions = new Array(4); }, s => { delete s.state.positions; },
      s => { s.state.extra = true; }, s => { s.extra = true; },
    ];
    for (const mutate of mutations) {
      const snapshot = JSON.parse(before);
      mutate(snapshot);
      assert.throws(() => machine.restore(snapshot));
      assert.equal(machine.serialize(), before);
      assert.throws(() => enigma.fromSnapshot(snapshot));
    }
    for (const invalid of [null, [], {}, 'text', new Date()]) {
      assert.throws(() => machine.restore(invalid));
      assert.equal(machine.serialize(), before);
    }
    for (const invalid of ['null', '{}', '[]', '{', '{"__proto__":{}}', 42]) {
      assert.throws(() => enigma.deserialize(invalid));
    }
  });
});
