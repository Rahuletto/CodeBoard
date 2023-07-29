// NextJS Stuff
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEvent, useLayoutEffect, useMemo, useState } from 'react';

// Styles
import boardStyles from '../../styles/Board.module.css';
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Index.module.css';

// CodeMirror Language
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons
const FaLink = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/fa').then((mod) => mod.FaLink),
  { ssr: false }
);
const FaCode = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/fa').then((mod) => mod.FaCode),
  { ssr: false }
);
const FaPencilAlt = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/fa').then((mod) => mod.FaPencilAlt),
  { ssr: false }
);

const GoGitBranch = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/go').then((mod) => mod.GoGitBranch),
  { ssr: false }
);

const Md2RobotExcited = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/md2').then((mod) => mod.Md2RobotExcited),
  { ssr: false }
);

const LuShieldCheck = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuShieldCheck),
  { ssr: false }
);

// Our Imports
import MetaTags from '../../components/Metatags';
import { sudoFetch } from '../../utils/sudo-fetch';
import { BoardFile } from '../../utils/types/board';
import { Languages } from '../../utils/types/languages';
import { FetchResponse } from '../api/fetch';

// Auth
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';

// Skeleton
import Skeleton from 'react-loading-skeleton';

// Split window
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { IconType } from 'react-icons-ng';
import BoardLoader from '../../components/BoardLoader';
import { HiCheckBadge } from 'react-icons-ng/hi';
import {AiFillBug} from 'react-icons-ng/ai'
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

export default function Bin({
  id,
  board,
  madeBy,
}: {
  id: string;
  board: FetchResponse;
  madeBy: {
    verified: boolean;
    id: string;
    name: string;
    image: string;
    bug: boolean;
  } | null;
}) {
  const router = useRouter();
  const session = useSession();

  // Mobile ---------------------------------
  const [metadata, setMetadata] = useState(false);
  // -----------------------------------------

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  const [fileName, setFileName] = useState(board?.files[0]?.name);
  const [btns, setBtns] = useState([]);
  const [file, setFile] = useState<BoardFile>(board?.files[0]);
  const [language, setLanguage] = useState<any>(null);

  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
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
  }, [file, fileName]);

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
        title={board.name + ' | CodeBoard'}
        description={
          board.description || 'No Description. Just the source code.'
        }
        k={id + ''}
      />

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />
        {!session ||
        (board &&
          session &&
          session?.user?.user_metadata?.provider_id !== board.author) ? (
          <Warning />
        ) : null}

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

                {madeBy ? (
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: '12px',
                    }}>
                    <Image
                      width={32}
                      height={32}
                      style={{
                        borderRadius: 50,
                        border: '2px solid var(--purple-dark)',
                      }}
                      alt={'Made by user'}
                      src={madeBy.image}
                    />
                    <p style={{ margin: 0 }}>
                      Made by
                      <span
                        style={{
                          display: 'flex',
                          fontFamily: 'var(--mono-font)',
                          color: 'var(--purple-dark)',
                        }}>
                        {madeBy.name}
                        {madeBy.verified ? (
                          <HiCheckBadge
                            title="Verified"
                            style={{
                              marginLeft: '4px',
                              marginTop: '2px',
                              fontSize: '18px',
                              color: 'var(--purple-dark)',
                            }}
                          />
                        ) : madeBy.bug ? (
                          <AiFillBug
                            title="Bug Hunter"
                            style={{
                              marginLeft: '4px',
                              marginTop: '2px',
                              fontSize: '18px',
                              color: 'var(--purple-dark)',
                            }}
                          />
                        ) : null}
                      </span>
                    </p>
                  </div>
                ) : null}
              </form>
            </div>
            {board &&
            session &&
            session?.user?.user_metadata?.provider_id == board.author ? (
              <div className="tooltip">
                <button
                  className={styles.edit}
                  onClick={() => router.push(`/edit/${id}`)}
                  disabled={
                    session?.user?.user_metadata?.provider_id != board.author
                  }
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
                  Edit your board [BETA]
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
            <Allotment vertical={true} defaultSizes={[455, 40]}>
              <Allotment.Pane minSize={32} maxSize={460}>
                {file ? (
                  <CodeBoard
                    language={language}
                    code={file?.value}
                    readOnly={true}
                    theme={theme}
                    onChange={() => 'ok'}
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
                      code={file.terminal || ''}
                      output={true}
                      language={loadLanguage('shell')}
                      theme={theme}
                    />
                  </>
                ) : null}
              </Allotment.Pane>
            </Allotment>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createPagesServerClient(context);
  const board = await sudoFetch(supabase, context.params.id as string);
  if (!board)
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };

  let madeBy = null;

  if (board && board.author && board.author !== 'bot') {
    const { data: user } = await supabase
      .from('Users')
      .select('id, name, image, verified, bug')
      .eq('id', board.author)
      .limit(1)
      .single();
    if (user) madeBy = user;
  }

  return { props: { id: context.params.id, board: board, madeBy: madeBy } };
}
