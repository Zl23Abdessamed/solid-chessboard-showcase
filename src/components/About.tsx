import { Title } from '@solidjs/meta';
import { A } from '@solidjs/router';
import { For } from 'solid-js';
import { TbOutlineBrandSolidjs } from 'solid-icons/tb';
import { FOCUS } from '../utils/utils';

const FEATURES = [
  { name: 'Drag and drop', text: 'Powered by @dnd-kit/solid.' },
  { name: 'Click to move', text: 'Handle moves yourself through callbacks.' },
  { name: 'Spare pieces', text: 'A palette of pieces that lives outside the board.' },
  { name: 'Arrows', text: 'Controlled through props, and drawn by users with a right-drag.' },
  { name: 'Move animations', text: 'Pieces glide from square to square.' },
  { name: 'Custom board sizes', text: 'Set chessboardRows and chessboardColumns.' },
  { name: 'Orientation flip', text: 'View the board from either side.' },
  { name: 'Full styling overrides', text: 'Restyle the board, squares and pieces.' },
  { name: 'Custom pieces', text: 'Swap the piece set with the pieces option.' },
  { name: 'Custom squares', text: 'Render your own squares with squareRenderer or squareStyles.' },
];

const UTILITIES = [
  'FEN to position-object conversion, and back',
  'Board generation',
  'Move diffing for animation',
  'Coordinate math',
];

export default function About() {
  return (
    <main>
      <Title>About — solid-chessboard</Title>

      <section class="mx-auto w-full max-w-4xl px-5 pb-10 pt-16 sm:px-8 lg:pt-24">
        <h1 class="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          About solid-chessboard
        </h1>
        <p class="mt-6 text-xl leading-relaxed text-slate-300">
          solid-chessboard is a chessboard component for SolidJS. It mirrors
          react-chessboard, with the same idea and the same kind of options,
          but it is built on Solid's signals instead of React's rendering model.
        </p>
        <p class="mt-5 text-lg leading-relaxed text-slate-400">
          It renders a responsive 2D board as a CSS grid of squares with SVG
          pieces, using the Cburnett set by default. You use it as{' '}
          <code class="rounded bg-black/40 px-1.5 py-0.5 text-slate-200">
            {'<Chessboard options={...} />'}
          </code>
          . The board is pure UI, so you bring the game rules, for example
          with chess.js.
        </p>
      </section>

      {/* why solid */}
      <section class="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <div class="flex flex-col gap-6 rounded-3xl bg-sky-400/[0.04] p-6 ring-1 ring-sky-300/20 sm:flex-row sm:items-start sm:p-8">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/30 shadow-[0_0_36px_-8px_rgba(56,189,248,0.6)]">
            <TbOutlineBrandSolidjs size={30} />
          </span>
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Why signals matter here</h2>
            <p class="mt-3 text-lg leading-relaxed text-slate-300">
              Thanks to fine-grained reactivity, moving a piece only updates the
              DOM nodes that are involved: the source square, the target square
              and the animated piece. The whole board and the component tree
              are not re-rendered.
            </p>
          </div>
        </div>
      </section>

      {/* features */}
      <section class="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">What it does</h2>
        <dl class="mt-8 grid gap-x-10 sm:grid-cols-2">
          <For each={FEATURES}>
            {(f) => (
              <div class="border-t border-white/10 py-5">
                <dt class="text-lg font-semibold text-slate-100">{f.name}</dt>
                <dd class="mt-1.5 text-base leading-relaxed text-slate-400">{f.text}</dd>
              </div>
            )}
          </For>
        </dl>
      </section>

      {/* utilities */}
      <section class="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Utility functions</h2>
        <p class="mt-3 text-lg text-slate-400">
          The package also exports helpers you can use on their own:
        </p>
        <ul class="mt-5 grid gap-3 text-base text-slate-300 sm:grid-cols-2">
          <For each={UTILITIES}>
            {(u) => (
              <li class="rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">{u}</li>
            )}
          </For>
        </ul>
      </section>

      <section class="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-4 px-5 pb-24 pt-10 sm:px-8">
        <A
          href="/docs/basic-examples"
          class={`inline-flex min-h-[52px] items-center rounded-xl bg-emerald-400 px-7 text-base font-bold text-[#04130c] shadow-[0_0_40px_-6px_rgba(52,211,153,0.45)] transition hover:bg-emerald-300 ${FOCUS}`}
        >
          Read the docs
        </A>
        <A
          href="/"
          class={`inline-flex min-h-[52px] items-center rounded-xl px-7 text-base font-semibold text-slate-200 ring-1 ring-white/15 transition hover:bg-white/5 ${FOCUS}`}
        >
          Back to home
        </A>
      </section>
    </main>
  );
}