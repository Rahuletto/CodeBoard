// NextJS Stuff
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Styles
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Index.module.css';
import boardStyles from '../../styles/Board.module.css';

// CodeMirror Language
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons
import { FaLink, FaCode, FaPencilAlt } from 'react-icons-ng/fa';
import { LuShieldCheck } from 'react-icons-ng/lu';
import { GoGitBranch } from 'react-icons-ng/go';
import { Md2RobotExcited } from 'react-icons-ng/md2';

// Our Imports
import { BoardFile } from '../../utils/types/board';
import { FetchResponse } from '../api/fetch';
import { sudoFetch } from '../../utils/sudo-fetch';
import { Languages } from '../../utils/types/languages';
import { MetaTags } from '../../components';

// Auth
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

// Skeleton
import Skeleton from 'react-loading-skeleton';

// Lazy loading
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

export default function Bin({ id }: { id: string }) {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  // Mobile ---------------------------------
  const [metadata, setMetadata] = useState(false);
  // -----------------------------------------

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  const [board, setBoard] = useState<FetchResponse>(null);
  const [fileName, setFileName] = useState('');
  const [btns, setBtns] = useState([]);
  const [file, setFile] = useState<BoardFile>(null);
  const [language, setLanguage] = useState<any>(null);

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');

    sudoFetch(supabase, id).then((b) => {
      if (!b) return router.push('/404');
      setBoard(b);
      setFileName(b.files[0].name);
    });
  }, []);

  useEffect(() => {
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
  });

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
      {board ? (
        <MetaTags
          title={board.name + '/CodeBoard'}
          description={
            board.description || 'No Description. Just the source code.'
          }
          k={id + ''}
        />
      ) : null}

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />
        {board &&
        session?.user?.user_metadata?.provider_id == board.author ? null : (
          <Warning />
        )}

        <div className={[generalStyles.grid, 'grid'].join(' ')}>
          <InfoButton metadata={metadata} setMetadata={setMetadata} />
          <div
            className={[
              styles.project,
              'projectForm',
              metadata ? 'show' : null,
            ].join(' ')}>
            <div className={[styles.details, 'details'].join(' ')}>
              {board && board.fork?.status ? (
                <p style={{ margin: 0 }}>
                  <GoGitBranch
                    title="Forked Project"
                    style={{ color: 'var(--purple-dark)', marginRight: '12px' }}
                  />{' '}
                  Forked from{' '}
                  <Link
                    style={{
                      background: 'var(--purple-dark)',
                      color: 'var(--background)',
                      borderRadius: '8px',
                      padding: '2px 6px',
                    }}
                    href={`/bin/${board.fork?.key}`}>
                    {board.fork?.name}
                  </Link>
                </p>
              ) : null}

              <form className={styles.detailsForm}>
                <div className={styles.name}>
                  {board ? (
                    <input
                      style={{ fontWeight: '600' }}
                      value={board.name}
                      readOnly
                      placeholder="Untitled."
                      name="project-name"></input>
                  ) : (
                    <h1 style={{ fontSize: '32px' }}>
                      <Skeleton style={{ width: '180px' }} />
                    </h1>
                  )}{' '}
                  {board && board.encrypt ? (
                    <LuShieldCheck title="Encrypted" className="enc icon" />
                  ) : null}
                  {board && board.bot ? (
                    <Md2RobotExcited
                      title="Created using API"
                      className="enc icon"
                      style={{ color: 'var(--purple)' }}
                    />
                  ) : null}
                </div>
                {board ? (
                  <textarea
                    style={{ fontWeight: '500' }}
                    value={board.description}
                    readOnly
                    placeholder="Enter a short description."
                    maxLength={128}
                    name="project-desc"></textarea>
                ) : (
                  <div
                    style={{
                      padding: '16px',
                      background: 'var(--background-dark)',
                      borderRadius: '18px',
                      height: '160px',
                    }}>
                    <Skeleton style={{ width: '180px' }} count={2} />
                    <Skeleton style={{ width: '80px' }} />
                  </div>
                )}
              </form>
            </div>
            {board &&
            session?.user?.user_metadata?.provider_id == board.author ? (
              <div className="tooltip">
                <button
                  className={styles.edit}
                  disabled={true}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FaPencilAlt
                    title={'Edit your board'}
                    style={{ marginRight: '12px' }}
                  />{' '}
                  Edit
                </button>
                <span style={{ borderRadius: '12px' }} className="tooltiptext">
                  Coming soon..
                </span>
              </div>
            ) : board ? (
              <div className="tooltip">
                <button
                  className={styles.fork}
                  onClick={() => router.push(`/fork/${id}`)}
                  disabled={board.fork?.status || board.bot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <GoGitBranch
                    title={
                      board.fork?.status
                        ? 'Forked boards cannot get forked again'
                        : board.bot
                        ? 'Boards by API cannot get forked'
                        : 'Fork the board'
                    }
                    style={{ marginRight: '12px' }}
                  />{' '}
                  Fork
                </button>
                <span style={{ borderRadius: '12px' }} className="tooltiptext">
                  {board.fork?.status
                    ? 'Forked boards cannot get forked again'
                    : 'Fork the board'}
                </span>
              </div>
            ) : null}
          </div>

          <div
            className="codeWrapper"
            style={{ height: '-webkit-fill-available' }}>
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
              <div className={boardStyles.copy}>
                <button
                  title="Copy URL"
                  onClick={(event) => {
                    handleCopies(event, `${location.origin}/bin/${id}`);
                  }}>
                  <FaLink title="Copy URL" />
                </button>
                <button
                  title="Embed the board"
                  onClick={(event) => {
                    handleCopies(
                      event,
                      `<iframe 
                    src="${location.origin}/embed/${id}" 
                    style="width: 1024px; height: 473px; border:0; transform: scale(1); overflow:hidden;" 
                    sandbox="allow-scripts allow-same-origin">
                  </iframe>`
                    );
                  }}>
                  <FaCode title="Embed the board" />
                </button>
              </div>
            </div>
            {board ? (
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
                    router.push(`/raw/${id}?file=${file.name}`);
                  }}>
                  Raw
                </button>
              </div>
            ) : null}
            {language ? (
              <CodeBoard
                language={language}
                code={file?.value}
                readOnly={true}
                theme={theme}
                onChange={() => 'ok'}
              />
            ) : (
              <div style={{ padding: '8px 20px' }}>
                <Skeleton style={{ width: '400px' }} />
                <br></br>
                <Skeleton style={{ width: '200px' }} />
                <Skeleton style={{ width: '300px' }} />
                <br></br>
                <Skeleton style={{ width: '600px' }} />
                <Skeleton style={{ width: '160px' }} />
                <Skeleton style={{ width: '60px' }} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: { id: context.params.id } };
}
