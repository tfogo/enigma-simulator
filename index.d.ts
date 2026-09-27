/** Create a machine from a model-specific named configuration. */
declare function enigma(configuration: enigma.Configuration): enigma.Machine;
/** Legacy positional factory; arrays are left to right, A=0 through Z=25. */
declare function enigma(
  rotors?: readonly enigma.RotorName[],
  positions?: readonly number[],
  ringSettings?: readonly number[],
  reflector?: enigma.ReflectorName,
  plugboardPairs?: string,
): enigma.Machine;

declare namespace enigma {
  type Model = 'EnigmaI' | 'M3' | 'M4';
  type MovingRotorName = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII';
  type GreekRotorName = 'Beta' | 'Gamma';
  type RotorName = MovingRotorName | GreekRotorName;
  type ReflectorName = 'A' | 'B' | 'C' | 'BThin' | 'CThin';
  type Direction = 'forward' | 'return';
  type StepReason = 'keypress' | 'right-neighbor-at-notch' | 'at-notch' | 'no-turnover' | 'stationary';

  interface Configuration {
    /** Defaults to M3. Model/component compatibility is validated at runtime. */
    model?: Model;
    rotors?: readonly RotorName[];
    /** Initial/reset windows, not current state. Defaults to all zeroes. */
    positions?: readonly number[];
    ringSettings?: readonly number[];
    reflector?: ReflectorName;
    plugboardPairs?: string;
  }

  interface ResolvedConfiguration {
    model: Model;
    rotors: RotorName[];
    positions: number[];
    ringSettings: number[];
    reflector: ReflectorName;
    plugboardPairs: string;
  }

  interface State { positions: number[]; }

  interface Snapshot {
    schemaVersion: 1;
    configuration: ResolvedConfiguration;
    state: State;
  }

  interface SourceReference {
    id: string;
    title: string;
    url: string;
    locator: string;
  }

  interface ModelProfile {
    id: Model;
    name: string;
    movingRotors: MovingRotorName[];
    greekRotors: GreekRotorName[];
    reflectors: ReflectorName[];
    defaultRotors: RotorName[];
    defaultReflector: ReflectorName;
    entryWheel: string;
    stepping: 'military-pawls';
    notes: string;
    sources: SourceReference[];
  }

  interface StepDecision {
    /** Stable slot ID, zero-based from the left, such as rotor-0. */
    componentId: string;
    slot: number;
    rotor: RotorName;
    role: 'fast' | 'middle' | 'slow' | 'greek';
    before: number;
    after: number;
    atNotch: boolean;
    moved: boolean;
    reasons: StepReason[];
  }

  interface StageBase {
    componentId: string;
    name: string;
    input: number;
    output: number;
    inputLetter: string;
    outputLetter: string;
  }

  interface RotorStage extends StageBase {
    kind: 'rotor';
    name: RotorName;
    direction: Direction;
    slot: number;
    position: number;
    ringSetting: number;
    offset: number;
    wiringInput: number;
    wiringOutput: number;
  }

  interface PassiveStage extends StageBase {
    kind: 'plugboard' | 'entry-wheel';
    direction: Direction;
  }

  interface ReflectorStage extends StageBase {
    kind: 'reflector';
    name: ReflectorName;
    direction: 'reflect';
  }

  type SignalStage = RotorStage | PassiveStage | ReflectorStage;

  interface Trace {
    schemaVersion: 1;
    model: Model;
    input: string;
    output: string;
    stepped: boolean;
    positionsBefore: number[];
    positionsAfter: number[];
    /** Left-to-right mechanical decisions; empty for non-stepping inspection. */
    stepping: StepDecision[];
    /** Electrical traversal order; all positions are post-step for a keypress. */
    stages: SignalStage[];
  }

  interface RotorTransform {
    input: number;
    output: number;
    offset: number;
    wiringInput: number;
    wiringOutput: number;
  }

  /** Legacy inspection surface; prefer machine configuration/state APIs. */
  interface Rotor {
    readonly rotorType: RotorName;
    readonly position: number;
    readonly ringSetting: number;
    readonly offset: number;
    readonly turnover: string;
    readonly ring: string;
    readonly alpha: string;
    readonly encoding: string;
    readonly decoding: string;
    forward(contact: number): number;
    backward(contact: number): number;
    transform(contact: number, direction: Direction): RotorTransform;
    atNotch(): boolean;
    cycle(steps?: number): void;
    setPosition(position: number): void;
    setRingSetting(ringSetting: number): void;
  }

  interface Machine {
    /** Legacy array order is right to left. Public state/configuration arrays are left to right. */
    readonly rotors: readonly Rotor[];
    readonly reflector: string;
    readonly reflectorType: ReflectorName;
    readonly plugboard: string;
    readonly model: Model;
    readonly initialPositions: readonly number[];
    /** Inspect one character without stepping. */
    encodeChar(character: string): string;
    /** Step once before encoding one character. */
    pressKey(character: string): string;
    /** Validate all uppercase A-Z text before changing state. */
    encodeString(text: string): string;
    traceChar(character: string): Trace;
    pressKeyWithTrace(character: string): Trace;
    cycleRotors(): void;
    generatePlugboard(pairs: string): string;
    setPosition(positions: readonly number[]): void;
    reset(): void;
    getConfiguration(): ResolvedConfiguration;
    getState(): State;
    snapshot(): Snapshot;
    serialize(): string;
    /** Validates the entire snapshot before changing this machine. */
    restore(snapshot: unknown): void;
    clone(): Machine;
  }

  function fromSnapshot(snapshot: unknown): Machine;
  function deserialize(json: string): Machine;
  function getModelProfiles(): ModelProfile[];
}

export = enigma;
