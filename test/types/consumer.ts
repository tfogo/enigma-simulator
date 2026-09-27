import enigma = require('../..');
import defaultEnigma from '../..';

const named = enigma({ model: 'M4', positions: [0, 1, 2, 3] as const });
const legacy = enigma(['III', 'II', 'I'] as const, [0, 0, 0], [1, 2, 3], 'B', 'AZ');
const defaultImport: enigma.Machine = defaultEnigma();
const config: enigma.ResolvedConfiguration = named.getConfiguration();
const state: enigma.State = named.getState();
const snapshot: enigma.Snapshot = named.snapshot();
const restored: enigma.Machine = enigma.fromSnapshot(snapshot);
restored.restore(JSON.parse(named.serialize()));
enigma.deserialize(named.serialize()).clone().setPosition(state.positions);
const ciphertext: string = enigma(config).encodeString('HELLO');
const inspection: enigma.Trace = legacy.traceChar('A');
const trace: enigma.Trace = named.pressKeyWithTrace('A');
for (const stage of trace.stages) {
  const input: number = stage.input;
  if (stage.kind === 'rotor') {
    const contact: number = stage.wiringInput;
    const rotor: enigma.RotorName = stage.name;
    const direction: enigma.Direction = stage.direction;
  } else if (stage.kind === 'reflector') {
    const reflector: enigma.ReflectorName = stage.name;
    const direction: 'reflect' = stage.direction;
  } else {
    // @ts-expect-error Fixed stages do not expose rotor wiring offsets.
    const invalid = stage.wiringInput;
  }
}
for (const step of trace.stepping) {
  const reason: enigma.StepReason | undefined = step.reasons[0];
}
const profiles: enigma.ModelProfile[] = enigma.getModelProfiles();
const sources: enigma.SourceReference[] = profiles[0].sources;

// @ts-expect-error Unknown model name.
enigma({ model: 'M5' });
// @ts-expect-error Unknown rotor name.
enigma({ rotors: ['IX', 'II', 'I'] });
// @ts-expect-error Misspelled configuration field.
enigma({ position: [0, 0, 0] });
// @ts-expect-error Cannot mix calling conventions.
enigma({ model: 'M4' }, [0, 0, 0, 0]);
// @ts-expect-error encodeString takes text, not a character array.
named.encodeString(['A']);
// @ts-expect-error Serialized snapshots must be strings.
enigma.deserialize(snapshot);
// @ts-expect-error Legacy inspection strings are not mutable configuration.
named.rotors[0].encoding = 'ABC';
