import type { JSX } from 'solid-js';
import { CodeBlock } from '../CodeBlock';
import { FOCUS } from '../../utils/utils';

/* Shared docs building blocks (same styles on every examples page). */

export function DemoCard(props: { title: string; children: JSX.Element }) {
  return (
    <div class="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-6">
      <h4 class="text-lg font-bold">{props.title}</h4>
      <div class="mt-4">{props.children}</div>
    </div>
  );
}

export function BoardFrame(props: { children: JSX.Element }) {
  return (
    <div
      class="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]"
      style={{ 'max-width': 'min(100%, 520px)' }}
    >
      {props.children}
    </div>
  );
}

export function ResetButton(props: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-white/10 px-5 text-sm font-semibold text-slate-100 ring-1 ring-inset ring-white/15 transition hover:bg-white/15 ${FOCUS}`}
    >
      {props.label ?? 'Reset position'}
    </button>
  );
}

export function Example(props: {
  title: string;
  text: string;
  code: string;
  file: string;
  demo: string;
  children: JSX.Element;
}) {
  return (
    <section aria-label={props.title} class="mt-16 scroll-mt-24">
      <h3 class="text-2xl font-bold tracking-tight">{props.title}</h3>
      <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
        {props.text}
      </p>
      <div class="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <CodeBlock code={props.code} file={props.file} />
        <DemoCard title={props.demo}>{props.children}</DemoCard>
      </div>
    </section>
  );
}
