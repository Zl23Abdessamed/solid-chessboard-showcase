import { Title } from '@solidjs/meta';
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { Chess, type Square as ChessSquare } from 'chess.js';
import {
  Chessboard,
  ChessboardProvider,
  SparePiece,
  fenStringToPositionObject,
} from 'solid-chessboard';
import type {
  PieceDropHandlerArgs,
  PositionDataType,
  SquareHandlerArgs,
} from 'solid-chessboard';
import { BoardFrame, Example, ResetButton } from './Example';
import { FOCUS } from '../../utils/utils';
import { PIECE_SETS, buildPieceSet } from '../../utils/pieces';
import {
  createEngine,
  formatScore,
  scoreForWhite,
  type EngineScore,
  type StockfishEngine,
} from '../../utils/stockfish';

/* -------------------------------- snippets -------------------------------- */

const SNIPPET_ANALYSIS = `import { createSignal, onCleanup, onMount } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import { createEngine, formatScore, scoreForWhite } from './utils/stockfish';

function AnalysisBoard() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [score, setScore] = createSignal('—');
  const [best, setBest] = createSignal(null);
  let engine = null;
  let runId = 0;

  onMount(() => {
    engine = createEngine(); // /stockfish-19-lite-single.js + .wasm
    engine.init().then(() => void analyze(chess.fen()));
    onCleanup(() => engine && engine.quit());
  });

  // one search at a time: stop the old run before starting the next
  async function analyze(fen) {
    if (!engine) return;
    const id = ++runId;
    engine.stop();
    const res = await engine.analyze({
      fen: fen,
      movetime: 800,
      onInfo: (info) => {
        if (id !== runId || !info.score) return;
        setScore(formatScore(scoreForWhite(info.score, fen)));
      },
    });
    if (id !== runId) return;
    setBest(res.bestmove); // UCI, e.g. 'e2e4'
  }

  // after every move: setPosition(chess.fen()) then analyze(chess.fen())

  return (
    <div>
      <p>Evaluation: {score()} · best: {best() || '—'}</p>
      <Chessboard
        options={{
          position: position(),
          onPieceDrop: onPieceDrop,
          arrows: best()
            ? [{ startSquare: best().slice(0, 2), endSquare: best().slice(2, 4), color: '#22c55e' }]
            : [],
        }}
      />
    </div>
  );
}`;

const SNIPPET_SPARES = `import { createSignal } from 'solid-js';
import { For } from 'solid-js';
import {
  Chessboard,
  ChessboardProvider,
  SparePiece,
  fenStringToPositionObject,
} from 'solid-chessboard';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

function SetupEditor() {
  // free setup: a position object, not a FEN string
  const [setup, setSetup] = createSignal(
    fenStringToPositionObject(START, 8, 8),
  );

  const onPieceDrop = ({ piece, sourceSquare, targetSquare }) => {
    // dropped off the board: delete board pieces, ignore spares
    if (!targetSquare) {
      if (!piece.isSparePiece) {
        const next = { ...setup() };
        delete next[sourceSquare];
        setSetup(next);
      }
      return true;
    }
    const next = { ...setup() };
    // spares clone onto the board, board pieces relocate
    if (!piece.isSparePiece) delete next[sourceSquare];
    next[targetSquare] = { pieceType: piece.pieceType };
    setSetup(next);
    return true;
  };

  return (
    <ChessboardProvider options={{ position: setup(), onPieceDrop: onPieceDrop }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <For each={['wP', 'wN', 'wB', 'wR', 'wQ', 'wK']}>
          {(type) => (
            <div style={{ width: '48px' }}>
              <SparePiece pieceType={type} />
            </div>
          )}
        </For>
      </div>
      <Chessboard />
    </ChessboardProvider>
  );
}`;

