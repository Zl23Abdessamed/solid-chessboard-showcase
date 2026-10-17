// src/lib/stockfish.ts
// A small, typed UCI wrapper around the Stockfish Web Worker.
//
// Expects these files to live in your `public/` folder (served from `/`):
//   /stockfish-19-lite-single.js
//   /stockfish-19-lite-single.wasm
//
// The `.js` shim fetches the matching `.wasm` automatically, so you only
// need to point the Worker at the JS file.

export type ScoreType = "cp" | "mate";

export interface EngineScore {
  type: ScoreType;
  /** centipawns for "cp", moves-to-mate for "mate" (may be negative). */
  value: number;
}

export interface EngineInfo {
  raw: string;
  depth?: number;
  seldepth?: number;
  multipv?: number;
  nodes?: number;
  nps?: number;
  time?: number; // ms
  score?: EngineScore;
  /** Principal variation as UCI moves, e.g. ["e2e4", "e7e5", ...]. */
  pv?: string[];
}

export interface AnalyzeOptions {
  /** FEN of the position. Omit to use the standard start position. */
  fen?: string;
  /** Moves (UCI) to apply on top of fen/startpos. */
  moves?: string[];
  /** Search to a fixed depth. Ignored if `movetime` is set. */
  depth?: number;
  /** Search for this many milliseconds. Takes precedence over `depth`. */
  movetime?: number;
  /**
   * Called for every `info` line from the engine.
   * With MultiPV > 1, `info.multipv` tells you which line this is.
   */
  onInfo?: (info: EngineInfo) => void;
}

export interface AnalyzeResult {
  bestmove: string;
  ponder?: string;
}

export interface StockfishEngine {
  /** Run the UCI handshake. Must be awaited before other calls. */
  init(): Promise<void>;
  /** Set a UCI option, e.g. setOption("MultiPV", 3). */
  setOption(name: string, value: string | number): void;
  /** Analyze a position. Resolves when the engine emits `bestmove`. */
  analyze(opts?: AnalyzeOptions): Promise<AnalyzeResult>;
  /** Stop the current search. Engine stays alive. */
  stop(): void;
  /** Terminate the worker. No further calls are valid. */
  quit(): void;
  /** Low-level: subscribe to every raw line. Returns an unsubscribe fn. */
  onLine(fn: (line: string) => void): () => void;
}

export interface CreateEngineOptions {
  /** Path to the worker script. Defaults to `/stockfish-19-lite-single.js`. */
  path?: string;
  /** Timeout in ms for UCI handshake tokens (`uciok`, `readyok`). Default 10_000. */
  handshakeTimeoutMs?: number;
}

const DEFAULT_PATH = "/stockfish-19-lite-single.js";

/**
 * Create a Stockfish engine backed by a Web Worker.
 *
 * ```ts
 * const engine = createEngine();
 * await engine.init();
 * engine.setOption("MultiPV", 3);
 *
 * const { bestmove } = await engine.analyze({
 *   fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
 *   depth: 15,
 *   onInfo: (info) => console.log(info),
 * });
 *
 * engine.quit();
 * ```
 */
