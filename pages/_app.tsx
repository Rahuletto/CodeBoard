// NextJS Stuff
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
import { FaUserAlt } from 'react-icons-ng/fa';
import Loader from '../components/Loader';

// Command Pallete
import CommandPalette, { filterItems, getItemIndex } from 'react-cmdk';
import { BiFile, BiRefresh } from 'react-icons-ng/bi';
import { Md2RobotExcited } from 'react-icons-ng/md2';
import { SiPrettier } from 'react-icons-ng/si';

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [search, setSearch] = useState('');

  const [theme, setTheme] = useState('');

  const filteredItems = filterItems(
    [
      {
        heading: 'Commands',
        id: 'cmd',
        items: [
          {
            id: 'theme',
            children: 'Change Theme',
            icon: theme == 'dark' ? 'SunIcon' : 'MoonIcon',
            closeOnSelect: false,
            onClick: () => {
              const theme = localStorage.getItem('theme');
              if (theme == 'light') {
                localStorage.setItem('theme', 'dark');
                setTheme('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                localStorage.setItem('theme', 'light');
                setTheme('light');
                document.documentElement.setAttribute('data-theme', 'light');
              }
              return true;
            },
          },
          {
            id: 'new-file',
            children: 'New File',
            disabled: ((router.pathname !== '/') && (router.pathname !== '/fork/[id]')),
            icon: BiFile,
            closeOnSelect: true,
            onClick: () => {
              document.getElementById('add-file')?.click();
            },
          },
          {
            id: 'pretty-file',
            children: 'Format File',
            disabled: ((router.pathname !== '/') && (router.pathname !== '/fork/[id]')),
            icon: SiPrettier,
            closeOnSelect: true,
            onClick: () => {
              document.getElementById('pretty')?.click();
            },
          },
          {
            id: 'restart',
            children: 'Restart',
            icon: BiRefresh,
            closeOnSelect: true,
            onClick: () => {
              router.reload();
            },
          },
        ],
      },
      {
        heading: 'Pages',
        id: 'pages',
        items: [
          {
            id: 'home',
            children: 'Home',
            icon: 'HomeIcon',
            closeOnSelect: true,
            href: "#",
            onClick: () => {
              router.push('/home');
            },
          },
          {
            id: 'new',
            children: 'New Board',
            icon: 'PlusIcon',
            closeOnSelect: true,
            href: "#",
            onClick: () => {
              router.push('/');
            },
          },
          {
            id: 'privacy-policy',
            children: 'Privacy policy',
            icon: 'EyeIcon',
            closeOnSelect: true,
            href: "#",
            onClick: () => {
              router.push('/privacy');
            },
          },
          {
            id: 'docs',
            children: 'API Docs',
            icon: Md2RobotExcited,
            href: "#",
            closeOnSelect: true,
            onClick: () => {
              router.push('/docs');
            },
          },
          {
            id: 'account',
            children: 'Account',
            closeOnSelect: true,
            href: "#",
            icon: FaUserAlt,
            onClick: () => {
              router.push('/account');
            },
          },
        ],
      },
    ],
    search
  );

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

    setTimeout(() => {
      NProgress.done();
      setLoading(false);
    }, 3000);

    setTheme(localStorage.getItem('theme'));
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.ctrlKey && event.shiftKey && event.key.toLowerCase() == 'p') ||
        (event.ctrlKey && event.key.toLowerCase() == 'g') ||
        (event.ctrlKey && event.key.toLowerCase() == 'k') ||
        event.key.toLowerCase() == 'f10'
      ) {
        event.preventDefault();
        event.stopPropagation();

        setCmd((currentValue) => {
          return !currentValue;
        });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        {loading && <Loader />}

        <CommandPalette
          search={search}
          onChangeSearch={setSearch}
          onChangeOpen={setCmd}
          isOpen={cmd}
          page={'root'}>
          <CommandPalette.Page id="root">
            {filteredItems.length ? (
              filteredItems.map((list) => (
                <CommandPalette.List key={list.id} heading={list.heading}>
                  {list.items.map(({ id, ...rest }) => (
                    <CommandPalette.ListItem
                      key={id}
                      index={getItemIndex(filteredItems, id)}
                      {...rest}
                    />
                  ))}
                </CommandPalette.List>
              ))
            ) : (
              <h2>No Results</h2>
            )}
          </CommandPalette.Page>
        </CommandPalette>

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
