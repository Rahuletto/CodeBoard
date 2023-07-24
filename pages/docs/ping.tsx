//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Styles
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import Link from 'next/link';
import { CodeBoard } from '../../components';
import styles from '../../styles/Docs.module.css';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Footer = dynamic(() => import('../../components/Footer'), { ssr: false });
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

const Docs: NextPage = () => {
  const nodejs = `await fetch('https://codeboard.tech/api/ping')`;
  const cURL = `curl -X GET https://codeboard.tech/api/ping`;

  const [code, setCode] = useState(nodejs);


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
        title="Ping | CodeBoard API"
        description="Ping pong with the api"
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.land}>
          <div className={styles.pages}>
            <h4>Contents</h4>
            <div>
              <Link href="/docs">Introduction</Link>
              <Link href="/docs/npm">npm Package</Link>
              <Link className={styles.active} href="/docs/ping">
                Ping
              </Link>
              <Link href="/docs/teapot">Im a teapot</Link>
              <Link href="/docs/save">Save a board</Link>
              <Link href="/docs/fetch">Fetch a board</Link>
            </div>
          </div>

          <div className={styles.content}>
            <h1 style={{ fontSize: '48px' }}>Ping</h1>
            <p>
              Ping endpoint is a basic endpoint that every api service provides.
              This is a <span className="green">GET</span> method
              <br></br>This runs in an edge function.
            </p>

            <h3 className={styles.get}>/ping</h3>

            <br></br>
            <h3>Parameters</h3>
            <p>No Parameters</p>

            <h3>Example</h3>
            <p style={{ fontFamily: "var(--mono-font)" }}>Request</p>
            <div
              style={{
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                height: 'auto',
                padding: '0px 0px 27px 0px',
                background: 'var(--code-editor)',
                maxWidth: '700px',
              }}>
              <div className="file-holder">
                <div
                  className={[
                    'fileSelect',
                    code == nodejs ? 'active-file' : '',
                  ].join(' ')}>
                  <button
                    title="NodeJS implementation"
                    className="file"
                    onClick={() => {
                      setCode(nodejs);
                    }}>
                    Node.JS
                  </button>
                </div>
                <div
                  className={[
                    'fileSelect',
                    code == cURL ? 'active-file' : '',
                  ].join(' ')}>
                  <button
                    title="cURL implementation"
                    className="file"
                    onClick={() => {
                      setCode(cURL);
                    }}>
                    cURL
                  </button>
                </div>
              </div>
              <CodeBoard
                code={code}
                readOnly={true}
                language={
                  code == cURL
                    ? loadLanguage('shell')
                    : loadLanguage('javascript')
                }
                theme={theme}
              />
            </div>
            <br></br>
            <p style={{ fontFamily: "var(--mono-font)" }}>Response Output</p>

            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
              }}>
              <CodeBoard
                code={`Pong!`}
                readOnly={true}
                language={loadLanguage('shell')}
                theme={theme}
              />
            </div>
            <div className={styles.move}>
              <div
                onClick={() => router.push('/docs/')}
                className={styles.left}>
                <h2>Intro</h2>
                <p>/api</p>
              </div>
              <div
                onClick={() => router.push('/docs/teapot')}
                className={styles.right}>
                <h2>Im a teapot</h2>
                <p>/api/teapot</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
      <style>
        {`
          .cm-editor {
            height: auto;
          }
        `}
      </style>
    </div>
  );
};

export default Docs;
