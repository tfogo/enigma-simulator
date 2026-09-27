import enigma from "enigma-simulator";
import type { Lesson, LessonActivity as Activity } from "./lessons";
import type { Session } from "./session";

export default function LessonActivity({
  lesson,
  activity,
  onActivity,
  session,
  replaceMessage,
  append,
  complete,
  completed,
  restart,
  next,
  sourceNote,
}: {
  lesson: Lesson;
  activity: Activity;
  onActivity: (activity: Activity) => void;
  session: Session;
  replaceMessage: (text: string) => void;
  append: (text: string) => void;
  complete: () => void;
  completed: boolean;
  restart: () => void;
  next?: () => void;
  sourceNote: React.ReactNode;
}) {
  const expectedCipher = enigma(lesson.configuration).encodeString("HELLO");
  const output = session.entries.map((entry) => entry.trace.output).join("");
  const signal = session.entries.at(-1)?.trace;
  const choice =
    activity.choice === null ? undefined : lesson.choices[activity.choice];
  const repeated = [
    ...new Set(
      output
        .split("")
        .filter((letter, index) => output.indexOf(letter) !== index),
    ),
  ];
  const experimentDone =
    activity.ran && (lesson.id !== "read-again" || activity.deciphered);
  function run() {
    replaceMessage(
      lesson.id === "repeated-letters"
        ? "A".repeat(30)
        : lesson.id === "one-signal"
          ? "A"
          : "HELLO",
    );
    onActivity({
      ...activity,
      ran: true,
      deciphered: false,
      triedWithoutReset: false,
    });
  }
  return (
    <section className="lesson-card" aria-labelledby="lesson-title">
      <span className="tag">GUIDED EXPERIMENT</span>
      <h2 id="lesson-title" tabIndex={-1}>
        {lesson.title}
      </h2>
      <p className="muted">{lesson.objective}</p>
      <div className="lesson-copy">
        <h3>Make a prediction.</h3>
        <p>{lesson.question}</p>
        <div className="quiz" role="group" aria-label="Make a prediction">
          {lesson.choices.map((option, index) => (
            <button
              key={option.text}
              className={activity.choice === index ? "chosen" : ""}
              aria-pressed={activity.choice === index}
              onClick={() => onActivity({ ...activity, choice: index })}
            >
              {option.text}
            </button>
          ))}
        </div>
        {choice && (
          <p className="feedback" role="status">
            {choice.feedback}
          </p>
        )}
        <button className="primary" onClick={run}>
          {lesson.id === "repeated-letters"
            ? "Press A thirty times"
            : lesson.id === "one-signal"
              ? "Trace one A with plugs AB CD"
              : "Encipher HELLO"}{" "}
          →
        </button>
        {activity.ran && (
          <div className="experiment-observation" aria-live="polite">
            {lesson.id === "repeated-letters" && (
              <>
                <h3>A changing route, familiar lamps.</h3>
                <p>
                  The thirty A letters moved the machine thirty times. Repeated
                  output letters in this run:{" "}
                  <strong>{repeated.join(", ") || "none"}</strong>.
                </p>
                <p>
                  Changing positions does not mean every output must be unique.
                  Restart and repeat the experiment: it gives exactly the same
                  sequence.
                </p>
              </>
            )}
            {lesson.id === "one-signal" && signal && (
              <>
                <h3>Out and back.</h3>
                <p>
                  The first plugboard pass sends {signal.stages[0].inputLetter}{" "}
                  to {signal.stages[0].outputLetter}. The reflector turns the
                  circuit around. Each rotor appears twice in the complete trace
                  below.
                </p>
                <p>
                  Select Follow the keypress and use Next connection to inspect
                  the journey. The final lamp is {signal.output}.
                </p>
              </>
            )}
            {lesson.id === "read-again" && (
              <>
                <h3>Keep the starting state.</h3>
                <p>
                  From the lesson’s starting settings, HELLO becomes{" "}
                  <strong data-testid="lesson-cipher">{expectedCipher}</strong>.
                </p>
                {!activity.deciphered && (
                  <>
                    <button
                      className="secondary"
                      disabled={activity.triedWithoutReset}
                      onClick={() => {
                        append(expectedCipher);
                        onActivity({ ...activity, triedWithoutReset: true });
                      }}
                    >
                      Try without resetting
                    </button>
                    {activity.triedWithoutReset && (
                      <p>
                        Continuing from the ending windows produced{" "}
                        <strong>{output.slice(-5)}</strong>. The message did not
                        return to HELLO.
                      </p>
                    )}
                    <button
                      className="primary"
                      onClick={() => {
                        replaceMessage(expectedCipher);
                        onActivity({ ...activity, deciphered: true });
                      }}
                    >
                      Reset and decipher →
                    </button>
                  </>
                )}
                {activity.deciphered && (
                  <p data-testid="lesson-deciphered">
                    Restoring the starting state and entering {expectedCipher}{" "}
                    gives <strong>{output}</strong>.
                  </p>
                )}
              </>
            )}
          </div>
        )}
        {experimentDone && choice?.correct && (
          <button
            className="primary"
            aria-disabled={completed}
            onClick={() => {
              if (!completed) complete();
            }}
          >
            Mark lesson complete ✓
          </button>
        )}
        {completed && (
          <div className="lesson-complete">
            <p className="eyebrow">✓ LESSON COMPLETE</p>
            {next ? (
              <button className="primary" onClick={next}>
                Next lesson →
              </button>
            ) : (
              <p>
                You can now encipher a message, inspect its circuit, and restore
                its starting state to read it again.
              </p>
            )}
          </div>
        )}
      </div>
      {sourceNote}
      <button className="text-button restart" onClick={restart}>
        ↺ Restart lesson
      </button>
    </section>
  );
}