const SNIPPET_THEMES = `import { createMemo, createSignal } from 'solid-js';
import { For } from 'solid-js';
import { Chessboard } from 'solid-chessboard';

const SETS = ['alpha', 'merida', 'cburnett' /* …43 sets */];

function ThemedBoard() {
  const [set, setSet] = createSignal('alpha');
  const [light, setLight] = createSignal('#F0D9B5');
  const [dark, setDark] = createSignal('#B58863');

  // rebuilt only when the set changes
  const pieces = createMemo(() => {
    const obj = {};
    for (const t of ['wP','wN','wB','wR','wQ','wK','bP','bN','bB','bR','bQ','bK']) {
      obj[t] = () => (
        <img
          src={'/piece/' + set() + '/' + t + '.svg'}
          alt={t}
          draggable={false}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }
    return obj;
  });

  return (
    <div>
      <select value={set()} onChange={(e) => setSet(e.currentTarget.value)}>
        <For each={SETS}>{(s) => <option value={s}>{s}</option>}</For>
      </select>
      <input type="color" value={light()} onInput={(e) => setLight(e.currentTarget.value)} />
      <input type="color" value={dark()} onInput={(e) => setDark(e.currentTarget.value)} />
      <Chessboard
        options={{
          position: position(),
          onPieceDrop: onPieceDrop,
          pieces: pieces(),
          lightSquareStyle: { 'background-color': light() },
          darkSquareStyle: { 'background-color': dark() },
        }}
      />
    </div>
  );
}`;

const SNIPPET_PREMOVE = `import { createSignal } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';

function PremoveGame() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  // a standing order: { from, to, color }
  const [premove, setPremove] = createSignal(null);

  const tryPremove = () => {
    const p = premove();
    if (!p || chess.turn() !== p.color) return;
    try {
      chess.move({ from: p.from, to: p.to, promotion: 'q' });
      setPosition(chess.fen());
      setPremove(null);
    } catch {
      setPremove(null); // no longer legal: drop it
    }
  };

  const commit = (from, to) => {
    chess.move({ from: from, to: to, promotion: 'q' });
    setPosition(chess.fen());
    tryPremove(); // opponent replied: fire a waiting premove
  };

  return (
    <div>
      <input id="pre-from" placeholder="from, e.g. g8" />
      <input id="pre-to" placeholder="to, e.g. f6" />
      <button onClick={() => setPremove(readInputs())}>Set premove</button>
      <Chessboard
        options={{
          position: position(),
          onPieceDrop: onPieceDrop,
          arrows: premove()
            ? [{ startSquare: premove().from, endSquare: premove().to, color: '#f59e0b' }]
            : [],
        }}
      />
    </div>
  );
}`;

const SNIPPET_RENDERER = `import { Chessboard } from 'solid-chessboard';

function CustomSquares() {
  const [lastMove, setLastMove] = createSignal(null);

  return (
    <Chessboard
      options={{
        position: position(),
        onPieceDrop: onPieceDrop,
        // squareRenderer replaces a square's inner content.
        // Return children to keep the default piece rendering.
        squareRenderer: ({ piece, square, children }) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              'box-shadow':
                lastMove() && lastMove().includes(square)
                  ? 'inset 0 0 0 3px rgba(217, 119, 6, 0.9)'
                  : 'none',
            }}
          >
            {children}
            <span
              style={{
                position: 'absolute',
                right: '3px',
                bottom: '1px',
                'font-size': '10px',
                opacity: '0.75',
              }}
            >
              {square}
            </span>
          </div>
        ),
      }}
    />
  );
}`;

/* ------------------------------ 1 · analysis ------------------------------ */

function whiteShare(score: EngineScore | undefined): number {
  if (!score) return 50;
  if (score.type === 'mate') return score.value > 0 ? 100 : 0;
  return 50 * (2 / (1 + Math.exp(-0.004 * score.value)));
}

