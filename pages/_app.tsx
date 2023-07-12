// NextJS Stuff
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

    return (
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    );
}

export default MyApp;