export function createEngine(opts: CreateEngineOptions = {}): StockfishEngine {
  const path = opts.path ?? DEFAULT_PATH;
  const handshakeTimeoutMs = opts.handshakeTimeoutMs ?? 10_000;

  const worker = new Worker(path);
  const listeners = new Set<(line: string) => void>();

  worker.onmessage = (e: MessageEvent): void => {
    const data = e.data;
    const line =
      typeof data === "string"
        ? data
        : typeof data?.data === "string"
        ? data.data
        : "";
    if (!line) return;
    for (const fn of listeners) {
      try {
        fn(line);
      } catch (err) {
        // Never let a listener break the engine loop.
        console.error("[stockfish] listener threw:", err);
      }
    }
  };

  worker.onerror = (e): void => {
    console.error("[stockfish] worker error:", e.message ?? e);
  };

  const send = (cmd: string): void => worker.postMessage(cmd);

  const onLine = (fn: (line: string) => void): (() => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const waitFor = (token: string, timeoutMs = handshakeTimeoutMs): Promise<string> =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`[stockfish] timeout waiting for "${token}"`));
      }, timeoutMs);

      const off = onLine((line) => {
        if (line.startsWith(token)) {
          clearTimeout(timer);
          off();
          resolve(line);
        }
      });
    });

  const init = async (): Promise<void> => {
    send("uci");
    await waitFor("uciok");
    send("isready");
    await waitFor("readyok");
  };

  const setOption = (name: string, value: string | number): void => {
    send(`setoption name ${name} value ${value}`);
  };

  const analyze = (options: AnalyzeOptions = {}): Promise<AnalyzeResult> => {
    const { fen, moves = [], depth, movetime, onInfo } = options;

    return new Promise<AnalyzeResult>((resolve) => {
      const off = onLine((line) => {
        if (line.startsWith("info ") && onInfo) {
          onInfo(parseInfo(line));
        } else if (line.startsWith("bestmove")) {
          off();
          const parts = line.split(/\s+/);
          const result: AnalyzeResult = { bestmove: parts[1] };
          if (parts[2] === "ponder" && parts[3]) result.ponder = parts[3];
          resolve(result);
        }
      });

      const movesSuffix = moves.length ? ` moves ${moves.join(" ")}` : "";
      const posCmd = fen
        ? `position fen ${fen}${movesSuffix}`
        : `position startpos${movesSuffix}`;
      send(posCmd);

      if (typeof movetime === "number") {
        send(`go movetime ${movetime}`);
      } else {
        send(`go depth ${depth ?? 15}`);
      }
    });
  };

  const stop = (): void => send("stop");

  const quit = (): void => {
    send("quit");
    worker.terminate();
    listeners.clear();
  };

  return { init, setOption, analyze, stop, quit, onLine };
}

// ---------------------------------------------------------------------------
// UCI info-line parser
// ---------------------------------------------------------------------------

export function parseInfo(line: string): EngineInfo {
  const tokens = line.split(/\s+/);
  const info: EngineInfo = { raw: line };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t) {
      case "depth":
        info.depth = Number(tokens[++i]);
        break;
      case "seldepth":
        info.seldepth = Number(tokens[++i]);
        break;
      case "multipv":
        info.multipv = Number(tokens[++i]);
        break;
      case "nodes":
        info.nodes = Number(tokens[++i]);
        break;
      case "nps":
        info.nps = Number(tokens[++i]);
        break;
      case "time":
        info.time = Number(tokens[++i]);
        break;
      case "score": {
        const type = tokens[++i] as ScoreType;
        const value = Number(tokens[++i]);
        info.score = { type, value };
        break;
      }
      case "pv": {
        info.pv = tokens.slice(i + 1);
        i = tokens.length; // pv is always last
        break;
      }
      default:
        // ignore unknown tokens (lowerbound, upperbound, currmove, ...)
        break;
    }
  }
  return info;
}

// ---------------------------------------------------------------------------
// Small helpers you'll probably want
// ---------------------------------------------------------------------------

/** Format a UCI score for display: "+1.24", "-0.37", "#5", "#-3", or "—". */
export function formatScore(score: EngineScore | undefined): string {
  if (!score) return "—";
  if (score.type === "mate") {
    return score.value >= 0 ? `#${score.value}` : `#-${Math.abs(score.value)}`;
  }
  const pawns = score.value / 100;
  return pawns > 0 ? `+${pawns.toFixed(2)}` : pawns.toFixed(2);
}

/**
 * Convert a `cp` score to White's perspective.
 * Stockfish reports from the side-to-move's POV.
 */
export function scoreForWhite(
  score: EngineScore | undefined,
  fen: string
): EngineScore | undefined {
  if (!score) return undefined;
  const sideToMove = fen.split(" ")[1];
  if (sideToMove === "b") {
    return { type: score.type, value: -score.value };
  }
  return score;
}