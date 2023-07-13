// NextJS Stuff
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

// Auth
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';
import React from 'react';

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
      return {
        redirect: {
          destination: '/500',
          permanent: false
        }
      }
    }

    //@ts-ignore
    return this.props.children;
  }
}