function AnalysisDemo() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [engineState, setEngineState] = createSignal<
    'loading' | 'ready' | 'error'
  >('loading');
  const [thinking, setThinking] = createSignal(false);
  const [score, setScore] = createSignal<EngineScore | undefined>(undefined);
  const [depth, setDepth] = createSignal(0);
  const [best, setBest] = createSignal<string | null>(null);
  let engine: StockfishEngine | null = null;
  let runId = 0;

  onMount(() => {
    (async () => {
      try {
        engine = createEngine();
        await engine.init();
        setEngineState('ready');
        void analyze(chess.fen());
      } catch {
        setEngineState('error');
      }
    })();
    onCleanup(() => engine?.quit());
  });

  async function analyze(fen: string) {
    if (!engine) return;
    const id = ++runId;
    engine.stop();
    setThinking(true);
    try {
      const res = await engine.analyze({
        fen,
        movetime: 800,
        onInfo: (info) => {
          if (id !== runId || !info.score) return;
          setScore(scoreForWhite(info.score, fen));
          if (info.depth) setDepth(info.depth);
        },
      });
      if (id !== runId) return;
      setBest(res.bestmove);
    } finally {
      if (id === runId) setThinking(false);
    }
  }

  const afterChange = () => {
    setPosition(chess.fen());
    void analyze(chess.fen());
  };

  const commitMove = (from: string, to: string): boolean => {
    try {
      chess.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    afterChange();
    return true;
  };

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    return commitMove(sourceSquare, targetSquare);
  };

  const playBest = () => {
    const b = best();
    if (!b) return;
    commitMove(b.slice(0, 2), b.slice(2, 4));
  };

  const reset = () => {
    chess.reset();
    setBest(null);
    afterChange();
  };

  const pct = () => whiteShare(score());

  return (
    <div>
      <div class="flex items-stretch gap-3">
        {/* eval bar: white share from White's perspective */}
        <div
          class="flex w-7 shrink-0 flex-col items-center gap-1"
          aria-label="Evaluation"
        >
          <span class="text-xs font-bold tabular-nums text-slate-200">
            {score() ? formatScore(score()) : '—'}
          </span>
          <div class="relative w-full flex-1 overflow-hidden rounded-md bg-slate-950 ring-1 ring-white/15">
            <div
              class="absolute inset-x-0 bottom-0 bg-slate-100 transition-[height] duration-300"
              style={{ height: `${pct()}%` }}
            />
          </div>
          <span class="text-[11px] tabular-nums text-slate-500">
            {thinking() ? '…' : `d${depth()}`}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <BoardFrame>
            <Chessboard
              options={{
                position: position(),
                onPieceDrop,
                arrows: best()
                  ? [
                      {
                        startSquare: best()!.slice(0, 2),
                        endSquare: best()!.slice(2, 4),
                        color: '#22c55e',
                      },
                    ]
                  : [],
              }}
            />
          </BoardFrame>
        </div>
      </div>
      <p class="mt-4 text-base font-semibold text-slate-200" role="status">
        {engineState() === 'loading' && 'Starting engine…'}
        {engineState() === 'error' && 'Engine failed to load.'}
        {engineState() === 'ready' &&
          (best() ? `Best: ${best()}` : 'Analyzing…')}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={playBest}
          disabled={!best()}
          class={`mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-emerald-400 px-5 text-sm font-bold text-[#04130c] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
        >
          Play best move
        </button>
        <ResetButton onClick={reset} label="Reset analysis" />
      </div>
    </div>
  );
}

/* ----------------------------- 2 · spare pieces ---------------------------- */

const SETUP_START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const PALETTE = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK'];

function SpareDemo() {
  const [setup, setSetup] = createSignal<PositionDataType>(
    fenStringToPositionObject(SETUP_START, 8, 8),
  );
  const count = () => Object.keys(setup()).length;

  const onPieceDrop = ({
    piece,
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) {
      // dragged off the board: delete board pieces, ignore spares
      if (!piece.isSparePiece) {
        const next = { ...setup() };
        delete next[sourceSquare];
        setSetup(next);
      }
      return true;
    }
    const next = { ...setup() };
    if (!piece.isSparePiece) delete next[sourceSquare];
    next[targetSquare] = { pieceType: piece.pieceType };
    setSetup(next);
    return true;
  };

  const clear = () => setSetup({});
  const fill = () =>
    setSetup(fenStringToPositionObject(SETUP_START, 8, 8));

  return (
    <div>
      <ChessboardProvider options={{ position: setup(), onPieceDrop }}>
        <p class="mb-2 text-sm font-medium text-slate-400">
          Palette — drag onto the board ({count()} pieces placed)
        </p>
        <div class="mb-4 flex gap-1.5">
          <For each={PALETTE}>
            {(type) => (
              <div class="w-11 rounded-lg bg-black/30 p-0.5 ring-1 ring-white/10 sm:w-12">
                <SparePiece pieceType={type} />
              </div>
            )}
          </For>
        </div>
        <BoardFrame>
          <Chessboard />
        </BoardFrame>
      </ChessboardProvider>
      <p class="mt-3 text-sm text-slate-500">
        Drag a board piece off the board to delete it.
      </p>
      <div class="flex flex-wrap gap-2">
        <ResetButton onClick={fill} label="Start position" />
        <ResetButton onClick={clear} label="Clear board" />
      </div>
    </div>
  );
}

/* ------------------------- 3 · themes (pieces+colors) ----------------------- */

function ThemesDemo() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [set, setSet] = createSignal('alpha');
  const [light, setLight] = createSignal('#F0D9B5');
  const [dark, setDark] = createSignal('#B58863');

  const pieces = () => buildPieceSet(set());

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    chess.reset();
    setPosition(chess.fen());
  };

  return (
    <div>
      <div class="mb-4 grid grid-cols-1 gap-2">
        <label
          for="adv-piece-set"
          class="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/40 px-3 text-sm text-slate-300 ring-1 ring-inset ring-white/15"
        >
          Set
          <select
            id="adv-piece-set"
            value={set()}
            onChange={(e) => setSet(e.currentTarget.value)}
            class="ml-auto min-h-[36px] rounded-lg bg-transparent text-sm text-slate-100"
          >
            <For each={PIECE_SETS}>
              {(name) => <option value={name}>{name}</option>}
            </For>
          </select>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <label
            for="adv-light"
            class="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/40 px-3 text-sm text-slate-300 ring-1 ring-inset ring-white/15"
          >
            Light
            <input
              id="adv-light"
              type="color"
              value={light()}
              onInput={(e) => setLight(e.currentTarget.value)}
              class="ml-auto h-7 w-10 cursor-pointer bg-transparent"
            />
          </label>
          <label
            for="adv-dark"
            class="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/40 px-3 text-sm text-slate-300 ring-1 ring-inset ring-white/15"
          >
            Dark
            <input
              id="adv-dark"
              type="color"
              value={dark()}
              onInput={(e) => setDark(e.currentTarget.value)}
              class="ml-auto h-7 w-10 cursor-pointer bg-transparent"
            />
          </label>
        </div>
      </div>
      <BoardFrame>
        <Chessboard
          options={{
            position: position(),
            onPieceDrop,
            pieces: pieces(),
            lightSquareStyle: { 'background-color': light() },
            darkSquareStyle: { 'background-color': dark() },
          }}
        />
      </BoardFrame>
      <ResetButton onClick={reset} />
    </div>
  );
}

/* -------------------------------- 4 · premoves ------------------------------ */

const SQUARE_RE = /^[a-h][1-8]$/;

function PremovesDemo() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [premove, setPremove] = createSignal<{
    from: string;
    to: string;
    color: 'w' | 'b';
  } | null>(null);
  const [note, setNote] = createSignal(
    'Set a reply while it is not your turn — it fires automatically.',
  );
  let fromEl!: HTMLInputElement;
  let toEl!: HTMLInputElement;

  const tryPremove = () => {
    const p = premove();
    if (!p || chess.turn() !== p.color) return;
    try {
      chess.move({ from: p.from, to: p.to, promotion: 'q' });
      setPosition(chess.fen());
      setNote('Premove played: ' + p.from + p.to + '.');
      setPremove(null);
    } catch {
      setNote('Premove no longer legal — dropped.');
      setPremove(null);
    }
  };

  const commitMove = (from: string, to: string): boolean => {
    try {
      chess.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    setPosition(chess.fen());
    tryPremove();
    return true;
  };

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    return commitMove(sourceSquare, targetSquare);
  };

  const set = () => {
    const from = fromEl.value.trim().toLowerCase();
    const to = toEl.value.trim().toLowerCase();
    if (!SQUARE_RE.test(from) || !SQUARE_RE.test(to) || from === to) {
      setNote('Use squares like g8 and f6.');
      return;
    }
    // a premove belongs to the side that is waiting
    const mover = chess.get(from as ChessSquare);
    if (!mover || mover.color === chess.turn()) {
      setNote('Pick a piece of the side that is waiting.');
      return;
    }
    setPremove({ from, to, color: mover.color });
    setNote(
      'Premove set: ' + from + to + ' for ' + (mover.color === 'w' ? 'White' : 'Black') + '.',
    );
  };

  const reset = () => {
    chess.reset();
    setPosition(chess.fen());
    setPremove(null);
    setNote('Set a reply while it is not your turn — it fires automatically.');
  };

  return (
    <div>
      <p class="mb-4 text-base font-semibold text-slate-200" role="status">
        {(chess.turn(), position(), note())}
      </p>
      <div class="mb-4 grid grid-cols-[1fr_1fr_auto] items-end gap-2">
        <label class="block text-sm text-slate-400">
          From
          <input
            ref={fromEl}
            placeholder="g8"
            maxlength={2}
            class="mt-1 min-h-[44px] w-full rounded-xl bg-black/40 px-3 text-sm text-slate-100 ring-1 ring-inset ring-white/15"
          />
        </label>
        <label class="block text-sm text-slate-400">
          To
          <input
            ref={toEl}
            placeholder="f6"
            maxlength={2}
            class="mt-1 min-h-[44px] w-full rounded-xl bg-black/40 px-3 text-sm text-slate-100 ring-1 ring-inset ring-white/15"
          />
        </label>
        <button
          type="button"
          onClick={set}
          class={`min-h-[44px] rounded-xl bg-emerald-400 px-4 text-sm font-bold text-[#04130c] transition hover:bg-emerald-300 ${FOCUS}`}
        >
          Set
        </button>
      </div>
      <BoardFrame>
        <Chessboard
          options={{
            position: position(),
            onPieceDrop,
            arrows: premove()
              ? [
                  {
                    startSquare: premove()!.from,
                    endSquare: premove()!.to,
                    color: '#f59e0b',
                  },
                ]
              : [],
          }}
        />
      </BoardFrame>
      <ResetButton onClick={reset} />
    </div>
  );
}

/* ---------------------------- 5 · custom rendering ------------------------- */

function RendererDemo() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [lastMove, setLastMove] = createSignal<[string, string] | null>(null);
  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    // eslint-disable-next-line no-console
    console.log('[dbg-renderer] drop', sourceSquare, targetSquare);
    if (!targetSquare) return false;
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      setLastMove([sourceSquare, targetSquare]);
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    chess.reset();
    setPosition(chess.fen());
    setLastMove(null);
  };

  return (
    <div>
      <BoardFrame>
        <ChessboardProvider
          options={{
            position: position(),
            onPieceDrop,
            showNotation: false,
            squareRenderer: ({ square, children }) => (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  'box-shadow':
                    lastMove() && lastMove()!.includes(square)
                      ? 'inset 0 0 0 3px rgba(217, 119, 6, 0.9)'
                      : 'none',
                }}
              >
                {children}
                <span
                  style={{
                    position: 'absolute',
                    right: '3px',
                    bottom: '1px',
                    'font-size': '10px',
                    'font-weight': '700',
                    opacity: '0.7',
                  }}
                >
                  {square}
                </span>
              </div>
            ),
          }}
        >
          <Chessboard />
        </ChessboardProvider>
      </BoardFrame>
      <p class="mt-3 text-sm text-slate-500">
        The renderer owns the inside of every square here: its own coordinate
        chips replace the built-in notation, and the last move gets a ring.
      </p>
      <ResetButton onClick={reset} />
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function AdvancedExamples() {
  return (
    <main>
      <Title>Advanced examples — solid-chessboard</Title>
      <h1 class="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        Advanced examples
      </h1>
      <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">
        Engine analysis, position setup, theming, premoves and custom squares.
        Every snippet runs live next to it.
      </p>

      <Example
        title="1 · Board analysis with Stockfish"
        text="A Web Worker runs the bundled lite engine (movetime 800 ms per position). Scores stream in live, normalized to White's perspective; the best move draws as an arrow you can play."
        code={SNIPPET_ANALYSIS}
        file="AnalysisBoard.tsx"
        demo="Render — play, the engine follows"
      >
        <AnalysisDemo />
      </Example>

      <Example
        title="2 · Spare pieces"
        text="Wrap a palette and a bare Chessboard in one ChessboardProvider. Spare pieces clone onto the board, board pieces relocate, and dragging one off the board deletes it."
        code={SNIPPET_SPARES}
        file="SetupEditor.tsx"
        demo="Render — build any position"
      >
        <SpareDemo />
      </Example>

      <Example
        title="3 · Piece styles and square colors"
        text="The pieces option swaps the whole sprite set (43 folders under /piece), while lightSquareStyle and darkSquareStyle recolor the board. Both apply live."
        code={SNIPPET_THEMES}
        file="ThemedBoard.tsx"
        demo="Render — restyle the board"
      >
        <ThemesDemo />
      </Example>

      <Example
        title="4 · Premoves"
        text="Store a standing order for the waiting side and fire it the moment the turn arrives. Illegal premoves are dropped with a note; the pending one shows as an amber arrow."
        code={SNIPPET_PREMOVE}
        file="PremoveGame.tsx"
        demo="Render — e.g. premove g8-f6, then play e4"
      >
        <PremovesDemo />
      </Example>

      <Example
        title="5 · Custom rendering"
        text="squareRenderer replaces each square's inner content. This one draws its own coordinate chips and rings the last move — return children to keep the default pieces."
        code={SNIPPET_RENDERER}
        file="CustomSquares.tsx"
        demo="Render — make a move"
      >
        <RendererDemo />
      </Example>
    </main>
  );
}
