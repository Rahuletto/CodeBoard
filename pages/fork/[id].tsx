// NextJS Stuff
import type { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useLayoutEffect, useEffect, useState } from 'react';
// Styles
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Index.module.css';

// Load Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons from React-Icons-NG (Thanks 💖)
const LuShieldOff = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuShieldOff),
  { ssr: false }
);
const LuShieldCheck = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuShieldCheck),
  { ssr: false }
);
const LuTimer = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuTimer),
  { ssr: false }
);
const LuTimerOff = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuTimerOff),
  { ssr: false }
);

const GoGitBranch = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/go').then((mod) => mod.GoGitBranch),
  { ssr: false }
);

// Auth and Database
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

// Our Imports
import { extensions } from '../../utils/extensions';
import { BoardFile } from '../../utils/types/board';

import makeid from '../../utils/makeid';
import { sudoFetch } from '../../utils/sudo-fetch';
import { Languages } from '../../utils/types/languages';

import { FetchResponse } from '../api/fetch';

import AddFile from '../../components/AddFile';
import MetaTags from '../../components/Metatags';

// Split window
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

// Loading Skeleton
import { IconType } from 'react-icons-ng';
import BoardLoader from '../../components/BoardLoader';
import { useContextMenu } from 'react-contexify';
import { User } from '../../utils/types/user';

// Lazy loading
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {
  ssr: false,
});
const EditModal = dynamic(() => import('../../components/EditModal'), {
  ssr: false,
});
const DropZone = dynamic(() => import('../../components/DropZone'), {
  ssr: false,
});
const Features = dynamic(() => import('../../components/Feature'), {
  ssr: false,
});
const PrettierButton = dynamic(
  () => import('../../components/PrettierButton'),
  {
    ssr: false,
  }
);
const InfoButton = dynamic(() => import('../../components/InfoButton'), {
  ssr: false,
});
const CreateModal = dynamic(() => import('../../components/CreateModal'), {
  ssr: false,
});
const FileSelect = dynamic(() => import('../../components/FileSelect'), {
  ssr: false,
});
const Save = dynamic(() => import('../../components/Save'), {
  ssr: false,
});

