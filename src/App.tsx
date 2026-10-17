import { Title } from '@solidjs/meta';
import { createSignal, For } from 'solid-js';
import { Motion } from 'solid-motionone';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import type { PieceDropHandlerArgs } from 'solid-chessboard';
import { TbOutlineBrandSolidjs } from 'solid-icons/tb';
import { A } from '@solidjs/router';
import { NAV, FOCUS } from './utils/utils';
import { CodeBlock, CopyButton } from './components/CodeBlock';

/* ------------------------------- constants ------------------------------- */

const PMS = {
  npm: 'npm i solid-chessboard chess.js',
  pnpm: 'pnpm add solid-chessboard chess.js',
  yarn: 'yarn add solid-chessboard chess.js',
};

const BASIC_SNIPPET = `import { createSignal } from 'solid-js';
import { Chess } from 'chess.js';
import { Chessboard } from 'solid-chessboard';
import type { PieceDropHandlerArgs } from 'solid-chessboard';

function App() {
  // chess.js mutates in place, so the FEN string
  // (not the instance) is the signal
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

/* ------------------------------ small pieces ------------------------------

(CopyButton, CodeBlock and the tokenizer live in ./components/CodeBlock
so the examples page reuses the exact same blocks.) */

/* ---------------------------------- hero ---------------------------------- */

function HeroBoard() {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.15, easing: 'ease-out' }}
      class="relative mx-auto aspect-square w-full max-w-[520px]"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {/* glow behind the board */}
      <div
        class="gp absolute -inset-10 -z-10 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(56,189,248,.38), rgba(16,185,129,.12) 55%, transparent 75%)',
        }}
      />
      <div class="bf relative h-full w-full" style={{ 'transform-style': 'preserve-3d' }}>
        {/* board */}
        <div class="absolute inset-0 grid grid-cols-8 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
          <For each={Array.from({ length: 64 })}>
            {(_, i) => (
              <div
                class={
                  (i() + Math.floor(i() / 8)) % 2 === 0
                    ? 'bg-[#26343f]'
                    : 'bg-[#121a22]'
                }
              />
            )}
          </For>
        </div>

        {/* glowing Solid orb floating above the board */}
        <div
          class="pointer-events-none absolute inset-0 grid place-items-center"
          style={{ 'transform-style': 'preserve-3d' }}
        >
          <div
            class="ob relative rounded-full bg-[#0B0F14]/85 ring-1 ring-sky-300/40"
            style={{
              width: '34%',
              height: '34%',
              'box-shadow':
                '0 0 50px 10px rgba(56,189,248,.45), inset 0 0 28px rgba(56,189,248,.25)',
            }}
          >
            <div class="rs absolute -inset-3 rounded-full border border-dashed border-sky-300/50" />
            <TbOutlineBrandSolidjs
              class="h-full w-full p-[22%] text-sky-300"
              style={{ filter: 'drop-shadow(0 0 14px rgba(125,211,252,.95))' }}
            />
          </div>
        </div>
      </div>
    </Motion.div>
  );
}

/* ------------------------------- live demo -------------------------------- */

function BasicDemo() {
  const chess = new Chess();
  const [position, setPosition] = createSignal(chess.fen());
  const [status, setStatus] = createSignal('White to move');

  const onPieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    try {
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      setPosition(chess.fen());
      setStatus(
        chess.isCheckmate()
          ? `Checkmate, ${chess.turn() === 'w' ? 'Black' : 'White'} wins`
          : `${chess.turn() === 'w' ? 'White' : 'Black'} to move`,
      );
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <p class="mb-4 text-base font-semibold text-slate-200" role="status">
        {status()}
      </p>
      <div
        class="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]"
        style={{ 'max-width': 'min(100%, 600px)' }}
      >
        <Chessboard options={{ position: position(), onPieceDrop }} />
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function App() {
  const [pm, setPm] = createSignal<keyof typeof PMS>('npm');
  const cmd = () => PMS[pm()];
  const [copied, setCopied] = createSignal(false);

  const getStarted = async () => {
    try {
      await navigator.clipboard.writeText(PMS.npm);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <main>
      <Title>solid-chessboard</Title>

      {/* hero */}
      <section id="home" class="relative scroll-mt-20 overflow-x-clip">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_75%_35%,rgba(16,185,129,0.08),transparent),radial-gradient(40%_40%_at_10%_0%,rgba(56,189,248,0.08),transparent)]" />
        <div class="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, easing: 'ease-out' }}
          >
            <h1 class="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Chessboards that feel native to SolidJS
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              A highly customizable, performant drag-and-drop chessboard
              component for SolidJS, based on react-chessboard. Pure UI, with
              your game rules plugged in.
            </p>
            <div class="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#install"
                class={`inline-flex min-h-[52px] items-center rounded-xl bg-emerald-400 px-7 text-base font-bold text-[#04130c] shadow-[0_0_40px_-6px_rgba(52,211,153,0.45)] transition hover:bg-emerald-300 ${FOCUS}`}
              >
                Get started
              </a>
              <a
                href="#example"
                class={`inline-flex min-h-[52px] items-center rounded-xl px-7 text-base font-semibold text-slate-200 ring-1 ring-white/15 transition hover:bg-white/5 ${FOCUS}`}
              >
                Try the live board
              </a>
            </div>
          </Motion.div>
          <HeroBoard />
        </div>
      </section>

      {/* docs */}
      <section id="docs" class="scroll-mt-20 border-t border-white/10 bg-white/[0.015]">
        <div class="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in two steps
          </h2>

          {/* install */}
          <div id="install" class="mt-12 scroll-mt-24 max-w-3xl">
            <h3 class="text-2xl font-bold tracking-tight">Install</h3>
            <div class="mt-5 rounded-2xl bg-black/50 p-2 ring-1 ring-white/10">
              <div class="flex items-center gap-1 px-1 pb-2" role="group" aria-label="Package manager">
                <For each={Object.keys(PMS) as (keyof typeof PMS)[]}>
                  {(name) => (
                    <button
                      type="button"
                      aria-pressed={pm() === name}
                      onClick={() => setPm(name)}
                      class={`min-h-[40px] rounded-lg px-4 text-sm font-semibold transition ${FOCUS} ${
                        pm() === name
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {name}
                    </button>
                  )}
                </For>
                <CopyButton text={cmd()} class="ml-auto" />
              </div>
              <pre class="overflow-x-auto rounded-xl bg-[#080b0f] px-5 py-5 text-lg text-slate-200">
                <code>
                  <span class="text-amber-300">{cmd().split(' ')[0]}</span>{' '}
                  {cmd().split(' ').slice(1).join(' ')}
                </code>
              </pre>
            </div>
            <p class="mt-4 text-base leading-relaxed text-slate-400">
              <code class="rounded bg-black/40 px-1.5 py-0.5 text-slate-200">solid-js</code> is a
              peer dependency, and{' '}
              <code class="rounded bg-black/40 px-1.5 py-0.5 text-slate-200">chess.js</code>{' '}
              provides the game rules. The board itself is pure UI and holds no chess logic.
            </p>
          </div>

          {/* basic usage */}
          <div id="example" class="mt-20 scroll-mt-24">
            <h3 class="text-2xl font-bold tracking-tight">Basic usage</h3>
            <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
              Control the board with a{' '}
              <code class="rounded bg-black/40 px-1.5 py-0.5 text-slate-200">position</code> (FEN
              string or position object). Validate each drop with your own game logic and return{' '}
              <code class="rounded bg-black/40 px-1.5 py-0.5 text-slate-200">true</code> to accept
              it. The board animates to the new position on its own.
            </p>
            <div class="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
              <CodeBlock code={BASIC_SNIPPET} file="App.tsx" />
              <div class="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-6">
                <h4 class="text-lg font-bold">Live example</h4>
                <p class="mb-5 mt-1 text-base text-slate-400">
                  The snippet on the left, running. Illegal drops snap back.
                </p>
                <BasicDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* get started */}
      <section class="relative overflow-hidden border-t border-white/10">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(16,185,129,0.1),transparent)]" />
        <div class="relative mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
          <span class="grid h-14 w-14 place-items-center rounded-2xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/30 shadow-[0_0_40px_-6px_rgba(56,189,248,0.6)]">
            <TbOutlineBrandSolidjs size={30} />
          </span>
          <h2 class="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Put a board on your page
          </h2>
          <p class="mt-4 text-lg text-slate-400">
            One install, one signal, one handler. Copy the command and you are on your way.
          </p>
          <button
            type="button"
            onClick={getStarted}
            class={`mt-9 inline-flex min-h-[56px] items-center rounded-xl bg-emerald-400 px-9 text-lg font-bold text-[#04130c] shadow-[0_0_50px_-6px_rgba(52,211,153,0.5)] transition hover:bg-emerald-300 ${FOCUS}`}
          >
            {copied() ? 'Command copied' : 'Get started'}
          </button>
          <code class="mt-5 rounded-lg bg-black/40 px-3 py-1.5 text-sm text-slate-300">
            {PMS.npm}
          </code>
        </div>
      </section>

      {/* footer */}
      <footer class="border-t border-white/10">
        <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 text-sm text-slate-500 sm:px-8">
          <span class="flex items-center gap-2 font-semibold text-slate-300">
            solid-chessboard v0.1.3
          </span>
          <span class="mr-auto">Built with SolidJS, chess.js and Motion One.</span>
          <div class="flex gap-5">
            <For each={NAV}>
              {(item) => (
                <A
                  href={item.href}
                  class={`rounded text-slate-400 transition hover:text-white ${FOCUS}`}
                >
                  {item.label}
                </A>
              )}
            </For>
          </div>
        </div>
      </footer>
    </main>
  );
}