import { Title } from '@solidjs/meta';
import { For, Show, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { Chess, type Square as ChessSquare } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import type {
  PieceDropHandlerArgs,
  SquareHandlerArgs,
} from 'solid-chessboard';
import { BoardFrame, Example, ResetButton } from './Example';
import { FOCUS } from '../../utils/utils';

/* -------------------------------- snippets -------------------------------- */

const SNIPPET_STATIC = `import { Chessboard } from 'solid-chessboard';

function StaticBoard() {
  return (
    <Chessboard
      options={{
        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        allowDragging: false,
      }}
    />
  );
}`;

const SNIPPET_DRAG = `import { createSignal } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import type { PieceDropHandlerArgs } from 'solid-chessboard';

function DragGame() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());

  const onPieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false; // dropped off-board
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      return true;
    } catch {
      return false; // illegal move, piece snaps back
    }
  };

  return <Chessboard options={{ position: position(), onPieceDrop }} />;
}`;

const SNIPPET_CLICKS = `import { createSignal } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import type { SquareHandlerArgs } from 'solid-chessboard';

function ClickGame() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [selected, setSelected] = createSignal(null);
  const [hints, setHints] = createSignal([]);

  const select = (square) => {
    setSelected(square);
    setHints(chess.moves({ square: square, verbose: true }).map((m) => m.to));
  };

  const onSquareClick = ({ square, piece }) => {
    const from = selected();
    if (!from) {
      if (piece) select(square); // select a piece, hints appear
      return;
    }
    try {
      chess.move({ from: from, to: square, promotion: 'q' });
      setPosition(chess.fen());
    } catch {
      // illegal target: reselect or deselect
    }
    setSelected(null);
    setHints([]);
  };

  const squareStyles = () => {
    const styles = {};
    if (selected()) {
      styles[selected()] = { 'background-color': 'rgba(255, 213, 79, 0.55)' };
      for (const sq of hints()) {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(20, 85, 30, 0.55) 22%, transparent 22%)',
        };
      }
    }
    return styles;
  };

  return (
    <Chessboard
      options={{
        position: position(),
        onSquareClick: onSquareClick,
        squareStyles: squareStyles(),
      }}
    />
  );
}`;

const SNIPPET_PROMOTION = `import { createSignal, Show } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';

function PromotionGame() {
  const chess = new Chess('8/2P3k1/8/8/8/8/1K6/8 w - - 0 1');
  const [position, setPosition] = createSignal(chess.fen());
  // a pawn on its 7th rank moving to the last rank
  // opens the picker instead of auto-queening
  const [pending, setPending] = createSignal(null);

  const isPromoMove = (from, to) => {
    const piece = chess.get(from);
    if (!piece || piece.type !== 'p') return false;
    return to[1] === '8' || to[1] === '1';
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }) => {
    if (!targetSquare) return false;
    if (isPromoMove(sourceSquare, targetSquare)) {
      setPending({ from: sourceSquare, to: targetSquare });
      return true; // piece snaps back, the picker decides
    }
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      return true;
    } catch {
      return false;
    }
  };

  const promote = (choice) => {
    const p = pending();
    if (!p) return;
    chess.move({ from: p.from, to: p.to, promotion: choice });
    setPosition(chess.fen());
    setPending(null);
  };

  return (
    <div>
      <Chessboard options={{ position: position(), onPieceDrop: onPieceDrop }} />
      <Show when={pending()}>
        <div>
          <button onClick={() => promote('q')}>Queen</button>
          <button onClick={() => promote('r')}>Rook</button>
          <button onClick={() => promote('b')}>Bishop</button>
          <button onClick={() => promote('n')}>Knight</button>
          <button onClick={() => setPending(null)}>Cancel</button>
        </div>
      </Show>
    </div>
  );
}`;

/* Demo shells live in ./Example so every examples page shares them. */

/* --------------------------------- demos ---------------------------------- */

function StaticDemo(props: { orientation: 'white' | 'black' }) {
  return (
    <BoardFrame>
      <Chessboard
        options={{
          position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
          allowDragging: false,
          boardOrientation: props.orientation,
        }}
      />
    </BoardFrame>
  );
}

function DragDemo(props: { orientation: 'white' | 'black' }) {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [status, setStatus] = createSignal('White to move');

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      setStatus(chess.turn() === 'w' ? 'White to move' : 'Black to move');
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    chess.reset();
    setPosition(chess.fen());
    setStatus('White to move');
  };

  return (
    <div>
      <p class="mb-4 text-base font-semibold text-slate-200" role="status">
        {status()}
      </p>
      <BoardFrame>
        <Chessboard
          options={{
            position: position(),
            onPieceDrop,
            boardOrientation: props.orientation,
          }}
        />
      </BoardFrame>
      <ResetButton onClick={reset} />
    </div>
  );
}

