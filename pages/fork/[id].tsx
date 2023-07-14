// NextJS Stuff
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect, FormEvent } from 'react';
import dynamic from 'next/dynamic';

// Styles
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Index.module.css';

// Load Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons from React-Icons-NG (Thanks 💖)
import {
  LuShieldCheck,
  LuShieldOff,
  LuTimer,
  LuTimerOff,
} from 'react-icons-ng/lu';

// Our Imports
import { BoardFile } from '../../utils/types/board';
import { extensions } from '../../utils/extensions';
import { AddFile, MetaTags } from '../../components';
import { AESDecrypt } from '../../utils/aes';
import { FetchResponse } from '../api/fetch';
import makeid from '../../utils/makeid';
import { GoGitBranch } from 'react-icons-ng/go';
import { Languages } from '../../utils/types/languages';
import { useSession } from '@supabase/auth-helpers-react';

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

export default function Fork({ board }: { board: FetchResponse }) {
  const router = useRouter();
  const session = useSession();
  
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
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  // File Selector Effect ---------------------------------
  useEffect(() => {
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
        });
      });
    } else encryptedFiles = files;

    const data = {
      name: title || 'Untitled',
      description: description || 'No Description',
      autoVanish: vanish,
      encrypt: encrypt,
      fork: { status: true, key: board.key, name: board.name },
      files: encryptedFiles,
      key: keyId,
      createdAt: Date.now(),
      author: session ? session?.user?.user_metadata?.provider_id : null,
    };

    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/create';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_KEY,
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);

    const result = await response.json();
    if (result) router.push(`/bin/${keyId}`);
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
                  style={{ color: 'var(--green)', marginRight: '12px' }}
                />{' '}
                Forked from{' '}
                <a
                  style={{ color: 'var(--purple-dark)' }}
                  href={`/bin/${board.key}`}>
                  {board.name}
                </a>
              </p>

              <form
                className={[styles.detailsForm, 'projectDetails'].join(' ')}
                onSubmit={(event) => handleSubmit(event)}>
                <div className={styles.name}>
                  <input
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
                className={styles.save}
                disabled={code == ''}
                onClick={(event) => {
                  (event.target as HTMLButtonElement).disabled = true;
                  (event.target as HTMLElement).style.background = 'var(--red)';
                  const form =
                    document.querySelector<HTMLFormElement>(`.projectDetails`);
                  form.requestSubmit();
                  const backdrop =
                    document.querySelector<HTMLFormElement>(`.backdrop`);
                  backdrop.innerHTML = '<h1>Saving...</h1>';
                  backdrop.style['display'] = 'block';
                }}>
                Save
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
            <CodeBoard
              styleProp={
                drag ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }
              }
              language={language}
              code={file.value}
              readOnly={false}
              theme={theme}
              onChange={onChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=360, stale-while-revalidate=480'
  );

  const promiseBoard = await fetch(
    `https://board.is-an.app/api/fetch?id=${context.params.id}`,
    {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_KEY,
      },
    }
  );

  if (promiseBoard.status == 200) {
    const board: FetchResponse = await promiseBoard.json();

    if (
      (Number(board.createdAt) + 86400 * 1000 < Date.now() &&
        board?.autoVanish) ||
      board?.files.length == 0
    )
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };

    return { props: { board: board } };
  } else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}

export const runtime = 'edge';