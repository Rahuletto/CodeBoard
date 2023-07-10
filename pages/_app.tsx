// NextJS Stuff
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';

// Loader
import Loader from '../components/Loader';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  useEffect(() => {
    setTimeout(() => {
      const elem = document.querySelector<HTMLElement>('.loadScreen');
      if (elem) { 
        elem.style.opacity = "0";
        elem.style.display = "none"
      }
    }, 1700); // just read the fun things in the loading screen bruh

    setTimeout(
      () => {
        const elem = document.querySelector<HTMLElement>('.loadScreen');
        if (elem) elem.style.opacity = '0'; 
      },
      router.pathname == '/' ? 600 : 1600
    );
  }, []);

  const blacklist = [
    '/raw/[id]',
    '/embed/[id]',
    '/404',
    '/500',
    '/home',
    '/privacy',
    '/auth/signin',
    '/auth/error',
    '/docs',
    '/docs/fetch',
    '/docs/ping',
    '/docs/save',
    '/docs/teapot',
  ]; // blacklist these urls
  if (!blacklist.some((substring) => router.pathname.includes(substring))) {
    return (
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Loader />
        <Component {...pageProps} />
      </SessionContextProvider>
    );
  } else
    return (
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    );
}

export default MyApp;
