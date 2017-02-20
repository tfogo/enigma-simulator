const assert = require('assert');
const enigma = require('../index.js');

describe('Enigma Machine', () => {
  describe('#encodeString()', () => {
    it('should return ', () => {
      let em1 = enigma();
      assert.equal('FUV', em1.encodeString('ABC'));
    });
  });
});
