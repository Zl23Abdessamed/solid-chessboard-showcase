import { createSignal, For } from 'solid-js';
import { FOCUS } from '../utils/utils';

/* ----------------------------- code highlighter --------------------------- */

const TOKEN =
  /(\/\/.*$)|('[^']*')|\b(import|from(?!:)|const|return|function|if|try|catch|type|new|true|false)\b|(<\/?[A-Z]\w*|<\/?[a-z]+)|\b([A-Z]\w*)\b|\b([a-zA-Z_]\w*)(?=\()|(\b\d+\b)/g;

const TOKEN_CLASS = [
  'text-slate-500 italic', // comment
  'text-emerald-300', // string
  'text-violet-400', // keyword
  'text-sky-300', // jsx tag
  'text-amber-200', // type / component
  'text-amber-300', // function call
  'text-orange-300', // number
];

function tokenize(line: string) {
  const out: { t: string; c?: string }[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: line.slice(last, i) });
    const g = m.findIndex((v, k) => k > 0 && v !== undefined) - 1;
    out.push({ t: m[0], c: TOKEN_CLASS[g] });
    last = i + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out;
}

/* ------------------------------ small pieces ------------------------------ */

export function CopyButton(props: { text: string; class?: string }) {
  const [done, setDone] = createSignal(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      class={`min-h-[40px] rounded-lg px-3 text-sm font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white ${FOCUS} ${props.class ?? ''}`}
    >
      {done() ? 'Copied' : 'Copy'}
    </button>
  );
}

export function CodeBlock(props: { code: string; file: string }) {
  const lines = () => props.code.split('\n');
  return (
    <div class="overflow-hidden rounded-2xl bg-black/50 ring-1 ring-white/10 shadow-[0_24px_80px_-32px_rgba(16,185,129,0.2)]">
      <div class="flex items-center justify-between border-b border-white/10 bg-white/[0.03] py-2 pl-4 pr-2">
        <span class="text-sm font-medium text-slate-400">{props.file}</span>
        <CopyButton text={props.code} />
      </div>
      <pre class="overflow-x-auto py-4 text-[15px] leading-7 text-slate-200">
        <code class="block min-w-max">
          <For each={lines()}>
            {(line, i) => (
              <div class="flex px-4">
                <span class="w-8 shrink-0 select-none pr-4 text-right text-slate-600">
                  {i() + 1}
                </span>
                <span>
                  <For each={tokenize(line)}>
                    {(tok) => <span class={tok.c}>{tok.t}</span>}
                  </For>
                  {line === '' ? ' ' : ''}
                </span>
              </div>
            )}
          </For>
        </code>
      </pre>
    </div>
  );
}
