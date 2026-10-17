import { MetaProvider, Title } from '@solidjs/meta';
import { A, Navigate, Route, Router, useLocation } from '@solidjs/router';
import { createEffect, For, Show } from 'solid-js';
import type { ParentProps } from 'solid-js';
import App from '../App';
import About from './About';
import DocsLayout from './docs/DocsLayout';
import BasicExamples from './docs/BasicExamples';
import AdvancedExamples from './docs/AdvancedExamples';
import FunctionsAndTypes from './docs/FunctionsAndTypes';
import { FOCUS, NAV } from '../utils/utils';
import { useHead } from '@unhead/solid-js';

const LINK = `flex min-h-[40px] items-center rounded-lg px-3.5 text-[16px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white ${FOCUS}`;

function Navbar() {
  return (
    <nav
      aria-label="Main"
      class="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F14]/75 py-2.5 backdrop-blur-xl"
    >
      <div class="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-5 sm:px-8">
        <A href="/" class={`mr-auto flex items-center gap-2.5 rounded-lg ${FOCUS}`}>
          <span class="text-lg font-bold tracking-tight">solid-chessboard</span>
        </A>
        <For each={NAV}>
          {(item) => (
            <Show
              when={item.hash}
              fallback={
                <A href={item.href} end class={LINK}>
                  {item.label}
                </A>
              }
            >
              {/* hash links point at a section, so they never get the "current page" style */}
              <a href={item.href} class={LINK}>
                {item.label}
              </a>
            </Show>
          )}
        </For>
        <span class="ml-2 hidden items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 sm:inline-flex">
          v0.1.3
        </span>
      </div>
    </nav>
  );
}

/** Rendered around every route, so the navbar is always on screen. */
function Layout(props: ParentProps) {
  const location = useLocation();

  // Scroll to a section after navigating to /#docs from another route.
  createEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    setTimeout(
      () => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }),
      60,
    );
  });

  return (
    <div class="min-h-screen bg-[#0B0F14] text-slate-100 antialiased">
      <Navbar />
      {props.children}
    </div>
  );
}

function NotFound() {
  return (
    <section class="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
      <Title>Page not found — solid-chessboard</Title>
      <h1 class="text-4xl font-bold tracking-tight">Page not found</h1>
      <p class="mt-4 text-lg text-slate-400">That address doesn't lead anywhere.</p>
      <A
        href="/"
        class={`mt-8 inline-flex min-h-[48px] items-center rounded-xl bg-emerald-400 px-6 font-bold text-[#04130c] transition hover:bg-emerald-300 ${FOCUS}`}
      >
        Back to home
      </A>
    </section>
  );
}

export default function AppProvider() {

    useHead({
    htmlAttrs: { lang: 'en' },
    title: 'solid-chessboard',
    titleTemplate: 'solid-chessboard', // e.g., "About — solid-chessboard"
    meta: [
      {
        name: 'description',
        content:
          'A highly customizable, performant drag-and-drop chessboard component for SolidJS.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'solid-chessboard' },
    ],
  });
  return (
    <MetaProvider>
      <Router root={Layout}>
        <Route path="/" component={App} />
        <Route path="/docs" component={DocsLayout}>
          <Route
            path="/"
            component={() => <Navigate href="/docs/basic-examples" />}
          />
          <Route path="/basic-examples" component={BasicExamples} />
          <Route path="/advanced-examples" component={AdvancedExamples} />
          <Route path="/functions-and-types" component={FunctionsAndTypes} />
        </Route>
        <Route path="/about" component={About} />
        <Route path="*404" component={NotFound} />
      </Router>
    </MetaProvider>
  );
}