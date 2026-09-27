const assert = require('assert');
const Rotor = require('../src/rotor.js');

describe('Rotor', () => {
  describe('#cycle()', () => {
    let rotor = new Rotor('I', 0, 0);
    rotor.cycle(1);
    it('should rotate the ring 1 position', () => {
      assert.equal('BCDEFGHIJKLMNOPQRSTUVWXYZA', rotor.ring);
    });
    it('should rotate the alphabet 1 position', () => {
      assert.equal('BCDEFGHIJKLMNOPQRSTUVWXYZA', rotor.alpha);
    });
    it('should rotate the encoding 1 position', () => {
      assert.equal('KMFLGDQVZNTOWYHXUSPAIBRCJE', rotor.encoding);
    });
    it('should rotate the decoding 1 position', () => {
      assert.equal('WYGADFPVZBECKMTHXSLRINQOJU', rotor.decoding);
    });
    it('should increment the position', () => {
      assert.equal(1, rotor.position);
    });
  });

  describe('#setRingSetting()', () => {
    let rotor = new Rotor('I', 0, 0);
    rotor.setRingSetting(1);
    it('should change the wiring offset while preserving the window', () => {
      assert.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZ', rotor.ring);
      assert.equal(1, rotor.ringSetting);
      assert.equal('ZABCDEFGHIJKLMNOPQRSTUVWXY', rotor.alpha);
    });
  });

  describe('#setPosition()', () => {
    let rotor = new Rotor('I', 0, 0);
    rotor.setPosition(1);
    it('should rotate the ring 1 position', () => {
      assert.equal('BCDEFGHIJKLMNOPQRSTUVWXYZA', rotor.ring);
    });
    it('should rotate the alphabet 1 position', () => {
      assert.equal('BCDEFGHIJKLMNOPQRSTUVWXYZA', rotor.alpha);
    });
    it('should rotate the encoding 1 position', () => {
      assert.equal('KMFLGDQVZNTOWYHXUSPAIBRCJE', rotor.encoding);
    });
    it('should rotate the decoding 1 position', () => {
      assert.equal('WYGADFPVZBECKMTHXSLRINQOJU', rotor.decoding);
    });
    it('should set the position to 1', () => {
      assert.equal(1, rotor.position);
    });
  });
});
