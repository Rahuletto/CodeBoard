// NextJS Stuff
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Auth
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Styles
import 'react-cmdk/dist/cmdk.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/globals.css';
import '../styles/loader.css';
import '../styles/mobile.css';

import styles from '../styles/Index.module.css';

// Icons
import { FaHeartBroken } from 'react-icons-ng/fa';

// Loader
import NProgress from 'nprogress';
import Loader from '../components/Loader';

// Command Pallete
const Command = dynamic(() => import('../components/Command'), { ssr: false });

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const handleStart = (url: string) => {
      NProgress.start();
      setLoading(true);
    };

    const handleStop = () => {
      NProgress.done();
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      Array.from(
        document.getElementsByClassName(
          event.ctrlKey ? 'ctrl' : event.altKey ? 'alt' : event.shiftKey ? "shift" : event.key
        )
      ).forEach((a) => {
        (a as HTMLElement).style.transform = 'scale(0.9)';
        (a as HTMLElement).style.opacity = "0.7"
      });
    })

    window.addEventListener('keyup', (event) => {
      Array.from(
        document.querySelectorAll(
          ".key span"
        )
      ).forEach((a) => {
        (a as HTMLElement).style.transform = 'scale(1)';
        (a as HTMLElement).style.opacity = "1"
      });
    })


    setTimeout(() => {
      NProgress.done();
      setLoading(false);
    }, 3000);
  }, []);

  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        {loading && <Loader />}
        <Command router={router} />
        <Component {...pageProps} />
        <Analytics />
      </SessionContextProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

class ErrorBoundary extends React.Component {
  declare state: Readonly<{ hasError: boolean }>;
  constructor(props: any) {
    super(props);

    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      <div
        style={{ zIndex: '2000' }}
        className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
        <div
          className={['details', 'error', 'droppy'].join(' ')}
          style={{ maxWidth: '400px', justifyContent: 'center' }}>
          <FaHeartBroken style={{ color: 'var(--red)', fontSize: '64px' }} />
          <h1 style={{ margin: '6px', textAlign: 'center' }}>
            ClientSideError
          </h1>
          <p className="error-text" style={{ fontSize: '18px' }}>
            This error didnt occur from cloud, server nor our database. Rather
            its from the Client {'(your browser)'} side. Please contact the
            owner.
          </p>
        </div>
      </div>;
    }

    //@ts-ignore
    return this.props.children;
  }
}