export default function Fork({ board, madeBy }: { board: FetchResponse, madeBy: User }) {

  const { show } = useContextMenu({
    id: 'input',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }
  
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  // ---------------------------------
  // ---------- S T A T E S ----------
  // ---------------------------------

  // Items ---------------------------------
  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  // Validation ---------------------------------
  const [code, setCode] = useState('');

  // Themes ---------------------------------
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  // Inputs ---------------------------------
  const [title, setTitle] = useState(board.name + ' Fork');
  const [description, setDescription] = useState('Fork of ' + board.name);
  const [encrypt, setEncrypt] = useState(board.encrypt);
  const [vanish, setVanish] = useState(board.autoVanish);

  // Saving ---------------------------------
  const [save, setSave] = useState(false);

  // Mobile ---------------------------------
  const [metadata, setMetadata] = useState(false);

  // For Drag and drop ---------------------------------
  const [drag, setDrag] = useState(false);

  // Files ---------------------------------
  const [files, setFiles] = useState(board.files);

  let file = files.find((a) => a.name == fileName);
  if (!file) file = files[0];

  // Language initialization ---------------------------------
  const [language, setLanguage] = useState(
    loadLanguage(
      file.language == 'none' ? 'markdown' : (file.language as Languages)
    )
  );

  const keyId = makeid(8); // Assigning here so you cant spam a board to be saved with multiple keys

  // ---------------------------------
  // -------- C A L L B A C K --------
  // ---------------------------------

  const onChange = React.useCallback(
    (value: string, viewUpdate: any) => {
      if (file.language == 'none') setFileName(fileName.split('.')[0] + '.md');

      const changed = files.find((a) => a.name === fileName);

      changed.value = value;
      setCode(value);
      return;
    },
    [fileName]
  );

  const onTerminal = React.useCallback(
    (value: string, viewUpdate: any) => {
      const changed = files.find((a) => a.name === fileName);
      changed.terminal = value;

      return;
    },
    [fileName]
  );

  // ---------------------------------
  // --------- E F F E C T S ---------
  // ---------------------------------

  // Set Language ---------------------------------
  useEffect(() => {
    setLanguage(
      loadLanguage(
        file.language == 'none' ? 'markdown' : (file.language as Languages)
      )
    );
  }, [file.language]);

  // Set Themes ---------------------------------
  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  // File Selector Effect ---------------------------------
  useLayoutEffect(() => {
    const fileButtons: JSX.Element[] = [];

    const tmpFiles = [...files];
    tmpFiles.map((f) => {
      f.name = f.language == 'none' ? f.name.split('.')[0] + '.md' : f.name;

      fileButtons.push(
        <div key={f.name}>
          <FileSelect
            fileName={fileName}
            file={f}
            setFileName={setFileName}
            edit={true}
          />

          <EditModal
            fileName={fileName}
            setFileName={setFileName}
            currentFile={f}
            files={files}
            setFiles={setFiles}
          />
        </div>
      );
    });

    setTimeout(() => setBtns(fileButtons), 20);
  }, [fileName, files]);

  // ---------------------------------
  // ------- F U N C T I O N S -------
  // ---------------------------------

  // Drop Handler ---------------------------------
  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDrag(false);

    const fls = event.dataTransfer.files;
    uploadFile(fls);
  }

  async function uploadFile(fls: FileList) {
    if (files.length >= 2) return;
    if (!fls[0]) return;

    if (
      fls[0].type.startsWith('image/') ||
      fls[0].type.startsWith('video/') ||
      fls[0].type.startsWith('audio/')
    )
      return;

    const url = URL.createObjectURL(fls[0]);
    let name = fls[0].name.replaceAll(' ', '-');

    const blob = await fetch(url).then((r) => r.text());

    if (files.find((a) => a.name === name)) name = 'copy-' + name;

    const l =
      extensions.find((x) =>
        x.key.includes('.' + name.replace('.', '^').split('^')[1])
      )?.name ||
      extensions.find((x) =>
        x.key.includes('.' + name.split('.')[name.split('.').length - 1])
      )?.name ||
      'none';

    setFiles((f) => [
      ...f,
      {
        name: name,
        language: l,
        value: blob,
        terminal: ``,
      },
    ]);
  }

  // -----------------------------------------------

  // Edit Handler ---------------------------------

  function closeEdit() {
    const div = document.querySelectorAll(`div.edit`);
    const back = document.querySelector<HTMLElement>(`.backdrop`);

    div.forEach((cls) => {
      (cls as HTMLElement).style['display'] = 'none';
    });
    back.style['display'] = 'none';
  }

  // -----------------------------------------------

  // Handle Submit ---------------------------------
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const { AESEncrypt } = await import('../../utils/aes');

    let encryptedFiles: BoardFile[] = [];

    if (encrypt) {
      files.forEach((file) => {
        encryptedFiles.push({
          name: file.name,
          language: file.language,
          value: String(AESEncrypt(file.value)),
          terminal: String(AESEncrypt(file.terminal || '')),
        });
      });
    } else encryptedFiles = files;

    const { error } = await supabase.from('Boards').insert({
      name: title || 'Untitled',
      description: description || 'No Description',
      autoVanish: vanish,
      encrypt: encrypt,
      fork: { status: true, key: board.key, name: board.name },
      files: encryptedFiles,
      key: keyId,
      createdAt: Date.now(),
      author: session ? session?.user?.user_metadata?.provider_id : null,
    });

    if (error) router.push('/500');
    else router.push(`/bin/${keyId}`);
  };

  // Find if its File ---------------------------------
  function isFile(dataTransfer: DataTransfer) {
    if (dataTransfer.types[0] == 'Files') return true;
    else false;
  }

  // ------------------------------------------------------------------

  return (
    <div className={generalStyles.container}>
      <MetaTags title={'Forking'} description={'Forking a board'} />

      <main
        onDragEnter={(e) => {
          e.preventDefault();
          isFile(e.dataTransfer) ? setDrag(true) : null;
        }}
        onDragOver={(e) => {
          e.preventDefault();
          isFile(e.dataTransfer) ? setDrag(true) : null;
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          isFile(e.dataTransfer) ? setDrag(false) : null;
        }}
        onDrop={(e) => {
          isFile(e.dataTransfer) ? handleDrop(e) : null;
        }}
        className={generalStyles.main}>
        {save ? <Save /> : null}
        <div
          onClick={() => {
            closeEdit();
            const form = document.querySelector<HTMLFormElement>(`.editForm`);
            form.requestSubmit();
          }}
          className={[styles.backdrop, 'backdrop'].join(' ')}></div>

        <DropZone files={files} drag={drag} />

        <Header drag={drag} theme={theme} setTheme={setTheme} />

        <CreateModal
          files={files}
          setFiles={setFiles}
          uploadFile={uploadFile}
        />

        <Features session={session} user={madeBy} />

        <div
          className={[generalStyles.grid, 'grid', drag ? 'dragging' : ''].join(
            ' '
          )}>
          <InfoButton metadata={metadata} setMetadata={setMetadata} />
          <div
            className={[
              styles.project,
              'projectForm',
              metadata ? 'show' : null,
            ].join(' ')}>
            <div className={[styles.details, 'details'].join(' ')}>
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
                  href={`/bin/${board?.key}`}>
                  {board.name}
                </Link>
              </p>

              <form
                className={[styles.detailsForm, 'projectDetails'].join(' ')}
                onSubmit={(event) => handleSubmit(event)}>
                <div className={styles.name}>
                  <input
                  onContextMenu={displayMenu}
                    style={{ fontWeight: '600' }}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Untitled."
                    name="project-name"></input>{' '}
                  {encrypt ? (
                    <LuShieldCheck title="Encrypted" className="enc icon" />
                  ) : (
                    <LuShieldOff
                      title="Not Encrypted"
                      style={{ color: 'var(--red)' }}
                      className="enc icon"
                    />
                  )}
                </div>

                <textarea
                  style={{ fontWeight: '500' }}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter a short description."
                  maxLength={128}
                  name="project-desc"></textarea>

                <div className={styles.optionGrid}>
                  <div>
                    <div className="tooltip">
                      <p>AutoVanish</p>
                      <span className="tooltiptext">
                        Board will delete after a day.
                      </span>
                    </div>

                    <label className="switch">
                      <input
                      onContextMenu={() => setVanish(!vanish)}
                        checked={vanish}
                        onChange={() => setVanish(!vanish)}
                        type="checkbox"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div>
                    <p>Encryption</p>
                    <label className="switch">
                      <input
                      onContextMenu={() => setEncrypt(!encrypt)}
                        checked={encrypt}
                        onChange={() => {
                          setEncrypt(!encrypt);
                        }}
                        type="checkbox"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="tooltip">
              <button
                title="Save the board"
                className={styles.fork}
                disabled={code == ''}
                onClick={(event) => {
                  (event.target as HTMLButtonElement).disabled = true;
                  (event.target as HTMLElement).style.background = 'var(--red)';
                  setSave(true);
                  const form =
                    document.querySelector<HTMLFormElement>(`.projectDetails`);
                  form.requestSubmit();
                }}>
                Publish Fork
              </button>
              <span
                style={{ borderRadius: '12px' }}
                className="tooltiptext gridy">
                AutoVanish:{' '}
                {vanish ? (
                  <LuTimer
                    title="Auto delete"
                    style={{ opacity: 1, fontSize: '22px' }}
                    className="enc icon"
                  />
                ) : (
                  <LuTimerOff
                    title="Auto delete"
                    style={{
                      color: 'var(--red)',
                      opacity: 1,
                      fontSize: '22px',
                    }}
                    className="enc icon"
                  />
                )}
                Encryption:{' '}
                {encrypt ? (
                  <LuShieldCheck
                    title="Encrypted"
                    style={{ opacity: 1, fontSize: '22px' }}
                    className="enc icon"
                  />
                ) : (
                  <LuShieldOff
                    title="Not Encrypted"
                    style={{
                      color: 'var(--red)',
                      opacity: 1,
                      fontSize: '22px',
                    }}
                    className="enc icon"
                  />
                )}
              </span>
            </div>
          </div>

          <div className="codeWrapper">
            <div className="file-holder bin-copy">
              <div style={{ display: 'flex', gap: '12px' }}>
                {btns}
                <AddFile files={files} />
              </div>
              <PrettierButton code={code} file={file} setCode={setCode} />
            </div>
            <Allotment vertical={true} defaultSizes={[460, 40]}>
              <Allotment.Pane minSize={32} maxSize={460}>
                {file ? (
                  <CodeBoard
                    styleProp={
                      drag
                        ? { pointerEvents: 'none' }
                        : { pointerEvents: 'auto' }
                    }
                    language={language}
                    code={file.value}
                    readOnly={false}
                    theme={theme}
                    onChange={onChange}
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
                      readOnly={false}
                      placeHolder={`>_ Share your logs with your code too.`}
                      code={file.terminal || ''}
                      output={true}
                      language={loadLanguage('shell')}
                      theme={theme}
                      onChange={onTerminal}
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

    const {
      data
    } = await supabase.auth.getUser();

  let madeBy = null;
  if (data?.user) {
    const { data: user } = await supabase
      .from('Users')
      .select('id, name, image, verified, bug')
      .eq('id', data?.user?.id)
      .limit(1)
      .single();
    if (user) madeBy = user;
  }

  return { props: { board: board, madeBy: madeBy } };
}
