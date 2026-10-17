/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import 'solid-devtools';

// 1. Import Unhead's client setup
import { createHead, UnheadContext } from '@unhead/solid-js/client';

import AppProvider from './components/AppProvider';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// 2. Create the head instance
const head = createHead();

// 3. Wrap your AppProvider with UnheadContext.Provider
render(() => (
  <UnheadContext.Provider value={head}>
    <AppProvider />
  </UnheadContext.Provider>
), root!);