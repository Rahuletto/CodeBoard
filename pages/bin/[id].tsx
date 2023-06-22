// NextJS Stuff
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import { GoShieldCheck, GoGitBranch, GoGear } from 'react-icons-ng/go';

// Database
import Code from '../../model/code';

// Our Imports
import CodeBoard from '../../components/Code';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { ExtensionType } from '../../utils/extensions';
import ThemeSwitch from '../../components/ThemeSwitch';
import Header from '../../components/Header';
import Cryptr from 'cryptr'

export default function Bin({ board }: { board: any }) {
  const router = useRouter();
  const { id } = router.query;

  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_ENCRPT)
  console.log(board)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const { asPath } = useRouter();
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const URL = `${origin}${asPath}`;

  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(URL)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!board) router.push('/404');
  }, [board, id]);


  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  let file = board.files.find((a: ExtensionType) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage(
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
          <button onClick={() => setFileName(obj.name)}>{obj.name}</button>
        </div>
      </div>
    );
  });

  setTimeout(() => setBtns(fileButtons), 20);

  return (
    <div className={styles.container}>
      <Header title={board.name + "/CodeBoard"} description={board.description || "No Description. Just the source code."} />

      <main className={styles.main}>
        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <a href="/" className="newProject mobile">
              <FaPlus />
            </a>
            <a href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </a>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="grid">
          <button
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
                  {board.options[0]?.encrypt ? (
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
            <div className="file-holder board-copy">
              <div>{btns}</div>
              <div className="copypasta">
                <button
                  onClick={(event) => {
                    handleCopyClick();
                    (event.target as HTMLElement).innerHTML = 'Copied !';
                    (event.target as HTMLElement).style.background = 'var(--green)';
                    (event.target as HTMLElement).style.color = '#17191b';
                    setTimeout(() => {
                      (event.target as HTMLElement).innerHTML = 'Copy URL';
                      (event.target as HTMLElement).style.background = 'transparent';
                      (event.target as HTMLElement).style.color = 'var(--special-color)';
                    }, 5000);
                  }}
                >
                  Copy URL
                </button>
                <button
                  onClick={(event) => {
                    const iframe = `<iframe 
                      src="${location.origin}/embed/${board.key}" 
                      style="width: 1024px; height: 473px; border:0; transform: scale(1); overflow:hidden;" 
                      sandbox="allow-scripts allow-same-origin">
                    </iframe>`;

                    navigator.clipboard.writeText(iframe);
                    (event.target as HTMLElement).innerHTML = 'Copied !';
                    (event.target as HTMLElement).style.background = 'var(--green)';
                    (event.target as HTMLElement).style.color = '#17191b';
                    setTimeout(() => {
                      (event.target as HTMLElement).innerHTML = 'Embed';
                      (event.target as HTMLElement).style.background = 'transparent';
                      (event.target as HTMLElement).style.color = 'var(--special-color)';
                    }, 5000);
                  }}
                >
                  Embed
                </button>
                ;
              </div>
            </div>
            <CodeBoard
              language={language}
              code={cryptr.decrypt(file.value)}
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

export async function getServerSideProps(context: any) {
  fetch('https://cdeboard.vercel.app/api/connect');

  const promiseBoard = await fetch(`https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`);

  let board = await promiseBoard.json()

  if(board.status == 200) {
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
