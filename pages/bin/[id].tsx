// NextJS Stuff
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


// Styles
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Index.module.css';
import boardStyles from '../../styles/Board.module.css';

// CodeMirror Language
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons
import { FaLink, FaCode } from 'react-icons-ng/fa';
import { LuShieldCheck } from 'react-icons-ng/lu';
import { GoGitBranch } from 'react-icons-ng/go';

// Our Imports
import { BoardFile } from '../../utils/board';
import { FetchResponse } from '../api/fetch';
import { MetaTags } from '../../components';

// Encrypt-Decrypt
import { AESDecrypt } from '../../utils/aes';

// Lazy loading

// WANTED TO COMBINE ALL LAZY IMPORTS WITH INDEX.TS BUT NEXTJS DONT ALLOW AAA
const Header = dynamic(() => import('../../components/Header'), { ssr: true });
const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {
  ssr: false,
});
const FileSelect = dynamic(() => import('../../components/FileSelect'), {
  ssr: false,
});
const Warning = dynamic(() => import('../../components/Warning'), {
  ssr: false,
});
const InfoButton = dynamic(() => import('../../components/InfoButton'), {
  ssr: false,
});

export default function Bin({ board }: { board: FetchResponse }) {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  useEffect(() => {
    if (!board) router.push('/404');
  }, [board]);

  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  // Mobile ---------------------------------
  const [metadata, setMetadata] = useState(false);

  let file = board.files.find((a: BoardFile) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage(
    // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
    file.language == 'none' ? 'markdown' : file.language
  );

  const fileButtons: JSX.Element[] = [];

  board.files.map((f) => {
    if (f.language == 'none') {
      f.name = f.name.split('.')[0] + '.md';
    }

    fileButtons.push(
      <div key={f.name}>
        <FileSelect
          fileName={fileName}
          file={f}
          setFileName={setFileName}
          edit={false}
        />
      </div>
    );
  });

  setTimeout(() => setBtns(fileButtons), 20);

  function handleCopies(event: MouseEvent, text: string) {
    var target = event.currentTarget;
    navigator.clipboard.writeText(text);
    target.classList.toggle('clicked-copy');
    setTimeout(() => {
      target.classList.toggle('clicked-copy');
    }, 5000);
  }

  return (
    <div className={generalStyles.container}>
      <MetaTags
        title={board.name + '/CodeBoard'}
        description={
          board.description || 'No Description. Just the source code.'
        }
        key={board.key}
      />

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />
        <Warning />

        <div className={[generalStyles.grid, 'grid'].join(' ')}>
          <InfoButton metadata={metadata} setMetadata={setMetadata} />
          <div
            className={[
              styles.project,
              'projectForm',
              metadata ? 'show' : null,
            ].join(' ')}>
            <div className={[styles.details, 'details'].join(' ')}>
              <form className={styles.detailsForm}>
                <div className={styles.name}>
                  <input
                    style={{ fontWeight: '600' }}
                    value={board.name}
                    readOnly
                    placeholder="Untitled."
                    name="project-name"></input>{' '}
                  {board.encrypted ? (
                    <LuShieldCheck title="Encrypted" className="enc icon" />
                  ) : null}
                </div>
                <textarea
                  style={{ fontWeight: '500' }}
                  value={board.description}
                  readOnly
                  placeholder="Enter a short description."
                  maxLength={128}
                  name="project-desc"></textarea>
              </form>
            </div>
            <div className="tooltip">
              <button
                className={styles.save}
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <GoGitBranch
                  title="Fork the board"
                  style={{ marginRight: '12px' }}
                />{' '}
                Fork
              </button>
              <span style={{ borderRadius: '12px' }} className="tooltiptext">
                Coming soon..
              </span>
            </div>
          </div>

          <div className="codeWrapper">
            <div className="file-holder bin-copy">
              <div style={{ display: 'flex', gap: '12px' }}>{btns}</div>
              <div className={boardStyles.copy}>
                <button
                  title="Copy URL"
                  onClick={(event) => {
                    handleCopies(event, `${location.origin}/bin/${board.key}`);
                  }}>
                  <FaLink title="Copy URL" />
                </button>
                <button
                  title="Embed the board"
                  onClick={(event) => {
                    handleCopies(
                      event,
                      `<iframe 
                    src="${location.origin}/embed/${board.key}" 
                    style="width: 1024px; height: 473px; border:0; transform: scale(1); overflow:hidden;" 
                    sandbox="allow-scripts allow-same-origin">
                  </iframe>`
                    );
                  }}>
                  <FaCode title="Embed the board" />
                </button>
              </div>
            </div>
            <div className={[boardStyles.inCode, 'codeCopy'].join(' ')}>
              <button
                title="Copy the whole program"
                onClick={(event) => {
                  handleCopies(event, file.value.toString());
                }}>
                Copy
              </button>
              <button
                title="Open RAW file"
                onClick={() => {
                  router.push(`/raw/${board.key}?file=${file.name}`);
                }}>
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
  const promiseBoard = await fetch(
    `https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`,
    { cache: 'force-cache' }
  );

  if (promiseBoard.status == 200) {
    const maybeBoard: FetchResponse = await promiseBoard.json();
    let board: FetchResponse = maybeBoard;

    if (
      (Number(maybeBoard.createdAt) + 86400 * 1000 < Date.now() &&
        maybeBoard?.autoVanish) ||
      maybeBoard?.files.length == 0
    )
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };

    if (maybeBoard.encrypted) {
      try {
        const decryptedFiles = [];

        maybeBoard.files.forEach((f) => {
          decryptedFiles.push({
            name: f.name,
            language: f.language,
            value: AESDecrypt(f.value),
          });
        });

        board = {
          name: maybeBoard.name,
          description: maybeBoard.description,
          files: decryptedFiles,
          key: maybeBoard.key,
          createdAt: maybeBoard.createdAt,
          status: 200,
          encrypted: maybeBoard.encrypted,
          autoVanish: maybeBoard?.autoVanish || false,
        };
      } catch (err) {
        console.log(err);
      }
    }

    return { props: { board: board } };
  } else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}
