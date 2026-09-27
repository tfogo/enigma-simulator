const assert = require('node:assert/strict');
const enigma = require('..');
const sources = require('../docs/sources.json');
const vectors = require('./fixtures/reference-vectors.json');

describe('Fixture and model provenance', () => {
  it('resolves every published fixture/profile source to a unique cited record', () => {
    const ids = new Set(sources.map(s => s.id));
    assert.equal(ids.size, sources.length);
    assert.equal(new Set(vectors.map(v => v.id)).size, vectors.length);
    for (const source of sources) {
      assert.ok(source.title);
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.ok(source.locators.length);
    }
    for (const vector of vectors) {
      assert.ok(ids.has(vector.source), vector.id);
      assert.ok(vector.locator);
      assert.ok(vector.kind);
      assert.match(vector.plaintext, /^[A-Z]+$/);
      assert.match(vector.ciphertext, /^[A-Z]+$/);
      assert.equal(vector.plaintext.length, vector.ciphertext.length);
    }
    for (const profile of enigma.getModelProfiles()) {
      for (const citation of profile.sources) {
        assert.ok(ids.has(citation.id));
        assert.equal(citation.url, sources.find(s => s.id === citation.id).url);
        assert.ok(citation.locator);
      }
    }
  });
});
