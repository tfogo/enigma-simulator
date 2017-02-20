const assert = require('assert');
const Rotor = require('../src/rotor.js');
const enigma = require('../index.js');

describe('M3 Enigma Machine with default settings', () => {
  let em1 = enigma();
  describe('#constructor()', () => {
    it('should set rotors to III, II, I', () => {
      let rotors = [
        new Rotor('I', 0, 0),
        new Rotor('II', 0, 0),
        new Rotor('III', 0, 0)
      ];
      assert.equal(JSON.stringify(rotors), JSON.stringify(em1.rotors));
    });

    it('should set the plugboard to just the alphabet', () => {
      assert.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZ', em1.plugboard);
    });

    it('should set the reflector to reflector B', () => {
      assert.equal('YRUHQSLDPXNGOKMIEBFZCWVJAT', em1.reflector);
    });
  });

  describe('#generatePlugboard()', () => {
    let em1 = enigma();
    it('should return swap pairs of letters in the plugboard', () => {
      assert.equal('BACTEFGLIJKHMQOPNRSDUVWXYZ', em1.generatePlugboard('AB TD LH NQ'));
    });
    it('should return the alphabet if an empty string is passed', () => {
      assert.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZ', em1.generatePlugboard(''));
    });
  });

  describe('#encodeChar()', () => {
    it('should return N from A', () => {
      let em1 = enigma();
      assert.equal('N', em1.encodeChar('A'));
    });
  });

  describe('#cycleRotors()', () => {
    it('should cycle the first rotor one position', () => {
      let em1 = enigma();
      em1.cycleRotors();
      let rotors = [
        new Rotor('I', 0, 1),
        new Rotor('II', 0, 0),
        new Rotor('III', 0, 0)
      ];
      assert.equal(JSON.stringify(em1.rotors), JSON.stringify(rotors));
    });

    it('should cycle the second rotor at the first rotor\'s turnover', () => {
      let em1 = enigma(['III','II','I'], [0,0,16]);
      em1.cycleRotors();
      let rotors = [
        new Rotor('I', 0, 17),
        new Rotor('II', 0, 1),
        new Rotor('III', 0, 0)
      ];
      assert.equal(JSON.stringify(em1.rotors), JSON.stringify(rotors));
    });

    it('should cycle all three rotors at the second rotor\'s turnover (the double step)', () => {
      let em1 = enigma(['III','II','I'], [0,4,0]);
      em1.cycleRotors();
      let rotors = [
        new Rotor('I', 0, 1),
        new Rotor('II', 0, 5),
        new Rotor('III', 0, 1)
      ];
      assert.equal(JSON.stringify(em1.rotors), JSON.stringify(rotors));
    });
  });

  describe('#encodeString()', () => {
    it('should return string beginning in FUVEPUMWARVQKEFGHGDIJ...', () => {
      let em1 = enigma();
      assert.equal(em1.encodeString('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ'),'FUVEPUMWARVQKEFGHGDIJFMFXIMRENATHDMCEVOQHIUWRRGYSJADEGKHYJETLBLWVZNUXFNSPICQFGZCZJKYWLLGPXJKBYTNNEFYKQTCJOLGCWHGXUEYOQXDNIGIDEMBXACVPAVYUQCGPXILERRSJSBOOKJWXVPXKLUUOKXMQRCSYSXBRDAHMFONSMLUOGLAEHOQXDPKGGWWZWHIMTWCXCKJHINFROERNGAAZQLFRWXQIVVKXQODPCXYDVPXVUWWREVHWGKCNOFJORUQROZTJTPXZWICWSKIJVJXMATDYCROMOOPVNIKIDWSKQIICVYIXRPQGTDVOGGKREOFJFOREMCTYIXCUVQREROWGQHYVGSEBNSEFBYIJARHJKERTPNOKKNQUFOHRPMLPSZTBDPWAFCDVZLMFKNRHTWYHVCXLRXQSBYAKQTPXLZEHVYXYSBKZOSSFALSTXANXOPBCOFRHUVJHCKWKMPUVZUEEORQEWZLHVYVPOYYUBYGMXROMOJMFOCBUYOUVAHQIXXADYVEWGRKNNLGBATWKLQHRXVGOQBLBPNPMOBBKYNSNYUIMAHWRKMRHCHVCHAFHBMALLFYNACAHYBZCDMUHYSBMONCEQHRREVGZCZEVHVQWZCKKEJQLXUECLSJAE');
    });
  });
});

