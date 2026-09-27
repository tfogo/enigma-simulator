import { useEffect, useState } from "react";
import type enigma from "enigma-simulator";

export type PlaybackMode = "immediate" | "guided";
export function usePlayback(
  trace: enigma.Trace | undefined,
  visible: boolean,
  scope: string,
) {
  const [mode, setMode] = useState<PlaybackMode>("immediate");
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [frame, setFrame] = useState({
    trace,
    scope,
    mode,
    active: 0,
    playing: false,
  });
  const length = trace?.stages.length ?? 0;
  // Derive the first frame synchronously: a new trace must never flash an old lamp.
  const fresh =
    frame.trace !== trace || frame.scope !== scope || frame.mode !== mode;
  const active = fresh ? (mode === "guided" ? -1 : 0) : frame.active;
  const playing =
    visible &&
    !!trace &&
    (fresh
      ? frame.scope === scope && mode === "guided" && !reduced
      : frame.playing);
  function update(next: number, play: boolean) {
    setFrame({ trace, scope, mode, active: next, playing: play });
  }
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      setReduced(media.matches);
      if (media.matches) setFrame((old) => ({ ...old, playing: false }));
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!visible) {
      setFrame({ trace, scope, mode, active, playing: false });
      return;
    }
    if (fresh && !playing) {
      setFrame({ trace, scope, mode, active, playing: false });
      return;
    }
    if (!playing || active >= length) return;
    const timer = window.setTimeout(
      () =>
        setFrame({
          trace,
          scope,
          mode,
          active: active + 1,
          playing: active + 1 < length,
        }),
      700,
    );
    return () => window.clearTimeout(timer);
  }, [trace, scope, mode, visible, active, playing, length, fresh]);
  return {
    mode,
    setMode,
    active,
    playing,
    reduced,
    play: () => update(active >= length ? -1 : active, !playing),
    next: () => update(Math.min(length, active + 1), false),
    back: () => update(Math.max(-1, active - 1), false),
    finish: () => update(length, false),
  };
}
export type Playback = ReturnType<typeof usePlayback>;
