// NextJS Stuff
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';

// Loader
import Loader from '../components/Loader';

// Session
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      const elem = document.querySelector<HTMLElement>('.loadScreen');
      if (elem) elem.style.display = 'none';
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
    '/docs/teapot'
  ]; // blacklist these urls
  if (!blacklist.some((substring) => router.pathname.includes(substring))) {
    return (
      <SessionProvider session={session}>
        <Loader />
        <Component {...pageProps} />
      </SessionProvider>
    );
  } else
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
}

export default MyApp;
