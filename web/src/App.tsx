import { useEffect, useReducer, useState } from "react";
import Machine from "./Machine";
import MessageTools from "./MessageTools";
import SessionTools from "./SessionTools";
import {
  readShareLink,
  readGroupingPreference,
  saveGroupingPreference,
} from "./transport";
import Inspector from "./Inspector";
import Settings from "./Settings";
import {
  createSession,
  sessionFromSnapshot,
  letters,
  sessionReducer,
  type Action,
} from "./session";
import { history, readings } from "./content";

type View = "Learn" | "Explore" | "History" | "Reference";
function Mark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 1v8m0 16v8M1 17h8m16 0h8M6 6l6 6m10 10 6 6M6 28l6-6M22 12l6-6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export function SourceNote({ id }: { id: string }) {
  const source = readings.find((r) => r.id === id)!;
  return (
    <details className="source-note">
      <summary>Source & further reading</summary>
      <p className="tiny">
        {source.author} · {source.kind}
      </p>
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.title} ↗
      </a>
      <p>{source.note}</p>
      <p className="tiny muted">
        Look for: {source.locator}. Opens in a new tab.
      </p>
    </details>
  );
}
export default function App() {
  const [shared] = useState(() => readShareLink(window.location.hash));
  const [view, setView] = useState<View>(
    shared.snapshot || shared.error ? "Explore" : "Learn",
  );
  const [shareError, setShareError] = useState(shared.error);
  const [settingsRevision, setSettingsRevision] = useState(0);
  const [learn, dispatchLearn] = useReducer(sessionReducer, undefined, () =>
    createSession(),
  );
  const [explore, dispatchExplore] = useReducer(
    sessionReducer,
    undefined,
    () =>
      shared.snapshot ? sessionFromSnapshot(shared.snapshot) : createSession(),
  );
  const [lessonStep, setLessonStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [grouped, setGrouped] = useState(readGroupingPreference);
  function changeGrouping(value: boolean) {
    setGrouped(value);
    saveGroupingPreference(value);
  }
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const session = view === "Learn" ? learn : explore;
  const trace =
    view === "Explore" && selectedEntry !== null
      ? explore.entries[selectedEntry]?.trace
      : session.entries.at(-1)?.trace;
  const lessonTrace = learn.entries.at(-1)?.trace;
  useEffect(() => {
    function receiveLink() {
      const incoming = readShareLink(window.location.hash);
      if (!incoming.snapshot && !incoming.error) return;
      setView("Explore");
      setShareError(incoming.error);
      if (incoming.snapshot) {
        dispatchExplore({ type: "configure", snapshot: incoming.snapshot });
        setSelectedEntry(null);
        setSettingsRevision((value) => value + 1);
      }
    }
    window.addEventListener("hashchange", receiveLink);
    return () => window.removeEventListener("hashchange", receiveLink);
  }, []);

  function navigate(next: View) {
    setView(next);
    requestAnimationFrame(() => document.getElementById("page-title")?.focus());
  }
  function updateExplore(action: Action, refreshSettings = true) {
    setSelectedEntry(null);
    if (action.type === "configure") {
      setShareError(undefined);
      if (refreshSettings) setSettingsRevision((value) => value + 1);
    }
    dispatchExplore(action);
  }
  function dispatch(action: Action) {
    if (view === "Learn") {
      dispatchLearn(action);
      if (
        action.type === "reset" ||
        (action.type === "undo" && learn.entries.length === 1)
      ) {
        setLessonStep(0);
        setAnswer(null);
      }
    } else updateExplore(action);
  }
  function press(letter: string) {
    dispatch({ type: "key", letter });
    if (view === "Learn" && lessonStep === 0) setLessonStep(1);
  }
  const titles: Record<View, [string, string, string]> = {
    Learn: [
      "01 / LEARN BY DOING",
      "Every letter has a journey.",
      "Lift the lid on Enigma. Discover the machine one keypress at a time.",
    ],
    Explore: [
      "02 / THE WORKBENCH",
      "A small change. A new cipher.",
      "Choose your settings, send a message, and look inside every connection.",
    ],
    History: [
      "03 / BEYOND THE MACHINE",
      "The people behind the cipher.",
      "A first selection of stories, with paths into the historical evidence.",
    ],
    Reference: [
      "04 / KEEP EXPLORING",
      "Follow your curiosity.",
      "The museum collections, documents, and research behind this field guide.",
    ],
  };
  const filtered = readings.filter(
    (r) =>
      (topic === "All topics" || r.topic === topic) &&
      `${r.title} ${r.author} ${r.note}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#main" onClick={() => navigate("Learn")}>
          <Mark />
          <span>
            ENIGMA<small>AN INTERACTIVE FIELD GUIDE</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {(["Learn", "Explore", "History", "Reference"] as View[]).map(
            (item, i) => (
              <button
                key={item}
                aria-current={view === item ? "page" : undefined}
                onClick={() => navigate(item)}
              >
                <span className="nav-number">0{i + 1}</span>
                {item}
              </button>
            ),
          )}
        </nav>
        <span className="edition">
          OPEN THE LID.
          <br />
          UNDERSTAND THE STORY.
        </span>
      </header>
      <main id="main">
        <div className="page-intro">
          <div>
            <p className="eyebrow">{titles[view][0]}</p>
            <h1 id="page-title" tabIndex={-1}>
              {titles[view][1]}
            </h1>
            <p className="intro-description">{titles[view][2]}</p>
          </div>
          <div className="edition-stamp" aria-hidden="true">
            <span>LETTERS IN</span>
            <div>
              A <span>↔</span> F
            </div>
            <span>DISCOVERY OUT</span>
          </div>
        </div>
        {view === "Explore" && shareError && (
          <p role="alert" className="error">
            {shareError} No shared settings were applied; the current machine is
            unchanged.
          </p>
        )}
        {(view === "Learn" || view === "Explore") && (
          <div className="workbench">
            <aside className="learning-column">
              {view === "Learn" ? (
                <section className="lesson-card" aria-labelledby="lesson-title">
                  <div className="lesson-top">
                    <span className="tag">LESSON 01</span>
                    <span className="tiny muted">≈ 3 MINUTES</span>
                  </div>
                  <h2 id="lesson-title">Your first keypress.</h2>
                  <p className="muted">No codebreaking experience required.</p>
                  <ol className="lesson-progress" aria-label="Lesson progress">
                    {["Press", "Observe", "Trace", "Discover"].map(
                      (label, i) => (
                        <li
                          key={label}
                          aria-current={i === lessonStep ? "step" : undefined}
                          className={i <= lessonStep ? "reached" : ""}
                        >
                          <span>{i < lessonStep ? "✓" : i + 1}</span>
                          <small>{label}</small>
                        </li>
                      ),
                    )}
                  </ol>
                  <div className="lesson-copy" aria-live="polite">
                    {lessonStep === 0 && (
                      <>
                        <h3>
                          A letter goes in.
                          <br />
                          Another lights up.
                        </h3>
                        <p>
                          The keyboard is your starting point. Press{" "}
                          <strong>A</strong> and watch the windows above it.
                        </p>
                        <p>
                          You don’t need to change any settings yet. The machine
                          is ready.
                        </p>
                        <button className="primary" onClick={() => press("A")}>
                          Try the A key <span>→</span>
                        </button>
                      </>
                    )}
                    {lessonStep === 1 && (
                      <>
                        <h3>First, something moves.</h3>
                        <p>
                          You pressed <strong>{lessonTrace?.input}</strong>. The
                          machine lit <strong>{lessonTrace?.output}</strong>.
                        </p>
                        <div className="window-comparison">
                          <span>
                            {lessonTrace &&
                              letters(lessonTrace.positionsBefore)}
                          </span>
                          <span>→</span>
                          <strong>
                            {lessonTrace && letters(lessonTrace.positionsAfter)}
                          </strong>
                        </div>
                        <p>
                          The rightmost rotor advanced before the electrical
                          signal passed through. The circuit has already
                          changed.
                        </p>
                        <button
                          className="primary"
                          onClick={() => setLessonStep(2)}
                        >
                          Follow the current <span>→</span>
                        </button>
                      </>
                    )}
                    {lessonStep === 2 && (
                      <>
                        <h3>Take the long way round.</h3>
                        <p>
                          The signal travels through the plugboard and rotors,
                          reaches the reflector, then returns through the rotors
                          to a lamp.
                        </p>
                        <p>
                          Use <strong>Next connection</strong> in the panel
                          below the machine to follow each part of the journey.
                        </p>
                        <button
                          className="primary"
                          onClick={() => {
                            press(lessonTrace?.input ?? "A");
                            setLessonStep(3);
                          }}
                        >
                          Press {lessonTrace?.input ?? "A"} once more{" "}
                          <span>→</span>
                        </button>
                      </>
                    )}
                    {lessonStep === 3 && (
                      <>
                        <h3>Same key. A new circuit.</h3>
                        <p>
                          The rotor moved again. Why can pressing the same key
                          produce a different letter?
                        </p>
                        <div
                          className="quiz"
                          role="group"
                          aria-label="Check your understanding"
                        >
                          <button
                            className={answer === "rotor" ? "chosen" : ""}
                            onClick={() => setAnswer("rotor")}
                          >
                            The rotor changes the signal’s route.
                          </button>
                          <button
                            className={answer === "keyboard" ? "chosen" : ""}
                            onClick={() => setAnswer("keyboard")}
                          >
                            The keyboard chooses a random letter.
                          </button>
                        </div>
                        {answer === "keyboard" && (
                          <p className="feedback">
                            There’s no random choice in the circuit. Look at the
                            moving rotor: its position changes which contacts
                            connect. Try again.
                          </p>
                        )}
                        {answer === "rotor" && (
                          <div className="lesson-complete">
                            <span className="eyebrow">
                              ✓ FIRST DISCOVERY COMPLETE
                            </span>
                            <p>
                              Exactly. The wiring is fixed, but its position
                              changes. The same settings and keypresses always
                              give the same result.
                            </p>
                            <button
                              className="primary"
                              onClick={() => navigate("Explore")}
                            >
                              Explore the machine <span>→</span>
                            </button>
                            <button
                              className="text-button"
                              onClick={() => navigate("History")}
                            >
                              Meet its history →
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <SourceNote id="mechanism" />
                  {lessonStep > 0 && (
                    <button
                      className="text-button restart"
                      onClick={() => {
                        dispatchLearn({
                          type: "configure",
                          snapshot: createSession().snapshot,
                        });
                        setLessonStep(0);
                        setAnswer(null);
                      }}
                    >
                      ↺ Restart lesson
                    </button>
                  )}
                </section>
              ) : (
                <Settings
                  key={settingsRevision}
                  configuration={explore.snapshot.configuration}
                  onApply={(snapshot) =>
                    updateExplore({ type: "configure", snapshot }, false)
                  }
                />
              )}
              <div className="margin-note">
                <span className="note-symbol" aria-hidden="true">
                  ✳
                </span>
                <div>
                  <h3>
                    {view === "Learn"
                      ? "A little context"
                      : "An experiment to try"}
                  </h3>
                  <p>
                    {view === "Learn"
                      ? "This is a working model of Enigma I. The controls reveal the mechanism; the History section introduces the people and events around it."
                      : "Type a short message and note its output. Reset, then type that output. With the same starting settings, your original message returns."}
                  </p>
                  {view === "Learn" && (
                    <button
                      className="text-button"
                      onClick={() => navigate("History")}
                    >
                      Step into the story ↗
                    </button>
                  )}
                </div>
              </div>
            </aside>
            <div className="machine-column">
              <Machine
                session={session}
                dispatch={dispatch}
                onKey={press}
                learning={view === "Learn"}
                grouped={view === "Explore" && grouped}
              />
              {view === "Explore" && (
                <MessageTools
                  session={explore}
                  draft={draftMessage}
                  onDraft={setDraftMessage}
                  onAppend={(text) => updateExplore({ type: "append", text })}
                  selected={selectedEntry}
                  onSelect={setSelectedEntry}
                  grouped={grouped}
                  onGrouped={changeGrouping}
                />
              )}
              <Inspector trace={trace} />
              {view === "Explore" && (
                <SessionTools
                  session={explore}
                  onRestore={(snapshot) =>
                    updateExplore({ type: "configure", snapshot })
                  }
                />
              )}
            </div>
          </div>
        )}
        {view === "History" && (
          <div className="history-layout">
            <aside className="history-aside">
              <span className="eyebrow">A CONNECTED HISTORY</span>
              <h2>
                More than
                <br />a box of rotors.
              </h2>
              <p>
                Start with these four windows into the story. Open the source
                notes to check the evidence and continue reading.
              </p>
              <p className="muted tiny">
                These are introductory selections. The fuller wartime narrative
                is still being developed.
              </p>
              <div className="decorative-rotors" aria-hidden="true">
                <Mark />
                <Mark />
                <Mark />
              </div>
            </aside>
            <div className="timeline">
              {history.map((chapter, i) => (
                <article className="history-card" key={chapter.title}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <p className="eyebrow">
                    {chapter.era}{" "}
                    <span className="chapter-number">/ 0{i + 1}</span>
                  </p>
                  <h2>{chapter.title}</h2>
                  <p>{chapter.text}</p>
                  <details className="history-detail">
                    <summary>{chapter.question}</summary>
                    <p>{chapter.detail}</p>
                    {chapter.source === "naval" && (
                      <button
                        className="secondary"
                        onClick={() => navigate("Explore")}
                      >
                        Open the workbench →
                      </button>
                    )}
                  </details>
                  <SourceNote id={chapter.source} />
                </article>
              ))}
            </div>
          </div>
        )}
        {view === "Reference" && (
          <section aria-label="Reference library">
            <div className="reference-tools">
              <label>
                Find a resource
                <input
                  type="search"
                  placeholder="Search titles, authors, or ideas…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label>
                Topic
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {["All topics", "Mechanics", "History", "Messages"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
              </label>
              <span className="muted tiny" role="status">
                {filtered.length} resources
              </span>
            </div>
            <div className="reference-grid">
              {filtered.map((source) => (
                <article className="reference-card" key={source.id}>
                  <div className="resource-meta">
                    <span className="tag">{source.topic}</span>
                    <span className="tiny muted">{source.level}</span>
                  </div>
                  <p className="eyebrow">{source.kind}</p>
                  <h2>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title} <span aria-hidden="true">↗</span>
                    </a>
                  </h2>
                  <p className="source-author">{source.author}</p>
                  <p>{source.note}</p>
                  <p className="tiny muted">Look for: {source.locator}</p>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <p className="empty-search">
                No matching resources. Try a different search or topic.
              </p>
            )}
            <aside className="research-note">
              <span className="eyebrow">A NOTE ON CHECKING SOURCES</span>
              <h3>Even good references can disagree.</h3>
              <p>
                Crypto Museum’s introductory page gives a single-notch rotor
                period of 16,926. Hamer, Sullivan and Weierud’s research paper
                gives 16,900, matching a full cycle in this simulator. We use
                the latter and keep both references so you can check the
                difference.
              </p>
              <a
                href="https://cryptocellar.org/pubs/enigvar.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Read the research · page 6 ↗
              </a>
            </aside>
          </section>
        )}
      </main>
      <footer>
        <div className="footer-brand">
          <Mark />
          <span>
            ENIGMA <span className="muted">/ An interactive field guide</span>
          </span>
        </div>
        <span>Explore the mechanism. Follow the evidence.</span>
        <span className="tiny muted">Prototype · 01</span>
      </footer>
    </>
  );
}
