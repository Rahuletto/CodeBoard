//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Styles
import styles from '../../styles/Docs.module.css';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

const Docs: NextPage = () => {
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        docs={true}
        title="CodeBoard API"
        description="An API Used to access the future of code sharing platform with your applications"
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.land}>
          <div className={styles.pages}>
            <h4>Contents</h4>
            <div>
              <a className={styles.active} href="/docs">
                Introduction
              </a>
              <a href="/docs/npm">npm Package</a>
              <a href="/docs/ping">Ping</a>
              <a href="/docs/teapot">Im a teapot</a>
              <a href="/docs/save">Save a board</a>
              <a href="/docs/fetch">Fetch a board</a>
            </div>
          </div>

          <div className={styles.content}>
            <h1 style={{ fontSize: '48px' }}>API Documentation</h1>
            <p>
              In this page, we are going to learn how to use and access the
              CodeBoard features and implement it to your application
              <br></br>
              <br></br>
              If you have questions, feel free to{' '}
              <a href="/discord">contact us.</a>
            </p>
            <br></br>
            <h3>Endpoints</h3>
            <p>
              We currently support four endpoints for public use. These include
            </p>
            <ul>
              <li>
                <a href="/docs/ping">/ping</a>
              </li>
              <li>
                <a href="/docs/teapot">/teapot</a> {'(April fools joke)'}
              </li>
              <li>
                <a href="/docs/save">/save</a>
              </li>
              <li>
                <a href="/docs/fetch">/fetch</a>
              </li>
            </ul>

            <br></br>
            <h3>Getting Started</h3>
            <p>
              You can only access selected endpoints{' '}
              <span className="orange">without an API Key</span>. This is to
              prevent any anonymous DDoS attacks.
            </p>
            <p className="red">
              NOTE: API Keys should be stored privately. This should not be
              shared with anyone just like an account token. We will not be
              responsible for account deactivation.
            </p>
            <p>You can only access</p>
            <ul>
              <li>
                <a href="/docs/ping">/ping</a>
              </li>
              <li>
                <a href="/docs/teapot">/teapot</a>
              </li>
              <li>
                <a href="/docs/fetch">/fetch</a> {'(Returns an encrypted mess)'}
              </li>
            </ul>
            <p>
              You should note that{' '}
              <span className="orange">without an API Key</span>,{' '}
              <a href="/docs/fetch">/fetch</a> endpoint returns encrypted files
              instead of an usable decrypted counterpart. So{' '}
              <span className="green">
                we highly recommend getting an API Key.
              </span>
              <br></br>
              <span className="green">With API Key,</span> you can access all
              the endpoints provided including <a href="/docs/fetch">/fetch</a>{' '}
              endpoint which returns decrypted files when providing API Key.
            </p>

            <p>
              You can pass your API Key as{' '}
              <code className="green">Authorization</code> headers or by url
              parameter <code className="green">key</code>.
            </p>

            <p>
              All our endpoints return a{' '}
              <span className="green">
                <code>JSON</code>
              </span>{' '}
              with <span className="green">application/json</span> as
              Content-Type headers except the{' '}
              <span className="red">teapot</span> and{' '}
              <span className="red">ping</span> endpoints.
            </p>
            <h3 className={styles.baseUrl}>https://board.is-an.app/api</h3>
            <p>
              Get your API Key in{' '}
              <a href="/accounts" className="green">
                Accounts
              </a>{' '}
              page if youve signed in before.
            </p>
            <div className={styles.move}>
              <div style={{ opacity: 0 }} className={styles.left}></div>
              <div
                onClick={() => router.push('/docs/npm')}
                className={styles.right}>
                <h2>npm Package</h2>
                <p>@codeboard/api</p>
              </div>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '20px' }}>
          Made by <a href="https://rahuletto.thedev.id">Rahuletto</a>
        </footer>
      </main>
    </div>
  );
};

export default Docs;
