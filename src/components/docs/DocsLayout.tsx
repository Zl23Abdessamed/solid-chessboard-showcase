import { A } from '@solidjs/router';
import { For } from 'solid-js';
import type { ParentProps } from 'solid-js';
import { FOCUS } from '../../utils/utils';

const SECTIONS = [
  { href: '/docs/basic-examples', label: 'Basic examples' },
  { href: '/docs/advanced-examples', label: 'Advanced examples' },
  { href: '/docs/functions-and-types', label: 'Functions & data types' },
];

const LINK = `block min-h-[44px] rounded-xl px-4 py-2.5 text-[16px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white ${FOCUS}`;

/** Docs shell: sidebar on desktop, pill nav on mobile, route via children. */
export default function DocsLayout(props: ParentProps) {
  return (
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-8">
      <div class="grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-14">
        {/* mobile sub-navbar */}
        <nav
          aria-label="Docs sections"
          class="flex gap-2 overflow-x-auto pb-1 lg:hidden"
        >
          <For each={SECTIONS}>
            {(s) => (
              <A
                href={s.href}
                end
                activeClass="bg-white/10 text-white"
                class={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[16px] font-medium text-slate-400 ring-1 ring-white/10 ${FOCUS}`}
              >
                {s.label}
              </A>
            )}
          </For>
        </nav>

        {/* desktop sidebar */}
        <aside class="hidden lg:block">
          <nav
            aria-label="Docs sections"
            class="sticky top-24 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/10"
          >
            <p class="px-4 pb-2 pt-2 text-sm font-bold uppercase tracking-widest text-slate-500">
              Docs
            </p>
            <For each={SECTIONS}>
              {(s) => (
                <A href={s.href} end class={LINK}>
                  {s.label}
                </A>
              )}
            </For>
          </nav>
        </aside>

        <div class="min-w-0">{props.children}</div>
      </div>
    </div>
  );
}
