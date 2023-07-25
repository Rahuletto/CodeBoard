// NextJS stuff
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { MouseEvent, memo, useEffect, useMemo, useState } from 'react';

// Styles
import boardStyles from '../../styles/Board.module.css';
import styles from '../../styles/Index.module.css';
// Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Our imports
import { MetaTags } from '../../components';
import { sudoFetch } from '../../utils/sudo-fetch';
import { BoardFile } from '../../utils/types/board';
import { Languages } from '../../utils/types/languages';
import { FetchResponse } from '../api/fetch';

// Database
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Skeleton
import Skeleton from 'react-loading-skeleton';

// Split window
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import BoardLoader from '../../components/BoardLoader';

// Lazy loading
const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {
  ssr: false,
});
const FileSelect = dynamic(() => import('../../components/FileSelect'), {
  ssr: false,
});

export function Embed({ id }: { id: string }) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  const [board, setBoard] = useState<FetchResponse>(null);
  const [fileName, setFileName] = useState('');
  const [btns, setBtns] = useState([]);
  const [file, setFile] = useState<BoardFile>(null);
  const [language, setLanguage] = useState<any>(null);

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');

    sudoFetch(supabase, id, true).then((b) => {
      if (!b) return router.push('/404');
      setBoard(b);
      setFileName(b.files[0].name);
    });
  }, []);

  useMemo(() => {
    if (board) {
      setFile(board.files.find((a: BoardFile) => a.name == fileName));
      if (!file) setFile(board.files[0]);

      setLanguage(
        loadLanguage(
          file?.language !== 'none' ? (file?.language as Languages) : 'markdown'
        )
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

      setBtns(fileButtons);
    }
  }, [fileName]);

  // DARK MODE & LIGHT MODE

  // Props
  const [height, setHeight] = useState(472);
  const [width, setWidth] = useState(1028);

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);

      const code = document.querySelector<HTMLElement>('.codeWrapper');
      code.style.height = height.toString();
      code.style.width = width.toString();
    });
  }, []);

  function handleCopies(event: MouseEvent, text: string) {
    var target = event.currentTarget;
    navigator.clipboard.writeText(text);
    target.classList.toggle('clicked-copy');
    setTimeout(() => {
      target.classList.toggle('clicked-copy');
    }, 5000);
  }

  return (
    <div>
      {board && (
        <MetaTags
          title="CodeBoard Embeds"
          description="Embed your code in your desired website as however you want with beautiful iframes"
          key={id}
        />
      )}

      <div
        className="codeWrapper"
        style={{
          borderRadius: '30px',
          border: '5px solid var(--background-dark)',
          position: 'inherit',
          width: width + 'px',
          height: height + 'px',
        }}>
        <div className="file-holder bin-copy">
          <div style={{ display: 'flex', gap: '12px' }}>
            {btns[0] ? (
              btns
            ) : (
              <div className={'fileSelect active-file'}>
                <button title="skeleton">
                  <Skeleton style={{ width: '100px' }} />
                </button>
              </div>
            )}
          </div>
          <div style={{ gap: '6px' }} className={boardStyles.copy}>
            {board && (
              <button
                title="Copy the whole program"
                style={{
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={(event) => {
                  handleCopies(event, file.value.toString());
                }}>
                Copy
              </button>
            )}

            <button
              style={{ height: '36px', display: 'flex', alignItems: 'center' }}
              title="Source"
              onClick={() => {
                router.push(`/bin/${id}`);
              }}>
              Source
            </button>
          </div>
        </div>

        <Allotment vertical={true} defaultSizes={[460, 40]}>
          <Allotment.Pane minSize={32} maxSize={460}>
            {file ? (
              <CodeBoard
                width={String(width)}
                height={String(height)}
                language={language}
                code={file.value}
                readOnly={true}
                theme={theme}
              />
            ) : (
              <BoardLoader />
            )}
          </Allotment.Pane>
          <Allotment.Pane minSize={20} className={styles.outputPane}>
            {file ? (
              <>
                <p className={styles.outputTxt}>LOGS</p>
                <CodeBoard
                  readOnly={true}
                  placeHolder={`No output logs here.`}
                  code={file.terminal}
                  output={true}
                  language={loadLanguage('shell')}
                  theme={theme}
                />
              </>
            ) : null}
          </Allotment.Pane>
        </Allotment>
      </div>

      <style>
        {`
        html,
        body {
          overflow: hidden;
          margin: 0;
          background: transparent;
          min-height: 0;
        }
        .cm-editor {
          height: 80vh;
        }
      `}
      </style>
    </div>
  );
}

export default memo(function EmbedPage({ id }: { id: string }) {
  return <Embed id={id} />;
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: { id: context.params.id } };
}