function ClicksDemo(props: { orientation: 'white' | 'black' }) {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [selected, setSelected] = createSignal<string | null>(null);
  const [hints, setHints] = createSignal<string[]>([]);
  const [captures, setCaptures] = createSignal<string[]>([]);
  const [lastMove, setLastMove] = createSignal<[string, string] | null>(null);

  const select = (square: string) => {
    const moves = chess.moves({
      square: square as ChessSquare,
      verbose: true,
    });
    setSelected(square);
    setHints(moves.map((m) => m.to));
    setCaptures(moves.filter((m) => m.captured).map((m) => m.to));
  };

  const clearSelection = () => {
    setSelected(null);
    setHints([]);
    setCaptures([]);
  };

  const commitMove = (from: string, to: string): boolean => {
    try {
      chess.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    setPosition(chess.fen());
    setLastMove([from, to]);
    clearSelection();
    return true;
  };

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    return commitMove(sourceSquare, targetSquare);
  };

  const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
    const from = selected();
    if (!from) {
      if (piece) select(square);
      return;
    }
    if (square === from) {
      clearSelection();
      return;
    }
    if (commitMove(from, square)) return;
    if (piece) select(square);
    else clearSelection();
  };

  const squareStyles = () => {
    const styles: Record<string, { [k: string]: string }> = {};
    const lm = lastMove();
    if (lm) {
      styles[lm[0]] = { 'background-color': 'rgba(217, 119, 6, 0.45)' };
      styles[lm[1]] = { 'background-color': 'rgba(217, 119, 6, 0.45)' };
    }
    const sel = selected();
    if (sel) {
      styles[sel] = { 'background-color': 'rgba(255, 213, 79, 0.55)' };
      const caps = captures();
      for (const sq of hints()) {
        styles[sq] = caps.includes(sq)
          ? {
              background:
                'radial-gradient(circle, transparent 72%, rgba(220, 38, 38, 0.8) 72%)',
            }
          : {
              background:
                'radial-gradient(circle, rgba(20, 85, 30, 0.55) 22%, transparent 22%)',
            };
      }
    }
    return styles;
  };

  const reset = () => {
    chess.reset();
    setPosition(chess.fen());
    setLastMove(null);
    clearSelection();
  };

  return (
    <div>
      <BoardFrame>
        <Chessboard
          options={{
            position: position(),
            onPieceDrop,
            onSquareClick,
            squareStyles: squareStyles(),
            boardOrientation: props.orientation,
          }}
        />
      </BoardFrame>
      <ResetButton onClick={reset} />
    </div>
  );
}

const PROMO_FEN = '8/2P3k1/8/8/8/8/1K6/8 w - - 0 1';
const PROMO_CHOICES = [
  { choice: 'q', label: 'Queen' },
  { choice: 'r', label: 'Rook' },
  { choice: 'b', label: 'Bishop' },
  { choice: 'n', label: 'Knight' },
] as const;

