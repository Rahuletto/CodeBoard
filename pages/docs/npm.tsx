//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';
import Link from 'next/link';

// Styles
import styles from '../../styles/Docs.module.css';

import { langs } from '@uiw/codemirror-extensions-langs';


// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {ssr: true});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../../components/Footer'), { ssr: false });
const Docs: NextPage = () => {
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
        title="NodeJS | CodeBoard API"
        description="A First-Party API wrapper to access the CodeBoard API and its internals."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.land}>
          <div className={styles.pages}>
            <h4>Contents</h4>
            <div>
              <Link href="/docs">Introduction</Link>
              <Link className={styles.active} href="/docs/npm">
                npm Package
              </Link>
              <Link href="/docs/ping">Ping</Link>
              <Link href="/docs/teapot">Im a teapot</Link>
              <Link href="/docs/save">Save a board</Link>
              <Link href="/docs/fetch">Fetch a board</Link>
            </div>
          </div>

          <div className={[styles.content, 'content'].join(' ')}>
            <h1 style={{ fontSize: '48px' }}>@codeboard/api</h1>
            <p>
              We have made a first-party api wrapper for Node.JS Projects that
              interact with the api with ease of use.
              <br></br>
              <br></br>
              If you have questions, feel free to{' '}
              <Link href="/discord">contact us.</Link>
            </p>
            <br></br>
            <h2>Installation</h2>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '26px',
                background: 'var(--code-editor)',
              }}>
              <CodeBoard
                code={`npm install @codeboard/api`}
                readOnly={true}
                language={langs.shell()}
                theme={theme}
              />
            </div>

            <br></br>

            <h2>Why @codeboard/api ?</h2>
            <ul>
              <li>
                First-party API Wrapper{' '}
                <span className="green">
                  {'(Made by the same dev as CodeBoard)'}
                </span>
              </li>
              <li>Much Efficient</li>
              <li>Easier approach</li>
              <li>Type safe</li>
              <li>Better Intellisense</li>
              <li>Lighter. No compromise on performance</li>
            </ul>

            <blockquote>
              All methods from the class returns a Promise so you should await
              it and should be located inside an{' '}
              <code style={{ color: 'var(--purple)' }}>async</code> function. Or
              your project should be configured to{' '}
              <Link
                style={{
                  color: 'var(--purple)',
                  background: 'var(--background-dark)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await">
                top-level await
              </Link>
            </blockquote>

            <h2 id="codeboard">Codeboard class</h2>
            <p>
              Access the future of code sharing platform with this first-party
              wrapper
            </p>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`const { CodeBoard } = require("@codeboard/api");\n\nconst board = new CodeBoard("API_KEY");`}
                readOnly={true}
                language={langs.javascript()}
                theme={theme}
              />
            </div>

            <p>
              Required: <code className="orange">API_KEY</code>
              <br></br>
              The API Key used to access the privileged endpoints like{' '}
              <code className="red">save</code> and{' '}
              <code className="red">fetch</code>. Get{' '}
              <Link className="green" href="/account">
                your key here
              </Link>
            </p>

            <h3>Types</h3>
            <br></br>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '26px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`new CodeBoard(key: string): CodeBoard`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <div className="splitter"></div>

            <h2 id="ping">{'CodeBoard.ping()'}</h2>
            <p>Get the ping latency of the api.</p>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`const { CodeBoard } = require("@codeboard/api");\nconst board = new CodeBoard("API_KEY");\n\nawait board.ping();`}
                readOnly={true}
                language={langs.javascript()}
                theme={theme}
              />
            </div>

            <blockquote>
              This returns a Promise so you should await it and should be
              located inside an{' '}
              <code style={{ color: 'var(--purple)' }}>async</code> function. Or
              your project should be configured to{' '}
              <Link
                style={{
                  color: 'var(--purple)',
                  background: 'var(--background-dark)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await">
                top-level await
              </Link>
            </blockquote>

            <h3>Types</h3>
            <br></br>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '26px',
                marginBottom: '20px',
                background: 'var(--code-editor)',
              }}>
              <CodeBoard
                code={`async ping(): Promise<number>`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <div className="splitter"></div>

            <h2 id="teapot">{'CodeBoard.teapot()'}</h2>
            <p>
              Im a teapot<br></br>A very old developers april joke.{' '}
              <span className="green">We {"won't"} let it fade away</span>
            </p>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`const { CodeBoard } = require("@codeboard/api");\nconst board = new CodeBoard("API_KEY");\n\nawait board.teapot();`}
                readOnly={true}
                language={langs.javascript()}
                theme={theme}
              />
            </div>

            <blockquote>
              This returns a Promise so you should await it and should be
              located inside an{' '}
              <code style={{ color: 'var(--purple)' }}>async</code> function. Or
              your project should be configured to{' '}
              <Link
                style={{
                  color: 'var(--purple)',
                  background: 'var(--background-dark)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await">
                top-level await
              </Link>
            </blockquote>

            <h3>Types</h3>
            <br></br>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                background: 'var(--code-editor)',
                borderRadius: '26px',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`async teapot(): Promise<"Im a teapot">`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <div className="splitter"></div>

            <h2 id="save">{'CodeBoard.save()'}</h2>
            <p>Save a board to the CodeBoard</p>
            <ul>
              <li>
                <h4>
                  Requires: <code className="red">API Key</code>
                </h4>
              </li>
              <li>
                <h4>
                  Ratelimits:{' '}
                  <span className="orange">
                    <code>20</code> per minute
                  </span>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`const { CodeBoard } = require("@codeboard/api");\nconst board = new CodeBoard("API_KEY");\n\nawait board.save({\n  name: "BOARD_NAME",\n  description: "BOARD_DESC",\n  files: [\n    {\n      name: "FILE_NAME",\n      language: "FILE_LANGUAGE_IN_FULLNAME",\n      value: "CODE_SNIPPET",\n    },\n  ],\n});`}
                readOnly={true}
                language={langs.javascript()}
                theme={theme}
              />
            </div>

            <blockquote>
              This returns a Promise so you should await it and should be
              located inside an{' '}
              <code style={{ color: 'var(--purple)' }}>async</code> function. Or
              your project should be configured to{' '}
              <Link
                style={{
                  color: 'var(--purple)',
                  background: 'var(--background-dark)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await">
                top-level await
              </Link>
            </blockquote>

            <h3>Types</h3>
            <br></br>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                background: 'var(--code-editor)',
                borderRadius: '26px',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`async save(body: SaveBody): Promise<SaveResponse>`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <ul>
              <li>
                <h4>
                  <code>SaveBody</code>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`{\r\n  name: string;\r\n  description?: string;\r\n  files: BoardFile[];\r\n}`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <ul>
              <li>
                <h4>
                  <code>SaveResponse</code>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`{\r\n  message: string;\r\n  board: string;\r\n  status: number;\r\n  created: boolean;\r\n  url: string;\r\n}`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <div className="splitter"></div>

            <h2 id="fetch">{'CodeBoard.fetch()'}</h2>

            <p>Fetch a board from the CodeBoard with a board id</p>
            <ul>
              <li>
                <h4>
                  Required: <code className="red">API Key</code>
                </h4>
              </li>
              <li>
                <h4>
                  Ratelimits:{' '}
                  <span className="orange">
                    <code>40</code> per minute
                  </span>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`const { CodeBoard } = require("@codeboard/api");\nconst board = new CodeBoard("API_KEY");\n\nawait board.fetch("BOARD_ID");`}
                readOnly={true}
                language={langs.javascript()}
                theme={theme}
              />
            </div>

            <blockquote>
              This returns a Promise so you should await it and should be
              located inside an{' '}
              <code style={{ color: 'var(--purple)' }}>async</code> function. Or
              your project should be configured to{' '}
              <Link
                style={{
                  color: 'var(--purple)',
                  background: 'var(--background-dark)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await">
                top-level await
              </Link>
            </blockquote>

            <h3>Types</h3>
            <br></br>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                background: 'var(--code-editor)',
                borderRadius: '26px',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`async fetch(id: string): Promise<FetchBody>`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <ul>
              <li>
                <h4>
                  <code>FetchBody</code>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`{\r\n  name: string;\r\n  description: string;\r\n  files: BoardFile[]; \/\/ BoardFile type shown below\r\n  url: string;\r\n  key: string;\r\n  createdAt: number;\r\n  encrypt: boolean;\r\n  autoVanish: boolean;\r\n  fork: {\r\n    status: boolean;\r\n    key: string;\r\n    name: string;\r\n  };\r\n  author?: string | null;\r\n  bot: boolean;\r\n  status: number; \/\/ HTTP Status Code\r\n}`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <ul>
              <li>
                <h4>
                  <code>BoardFile</code>
                </h4>
              </li>
            </ul>
            <div
              style={{
                maxWidth: '700px',
                height: 'auto',
                padding: '14px 6px',
                border: '5px solid var(--background-dark)',
                borderRadius: '38px',
                background: 'var(--code-editor)',
                marginBottom: '20px',
              }}>
              <CodeBoard
                code={`{\r\n  name: string;\r\n  language: string;\r\n  value: string;\r\n}`}
                readOnly={true}
                language={langs.typescript()}
                theme={theme}
              />
            </div>

            <div className="splitter"></div>

            <h1>Support</h1>
            <Link style={{ width: 'min-content' }} href="/support">
              Get help: https://codeboard.tech/support
            </Link>

            <p>{"Let's"} build a better community, together.</p>

            <div className={styles.move}>
              <div
                onClick={() => router.push('/docs/')}
                className={styles.left}>
                <h2>Intro</h2>
                <p>/api</p>
              </div>
              <div
                onClick={() => router.push('/docs/ping')}
                className={styles.right}>
                <h2>Ping</h2>
                <p>/api/ping</p>
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

          h2 {
            font-family: var(--mono-font);
            font-size: 32px;
            margin-top: 22px;
            margin-bottom: 8px;
          }

          h3 {
            font-family: var(--mono-font);
            color: var(--special-color);
          }

          h4 {
            margin: 0;
            font-size: 20px;
            font-family: var(--root-font);
          }

          .splitter {
            max-width: 700px;
          }
          .content a {
            color: var(--purple);
            background: var(--background-dark);
            padding: 2px 8px;
            border-radius: 8px;
            text-wrap: nowrap;
          }
        `}
      </style>
    </div>
  );
};

export default Docs;