describe('M3 Enigma Machine with custom settings', () => {
  let em1 = enigma(['IV', 'I', 'III'], [3, 5, 20], [7, 12, 14], 'C', 'AB TD LH NQ');
  describe('#constructor()', () => {
    it('should set rotors to IV, I, III', () => {
      let rotors = [
        new Rotor('III', 14, 20),
        new Rotor('I', 12, 5),
        new Rotor('IV', 7, 3)
      ];
      assert.equal(JSON.stringify(em1.rotors), JSON.stringify(rotors));
    });

    it('should set the plugboard to BACTEFGLIJKHMQOPNRSDUVWXYZ', () => {
      assert.equal(em1.plugboard, 'BACTEFGLIJKHMQOPNRSDUVWXYZ');
    });

    it('should set the reflector to reflector C', () => {
      assert.equal(em1.reflector, 'FVPJIAOYEDRZXWGCTKUQSBNMHL');
    });
  });
});

describe('M4 Enigma Machine with default settings', () => {
  describe('#encodeString()', () => {
    it('should return string beginning in BPFWKVZYJMMULSUEDCNN...', () => {
      let em1 = enigma(['Gamma','III','II','I'], [0,0,0,0], [0,0,0,0], 'BThin');
      assert.equal(em1.encodeString('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ'),'BPFWKVZYJMMULSUEDCNNBIAQMJTIJXLYWPTGPXGTSHGIZKDIHHLQNEXAUDWNKTGDTMPMOPAQJKZNHRHRENHTYIDYNEXYHIFLLLVITHKHWFUBZEWCWPCSILZTYCJSAFFANEBHRTKMCGJMBUZFXDXFKBNANUUFOZBWORTLELJPZFAFCGJVSMGFQDEOLZZPJXUBNWBVLNSWOYYSEODDEIJKSIXZTBTWZFUEOMDWECOKJHWYAOWQYISQXTQRZTGKZKZDGNQFOVPVXUUNBDECOQSHRBRQQZJLEEBZBUYQBUJKHMNPCSWTMJQZKRTBDVPUUZUCVPASTMPMXFXPYNYMCQNSTKSHQLNSGAZFJQJXDLVFXLZXRPFBZXFABTLDSBNUUGERCRYFCGZCZQIQVTNZRKWGTXTYMFONVLSEBSTRDZSSJNMZPWKLUHLRBJTPKNPDMXAYBTOGLXACNUCSNMEMUQOYFMGOAWVXBZVKUJQZOQYGKAKWTMSXYPPSYIZLAPHIWBKPCJAKOEJFOLNTQMIOVUUYQRWBBHFWECOAJUVYAOTQLRFWSRQRBYVIDQDOHGLWXMGAUBRVAXQGUJFGYVHGSEKWTQNFUZPYHGQGGXYDXDBIPXDXBTBACZBANOTRKOJODAMOVWKHNEFNNR');
    });
  });

  describe('#cycleRotors()', () => {
    it('should turnover the second rotor twice for each revolution of the first rotor', () => {
      let em1 = enigma(['Gamma','III','II','VII'], [0,0,0,0], [0,0,0,0], 'BThin');
      for (let i = 0; i < 26; i++) {
        em1.cycleRotors();
      }
      let rotors = [
        new Rotor('VII', 0, 26),
        new Rotor('II', 0, 2),
        new Rotor('III', 0, 0),
        new Rotor('Gamma', 0, 0)
      ];
      assert.equal(JSON.stringify(em1.rotors), JSON.stringify(rotors));
    });
  });
});