function PromotionDemo(props: { orientation: 'white' | 'black' }) {
  const chess = new Chess(PROMO_FEN);
  const [position, setPosition] = createSignal(chess.fen());
  const [status, setStatus] = createSignal('Push the c-pawn to the last rank');
  const [pending, setPending] = createSignal<{
    from: string;
    to: string;
    color: 'w' | 'b';
  } | null>(null);

  const refreshStatus = () => {
    if (chess.isCheckmate()) {
      setStatus(
        'Checkmate, ' + (chess.turn() === 'w' ? 'Black' : 'White') + ' wins',
      );
    } else {
      setStatus((chess.turn() === 'w' ? 'White' : 'Black') + ' to move');
    }
  };

  const isPromoMove = (from: string, to: string) => {
    const piece = chess.get(from as ChessSquare);
    if (!piece || piece.type !== 'p') return false;
    const rank = to[1];
    return (
      (piece.color === 'w' && rank === '8') ||
      (piece.color === 'b' && rank === '1')
    );
  };

  const playMove = (
    from: string,
    to: string,
    promotion: 'q' | 'r' | 'b' | 'n' = 'q',
  ): boolean => {
    try {
      chess.move({ from, to, promotion });
    } catch {
      return false;
    }
    setPosition(chess.fen());
    refreshStatus();
    return true;
  };

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    const piece = chess.get(sourceSquare as ChessSquare);
    if (isPromoMove(sourceSquare, targetSquare)) {
      // accept the drop visually, then let the picker decide the piece
      setPending({
        from: sourceSquare,
        to: targetSquare,
        color: piece?.color ?? 'w',
      });
      return true;
    }
    return playMove(sourceSquare, targetSquare);
  };

  const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
    const p = pending();
    if (p) {
      // clicking anywhere else cancels an open picker implicitly
      if (square !== p.to) setPending(null);
      return;
    }
    if (!piece) return;
    // click-click promotion: select a pawn one step from glory
    const moves = chess.moves({
      square: square as ChessSquare,
      verbose: true,
    });
    const promo = moves.find((m) => isPromoMove(square, m.to));
    if (promo) {
      const mover = chess.get(square as ChessSquare);
      setPending({ from: square, to: promo.to, color: mover?.color ?? 'w' });
    }
  };

  const promote = (choice: 'q' | 'r' | 'b' | 'n') => {
    const p = pending();
    if (!p) return;
    playMove(p.from, p.to, choice);
    setPending(null);
  };

  const reset = () => {
    chess.load(PROMO_FEN);
    setPosition(chess.fen());
    setPending(null);
    setStatus('Push the c-pawn to the last rank');
  };

  return (
    <div>
      <p class="mb-4 text-base font-semibold text-slate-200" role="status">
        {status()}
      </p>
      <div class="relative" style={{ 'max-width': 'min(100%, 520px)' }}>
        <BoardFrame>
          <Chessboard
            options={{
              position: position(),
              onPieceDrop,
              onSquareClick,
              boardOrientation: props.orientation,
            }}
          />
        </BoardFrame>
        <Show when={pending()}>
          {(p) => (
            <div
              role="dialog"
              aria-label="Choose promotion piece"
              class="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/60 backdrop-blur-[2px]"
              onClick={() => setPending(null)}
            >
              <div
                class="rounded-2xl bg-[#121a22] p-4 ring-1 ring-white/15 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p class="mb-3 text-center text-sm font-semibold text-slate-200">
                  Promote to
                </p>
                <div class="flex gap-2">
                  <For each={PROMO_CHOICES}>
                    {(c) => (
                      <button
                        type="button"
                        onClick={() => promote(c.choice)}
                        aria-label={c.label}
                        title={c.label}
                        class={`h-16 w-16 rounded-xl bg-white/5 ring-1 ring-white/15 transition hover:scale-105 hover:bg-white/10 ${FOCUS}`}
                      >
                        <img
                          src={`/piece/cburnett/${p().color}${c.choice.toUpperCase()}.svg`}
                          alt={c.label}
                          class="h-full w-full p-1"
                          draggable={false}
                        />
                      </button>
                    )}
                  </For>
                </div>
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  class={`mt-3 min-h-[40px] w-full rounded-lg text-sm font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 ${FOCUS}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Show>
      </div>
      <ResetButton onClick={reset} />
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function BasicExamples() {
  // viewer control shared by every demo on this page (not part of the
  // snippets): flip all boards to inspect them from Black's side.
  const [orientation, setOrientation] = createSignal<'white' | 'black'>(
    'white',
  );

  return (
    <main>
      <Title>Basic examples — solid-chessboard</Title>
      <h1 class="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        Basic examples
      </h1>
      <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">
        Four small recipes that cover the everyday board: showing a position,
        moving pieces, highlighting moves, and promoting pawns. Every snippet
        runs live next to it.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setOrientation((o) => (o === 'white' ? 'black' : 'white'))
          }
          aria-label={`Flip boards, currently showing ${orientation()} at the bottom`}
          class={`inline-flex min-h-[44px] items-center rounded-xl bg-white/10 px-5 text-sm font-semibold text-slate-100 ring-1 ring-inset ring-white/15 transition hover:bg-white/15 ${FOCUS}`}
        >
          Flip boards
        </button>
        <span class="text-sm text-slate-500">
          Viewer control — the snippets stay as written.
        </span>
      </div>

      <Example
        title="1 · Display only"
        text="No handlers, no dragging. Pass a FEN string and set allowDragging to false for diagrams, puzzles and previews."
        code={SNIPPET_STATIC}
        file="StaticBoard.tsx"
        demo="Render"
      >
        <StaticDemo orientation={orientation()} />
      </Example>

      <Example
        title="2 · Drag and drop"
        text="The standard loop: onPieceDrop validates the move with your own rules and returns true to accept it. Illegal drops snap back, accepted ones animate."
        code={SNIPPET_DRAG}
        file="DragGame.tsx"
        demo="Render — drag either side"
      >
        <DragDemo orientation={orientation()} />
      </Example>

      <Example
        title="3 · Clicks and move highlights"
        text="onSquareClick drives selection: chess.js lists the legal targets, squareStyles paints the trail, the selected square and the hint dots. Dragging keeps working alongside."
        code={SNIPPET_CLICKS}
        file="ClickGame.tsx"
        demo="Render — click a piece, then a dot"
      >
        <ClicksDemo orientation={orientation()} />
      </Example>

      <Example
        title="4 · Promotion picker"
        text="Detect a pawn reaching the last rank, pause the commit, and let the user pick the piece. Push the c-pawn (or click it, then the last rank) to open the picker."
        code={SNIPPET_PROMOTION}
        file="PromotionGame.tsx"
        demo="Render — promote the c-pawn"
      >
        <PromotionDemo orientation={orientation()} />
      </Example>
    </main>
  );
}
