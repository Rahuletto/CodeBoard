//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link'
// Styles
import styles from '../../styles/Docs.module.css';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { CodeBoard } from '../../components';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

const Docs: NextPage = () => {
  const nodejs = `const body = {\n  name: "Board name",\n  description: "The description of board",\n  files: [\n    {\n      name: "untitled.js",\n      language: "javascript",\n      value: "console.log('hello world')"\n    }\n  ]\n}\nconst JSONBody = JSON.stringify(body)\n\nawait fetch('https://codeboard.tech/api/save', {\n  method: "POST",\n  headers: {\n    "Content-Type": 'application/json',\n    "Authorization": "API-KEY"\n  },\n  body: JSONBody\n})`;
  const cURL = `curl -X POST -d '{"name": "Board name","description": "The description of board","files": [{"name":"untitled.js","language":"javascript","value":"console.log(\'hello world\')"}] }' -H 'Content-Type: application/json' -H 'Authorization: API-KEY'\n  https://codeboard.tech/api/save`;

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
        title="Save | CodeBoard API"
        description="Save a board to codeboard using your application"
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
              <Link href="/docs/teapot">Im a teapot</Link>
              <Link className={styles.active} href="/docs/save">
                Save a board
              </Link>
              <Link href="/docs/fetch">Fetch a board</Link>
            </div>
          </div>

          <div className={styles.content}>
            <h1 style={{ fontSize: '48px' }}>Save a board</h1>
            <p>
              This endpoint is used to save a board to the CodeBoard platform.
              This is a <span className="orange">POST</span> method
            </p>

            <h3 className={styles.post}>/save</h3>

            <br></br>
            <h3>Requires</h3>
            <p>Authorization Header with your API Key</p>
            <p>Request Body with project details</p>
            <p className="red">
              Failing to provide API Key will send <code>Unauthorized</code>{' '}
              response with status code <code className="orange">401</code>
            </p>
            <br></br>
            <h3>Parameters</h3>
            <p>
              No Parameters. But requires <span className="orange">POST</span>{' '}
              Body
            </p>
            <br></br>
            <h3>
              <span className="orange">POST</span> Body
            </h3>
            <div
              style={{
                marginTop: "20px",
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                maxWidth: '700px',
              }}>
              <CodeBoard
                code={`{\n  "name": "Board name",\n  "description": "The description of board",\n  "files": [\n    {\n      "name": "untitled.js",\n      "language": "javascript",\n      "value": "console.log('hello world')"\n    }\n  ]\n}
              `}
                readOnly={true}
                language={loadLanguage('json')}
                theme={theme}
              />
            </div>
            <br></br>
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
            <p style={{ fontFamily: "var(--mono-font)" }}>Response JSON</p>

            <div
              style={{
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                maxWidth: '700px',
              }}>
              <CodeBoard
                code={`{\n  "message": "Successfully created a board",\n  "board": "/bin/{key}",\n  "status": 201,\n  "created": true\n}`}
                readOnly={true}
                language={loadLanguage('json')}
                theme={theme}
              />
            </div>
            <div className={styles.move}>
              <div
                onClick={() => router.push('/docs/teapot')}
                className={styles.left}>
                <h2>Im a teapot</h2>
                <p>/api/teapot</p>
              </div>
              <div
                onClick={() => router.push('/docs/fetch')}
                className={styles.right}>
                <h2>Fetch a board</h2>
                <p>/api/fetch</p>
              </div>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '20px' }}>
          Made by <Link href="https://rahuletto.thedev.id">Rahuletto</Link>
        </footer>
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
