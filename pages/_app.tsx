// NextJS Stuff
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

// Auth
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';
import styles from '../styles/Index.module.css';

// Icons
import { FaHeartBroken } from 'react-icons-ng/fa';


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
        <Analytics />
      </SessionContextProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

class ErrorBoundary extends React.Component {
  state: Readonly<{ hasError: boolean }>;
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
      <div className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
      <div
        className={['details', 'error', 'droppy'].join(' ')}
        style={{ maxWidth: '400px', justifyContent: 'center' }}>
        <FaHeartBroken
                style={{ color: 'var(--red)', fontSize: '64px' }}
              />
        <h1 style={{ margin: '6px', textAlign: 'center' }}>ClientSideError</h1>
        <p className="error-text" style={{ fontSize: '18px' }}>
          This error didnt occur from cloud, server nor our database. Rather its from the Client {"(your browser)"} side. Please contact the owner.
        </p>
      </div>
    </div>
    }

    //@ts-ignore
    return this.props.children;
  }
}
