//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Styles
import styles from '../../styles/Docs.module.css';
import { CodeBoard } from '../../components';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import Link from 'next/link';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

const Docs: NextPage = () => {
  const nodejs = `await fetch('https://codeboard.tech/api/fetch?id=cEFTT17h', {\n  method: "GET",\n  headers: {\n    "Content-Type": 'application/json',\n    "Authorization": "API-KEY"\n  }\n})`;
  const cURL = `curl -X GET https://codeboard.tech/api/fetch?id=cEFTT17h -H 'Authorization: API-KEY'`;

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
        title="Fetch | CodeBoard API"
        description="Fetch a board from codeboard using your application"
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
              <Link href="/docs/save">Save a board</Link>
              <Link className={styles.active} href="/docs/fetch">
                Fetch a board
              </Link>
            </div>
          </div>

          <div className={styles.content}>
            <h1 style={{ fontSize: '48px' }}>Fetch a board</h1>
            <p>
              This endpoint is used to fetch a board from the CodeBoard
              platform. This is a <span className="green">GET</span> method
            </p>

            <h3 className={styles.get}>{'/fetch?id={id}'}</h3>

            <br></br>
            <h3>Requires</h3>
            <p>Authorization Header with your API Key</p>
            <p>Board ID as parameter</p>

            <p className="red">
              Failing to provide API Key will send <code>Unauthorized</code>{' '}
              response with status code <code className="orange">401</code>
            </p>
            <br></br>
            <h3>Parameters</h3>

            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Description</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>Fetch a board using its id</td>
                  <td className="green">true</td>
                </tr>
                <tr>
                  <td>key</td>
                  <td>Give your API Key as parameter instead of header</td>
                  <td className="orange">Required if not passed in headers</td>
                </tr>
              </tbody>
            </table>

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
                code={`{\n  "name": "Board name",\n  "description": "The description of board",\n  "files": [\n    {\n      "name": "untitled.js",\n      "language": "javascript",\n      "value": "console.log('hello world')"\n    }\n  ],\n  "key": "cEFTT17h",\n  "createdAt": 1687764312780,\n  "encrypt": true,\n  "autoVanish": false,\n  "fork": false,\n  "status": 200,\n}
              `}
                readOnly={true}
                language={loadLanguage('json')}
                theme={theme}
              />
            </div>
            <div className={styles.move}>
              <div
                onClick={() => router.push('/docs/save')}
                className={styles.left}>
                <h2>Save a board</h2>
                <p>/api/save</p>
              </div>
              <div style={{ opacity: '0' }} className={styles.right}></div>
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
