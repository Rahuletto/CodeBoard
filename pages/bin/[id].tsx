// NextJS Stuff
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import { GetServerSidePropsContext } from 'next';

// CodeMirror Language
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons
import { FaPlus, FaLink, FaCode } from 'react-icons-ng/fa';
import { GoShieldCheck, GoGitBranch, GoGear } from 'react-icons-ng/go';
import { CoCopy } from 'react-icons-ng/co';

// Our Imports
import CodeBoard from '../../components/Code';
import { BoardFile } from '../../utils/board';
import ThemeSwitch from '../../components/ThemeSwitch';
import Header from '../../components/Header';
import { FetchResponse } from '../api/fetch';

// Encrypt-Decrypt
import { AESDecrypt } from '../../utils/aes'

export default function Bin({ board } : { board: FetchResponse }) {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || "dark")
  }, [])

  useEffect(() => {
    if (!board) router.push('/404');
  }, [board]);


  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  let file = board.files.find((a: BoardFile) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage( // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
    file.language == 'none' ? 'markdown' : file.language
  );

  const fileButtons: JSX.Element[] = [];

  board.files.map((obj) => {
    if (obj.language == 'none') {
      obj.name = obj.name.split('.')[0] + '.md';
    }

    fileButtons.push(
      <div key={obj.name}>
        <div className="fileSelect">
          <button title={obj.name} onClick={() => setFileName(obj.name)}>{obj.name}</button>
        </div>
      </div>
    );
  });

  setTimeout(() => setBtns(fileButtons), 20);


  function handleCopies(event: MouseEvent, text: string) {
    var target = event.currentTarget
    navigator.clipboard.writeText(text);
    target.classList.toggle('clicked-copy')
    setTimeout(() => {
      target.classList.toggle('clicked-copy')
    }, 5000);
  }
  return (
    <div className={styles.container}>
      <Header title={board.name + "/CodeBoard"} description={board.description || "No Description. Just the source code."} />

      <main className={styles.main}>
        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <a title="New project" href="/" className="newProject mobile">
              <FaPlus />
            </a>
            <a title="New project" href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </a>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="grid">
          <button
            title="More info about the project"
            className="info mobile"
            onClick={(event) => {
              document.querySelector('.projectForm').classList.toggle('show');
              (event.target as HTMLElement).classList.toggle('opened');
            }}
          >
            <GoGear /> <span>Metadata</span>
          </button>
          <div className="projectForm">
            <div className="details">
              <form>
                <div className="formName">
                  <input
                    value={board.name}
                    readOnly
                    placeholder="Untitled."
                    name="project-name"
                  ></input>{' '}
                  {board.encrypted ? (
                    <GoShieldCheck className="enc icon" />
                  ) : null}
                </div>
                <textarea
                  value={board.description}
                  readOnly
                  placeholder="Enter a short description."
                  maxLength={128}
                  name="project-desc"
                ></textarea>
              </form>
            </div>
            <div className="tooltip">
              <button
                className="save"
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GoGitBranch style={{ marginRight: '12px' }} /> Fork
              </button>
              <span style={{ borderRadius: '12px' }} className="tooltiptext">
                Coming soon..
              </span>
            </div>
          </div>

          <div className="codeWrapper">
            <div className="file-holder bin-copy">
              <div style={{ display: 'flex', gap: '12px' }} >
                {btns}
              </div>
              <div className="copypasta">
                <button
                  title="Copy URL"
                  onClick={(event) => {
                    handleCopies(event, `${location.origin}/bin/${board.key}`);
                  }}
                >
                  <FaLink title="Copy URL" />
                </button>
                <button
                  
                  title="Embed the board"
                  onClick={(event) => {
                    handleCopies(event, `<iframe 
                    src="${location.origin}/embed/${board.key}" 
                    style="width: 1024px; height: 473px; border:0; transform: scale(1); overflow:hidden;" 
                    sandbox="allow-scripts allow-same-origin">
                  </iframe>`);
                  }}
                >
                  <FaCode title="Embed the board" />
                </button>

              </div>
            </div>
            <div className="codeButtons">
            <button
                  title="Copy the whole program"
                  onClick={(event) => {
                    handleCopies(event, file.value.toString());
                  }}
                >
                  Copy
                </button>
                <button
                  title="Open RAW file"
                  onClick={() => {
                    router.push(`/raw/${board.key}?file=${file.name}`)
                  }}
                >
                  Raw
                </button>
            </div>
            <CodeBoard
              language={language}
              code={file.value}
              readOnly={true}
              theme={theme}
              onChange={() => 'ok'}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const promiseBoard = await fetch(`https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`, { cache: 'no-cache' });

  if (promiseBoard.status == 200) {
    const maybeBoard: FetchResponse = await promiseBoard.json()
    let board: FetchResponse = maybeBoard;

    if (maybeBoard.encrypted) {
      try {
        const decryptedFiles = [];
  
        maybeBoard.files.forEach(f => {
          decryptedFiles.push({
            name: f.name,
            language: f.language,
            value: AESDecrypt(f.value)
          })
        })
  
        board = {
          name: maybeBoard.name,
          description: maybeBoard.description,
          files: decryptedFiles,
          key: maybeBoard.key,
          createdAt: maybeBoard.createdAt,
          status: 200,
          encrypted: true
        }
      } catch (err) { }
    }

    return { props: { board: board } }
  }
  else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}
