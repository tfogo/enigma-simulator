// Verify the packed artifact, without the frontend's source alias or repository dependencies.
const { mkdtemp, writeFile, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = require('@playwright/test');

async function main() {
  const root = path.resolve(__dirname, '..');
  const temporary = await mkdtemp(path.join(tmpdir(), 'enigma-package-'));
  let server;
  let browser;
  const npmCli = process.env.npm_execpath;
  const runNpm = (args, cwd) => {
    assert(npmCli, 'Run this check with npm run test:package');
    return execFileSync(process.execPath, [npmCli, ...args], { cwd, encoding: 'utf8' });
  };
  try {
    const [pack] = JSON.parse(runNpm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
    assert(pack.files.some(file => file.path === 'index.d.ts'));
    assert(pack.files.every(file => /^(src\/|index\.(js|d\.ts)$|package\.json$|README|LICENSE)/.test(file.path)), 'Unexpected content in runtime package');
    await writeFile(path.join(temporary, 'package.json'), JSON.stringify({ name: 'enigma-consumer-check', private: true, type: 'module' }));
    runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', path.join(temporary, pack.filename)], temporary);
    const consumerRequire = createRequire(path.join(temporary, 'consumer.cjs'));
    const enigma = consumerRequire('enigma-simulator');
    assert.equal(enigma().encodeString('ABC'), 'FUV');
    const metadata = consumerRequire('enigma-simulator/package.json');
    assert.equal(Object.keys(metadata.dependencies || {}).length, 0);

    const vectors = JSON.parse(await readFile(path.join(root, 'test/fixtures/reference-vectors.json'), 'utf8'));
    await writeFile(path.join(temporary, 'index.html'), '<!doctype html><html lang="en"><title>Package check</title><body><script type="module" src="/main.js"></script></body></html>');
    await writeFile(path.join(temporary, 'main.js'), `
import enigma from 'enigma-simulator';
const vectors = ${JSON.stringify(vectors)};
const check = (condition, message) => { if (!condition) throw new Error(message); };
for (const vector of vectors) {
  const machine = enigma(vector.rotors, vector.positions, vector.ringSettings, vector.reflector, vector.plugboard);
  check(machine.encodeString(vector.plaintext) === vector.ciphertext, vector.id + ': ciphertext');
  machine.reset();
  check(machine.encodeString(vector.ciphertext) === vector.plaintext, vector.id + ': plaintext');
}
for (const model of ['EnigmaI', 'M3', 'M4']) {
  const machine = enigma({ model });
  const trace = machine.pressKeyWithTrace('A');
  check(trace.stages.length > 0, model + ': trace');
  const restored = enigma.deserialize(machine.serialize());
  check(restored.encodeString('HELLO') === machine.encodeString('HELLO'), model + ': restored continuation');
}
document.body.textContent = 'Verified ' + vectors.length + ' reference vectors and all three profiles';
`);
    const { build, preview } = await import('vite');
    await build({ configFile: false, root: temporary, logLevel: 'warn' });
    server = await preview({ configFile: false, root: temporary, logLevel: 'warn', preview: { host: '127.0.0.1', port: 0, open: false } });
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.waitForFunction(() => document.body.textContent.startsWith('Verified '));
    assert.deepEqual(errors, []);
    console.log(await page.locator('body').innerText());
    console.log('Clean tarball install, CommonJS import, and production browser bundle passed.');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
    await rm(temporary, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
