//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';

// Styles
import { langs } from '@uiw/codemirror-extensions-langs';
import Link from 'next/link';
import styles from '../../styles/Docs.module.css';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Footer = dynamic(() => import('../../components/Footer'), { ssr: false });
const Header = dynamic(() => import('../../components/Header'), { ssr: true });
const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {
  ssr: true,
});

const Docs: NextPage = () => {
  const nodejs = `await fetch('https://codeboard.tech/api/teapot')`;
  const cURL = `curl -X GET https://codeboard.tech/api/teapot`;

  const [code, setCode] = useState(nodejs);

  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        docs={true}
        title="Teapot | CodeBoard API"
        description="I'm a teapot. This was an april fools joke."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.land}>
          <div className={styles.pages}>
            <h4>Contents</h4>
            <div>
              <Link href="/docs">Introduction</Link>
              <Link href="/docs/npm">npm Package</Link>
              <Link href="/docs/ping">Ping</Link>
              <Link className={styles.active} href="/docs/teapot">
                Im a teapot
              </Link>
              <Link href="/docs/save">Save a board</Link>
              <Link href="/docs/fetch">Fetch a board</Link>
            </div>
          </div>

          <div className={styles.content}>
            <h1 style={{ fontSize: '48px' }}>Im a teapot</h1>
            <p>
              Im a teapot, or Teapot status code is an old april fools joke
              which annoyed most of the developers. So we brought it to annoy
              you lol. This is just like ping endpoint but returns the status
              code <code>418</code>. This is a{' '}
              <span className="green">GET</span> method
              <br></br>This runs in an edge function.
            </p>

            <h3 className={styles.get}>/teapot</h3>

            <br></br>
            <h3>Parameters</h3>
            <p>No Parameters</p>

            <h3>Example</h3>
            <p style={{ fontFamily: 'var(--mono-font)' }}>Request</p>
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
                    ? langs.shell()
                    : langs.javascript()
                }
                theme={theme}
              />
            </div>
            <br></br>
            <p style={{ fontFamily: 'var(--mono-font)' }}>Response Output</p>

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
                code={`Im a teapot`}
                readOnly={true}
                language={langs.shell()}
                theme={theme}
              />
            </div>
            <div className={styles.move}>
              <div
                onClick={() => router.push('/docs/ping')}
                className={styles.left}>
                <h2>Ping</h2>
                <p>/api/ping</p>
              </div>
              <div
                onClick={() => router.push('/docs/save')}
                className={styles.right}>
                <h2>Save a board</h2>
                <p>/api/save</p>
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
