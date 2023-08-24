// NextJS Stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useContextMenu } from 'react-contexify';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Index.module.css';

// Load Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Auth
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

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

// Our Imports
import { AESEncrypt } from '../utils/aes';
import { extensions } from '../utils/extensions';
import makeid from '../utils/makeid';
import { BoardFile } from '../utils/types/board';
import { Languages } from '../utils/types/languages';

import AddFile from '../components/AddFile';
import MetaTags from '../components/Metatags';

// Split pane
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { IconType } from 'react-icons-ng';
import BoardLoader from '../components/BoardLoader';
import { formatCode } from '../utils/prettier';

// Lazy loading
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const CodeBoard = dynamic(() => import('../components/CodeBoard'), {
  ssr: false,
});
const EditModal = dynamic(() => import('../components/EditModal'), {
  ssr: false,
});
const DropZone = dynamic(() => import('../components/DropZone'), {
  ssr: false,
});
const PrettierButton = dynamic(() => import('../components/PrettierButton'), {
  ssr: false,
});
const Features = dynamic(() => import('../components/Feature'), {
  ssr: false,
});
const InfoButton = dynamic(() => import('../components/InfoButton'), {
  ssr: false,
});
const CreateModal = dynamic(() => import('../components/CreateModal'), {
  ssr: false,
});
const FileSelect = dynamic(() => import('../components/FileSelect'), {
  ssr: false,
});
const Save = dynamic(() => import('../components/Save'), {
  ssr: false,
});

const Index: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  // ---------------------------------
  // ---------- S T A T E S ----------
  // ---------------------------------

  // Items ---------------------------------
  const [fileName, setFileName] = useState('untitled.js');
  const [btns, setBtns] = useState([]);

  // Validation ---------------------------------
  const [code, setCode] = useState('');

  // Themes ---------------------------------
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  // Inputs ---------------------------------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [encrypt, setEncrypt] = useState(true);
  const [vanish, setVanish] = useState(false);

  // Mobile ---------------------------------
  const [metadata, setMetadata] = useState(false);

  // For Drag and drop ---------------------------------
  const [drag, setDrag] = useState(false);

  // Saving ---------------------------------
  const [save, setSave] = useState(false);

  // Files ---------------------------------
  const [files, setFiles] = useState([
    {
      name: 'untitled.js',
      language: 'javascript',
      value: ``,
      terminal: ``,
    },
  ]);

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

  const onTerminal = React.useCallback(
    (value: string, viewUpdate: any) => {
      const changed = files.find((a) => a.name === fileName);
      changed.terminal = value;
      return;
    },
    [fileName]
  );

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

    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.key.toLowerCase() == 'n') {
        document.getElementById('add-file').click();
      } else if (event.key == 'F2') {
        keybindEdit(file);
      } else if (
        (event.shiftKey && event.altKey && event.key.toLowerCase() == 'f') ||
        (event.altKey && event.key.toLowerCase() == 'f')
      ) {
        formatCode(file.value, file.language).then((f) => {
          setCode(f);
          file.value = f;
        });
      } else if (event.key == 'Enter') {
        Array.from(document.getElementsByClassName('backdrop')).forEach((a) => {
          (a as HTMLElement).style.display = 'none';
        });
      }
    });
  }, []);

  // ---------------------------------------------

  // File Selector Effect ---------------------------------
  useMemo(() => {
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

  function keybindEdit(file: BoardFile) {
    const div = document.getElementsByClassName(
      `edit-${file.name.replaceAll('.', '-')}`
    )[0];

    const input = document.getElementsByClassName(
      `file-name-${file.name.replaceAll('.', '-')}`
    )[0];

    const back = document.querySelector<HTMLElement>(`.backdrop`);
    (div as HTMLElement).style['display'] = 'flex';
    (input as HTMLInputElement).focus();

    back.style['display'] = 'block';
  }

  // Drop Handler ---------------------------------
  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDrag(false);

    const fls = event.dataTransfer.files;
    uploadFile(fls);
  }

  async function uploadFile(fls: FileList) {
    let limit = 2;
    if (session) limit = 4;
    if (files.length >= limit) return;
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
      files: encryptedFiles,
      key: keyId,
      autoVanish: vanish,
      encrypt: encrypt,
      createdAt: Date.now(),
      author: session ? session?.user?.user_metadata?.provider_id : null,
    });

    navigator.clipboard.writeText(`${location.origin}/bin/${keyId}`);

    if (error) router.push('/500');
    else router.push(`/bin/${keyId}`);
  };

  // Find if its File ------------------------------------------------

  function isFile(dataTransfer: DataTransfer) {
    if (dataTransfer.types[0] == 'Files') return true;
    else false;
  }

  // ------------------------------------------------------------------

  const { show } = useContextMenu({
    id: 'input',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  return (
    <div className={generalStyles.container}>
      <MetaTags />

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

        <DropZone files={files} drag={drag} limit={session ? 2 : 1} />

        <Header drag={drag} theme={theme} setTheme={setTheme} />

        <CreateModal
          files={files}
          setFiles={setFiles}
          uploadFile={uploadFile}
        />

        <Features session={session} />

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
              <form
                className={[styles.detailsForm, 'projectDetails'].join(' ')}
                onSubmit={(event) => handleSubmit(event)}>
                <div className={styles.name}>
                  <input
                    onContextMenu={displayMenu}
                    style={{ fontWeight: '600' }}
                    value={title}
                    maxLength={25}
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
                  onContextMenu={displayMenu}
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
                        onContextMenu={() => {
                          setEncrypt(!encrypt);
                        }}
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
                disabled={file?.value == ''}
                onClick={(event) => {
                  (event.target as HTMLButtonElement).disabled = true;
                  (event.target as HTMLElement).style.background = 'var(--red)';
                  setMetadata(false);
                  setSave(true);
                  const form =
                    document.querySelector<HTMLFormElement>(`.projectDetails`);
                  form.requestSubmit();
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
                <AddFile files={files} limit={session?.user ? 2 : 1} />
              </div>
              <PrettierButton code={code} file={file} setCode={setCode} />
            </div>
            <Allotment vertical={true} defaultSizes={[420, 80]}>
              <Allotment.Pane minSize={62} maxSize={420}>
                {file ? (
                  <CodeBoard
                    styleProp={
                      drag
                        ? { pointerEvents: 'none' }
                        : { pointerEvents: 'auto' }
                    }
                    code={file.value}
                    readOnly={false}
                    language={language}
                    file={file}
                    theme={theme}
                    onChange={onChange}
                  />
                ) : (
                  <BoardLoader />
                )}
              </Allotment.Pane>
              <Allotment.Pane minSize={80} className={styles.outputPane}>
                {file ? (
                  <div className={styles.outputBox}>
                    <p className={styles.outputTxt}>LOGS</p>
                    <CodeBoard
                      styleProp={
                        drag
                          ? {
                              pointerEvents: 'none',
                              marginTop: '0px',
                              height: '76vh',
                            }
                          : {
                              pointerEvents: 'auto',
                              marginTop: '0px',
                              height: '76vh',
                            }
                      }
                      placeHolder={`\n>_ Share your logs with your code too.`}
                      code={file.terminal}
                      output={true}
                      readOnly={false}
                      language={loadLanguage('shell')}
                      theme={theme}
                      onChange={onTerminal}
                    />
                  </div>
                ) : null}
              </Allotment.Pane>
            </Allotment>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
