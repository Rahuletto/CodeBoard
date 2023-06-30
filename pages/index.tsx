// NextJS Stuff
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Index.module.css';

// Load Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons from React-Icons-NG (Thanks 💖)
import {
  FaPlus,
  FaCaretDown,
  FaBackward,
  FaCloudUploadAlt,
  FaWindowClose,
} from 'react-icons-ng/fa';
import {
  LuShieldCheck,
  LuShieldOff,
  LuTimer,
  LuTimerOff,
} from 'react-icons-ng/lu';
import { GoGear } from 'react-icons-ng/go';
import { SiPrettier } from 'react-icons-ng/si';

// Types
import { BoardFile } from '../utils/board';
import { extensions } from '../utils/extensions';

// Lazy loading
const CodeBoard = dynamic(() => import('../components/CodeBoard'), {
  ssr: false,
});
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });

const Index: NextPage = () => {
  const router = useRouter();

  // Items
  const [fileName, setFileName] = useState('untitled.js');
  const [btns, setBtns] = useState([]);

  // Validation
  const [code, setCode] = useState('');

  // mode
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  // Inputs
  const [title, setTitle] = useState('Untitled');
  const [description, setDescription] = useState('');
  const [encrypt, setEncrypt] = useState(true);
  const [vanish, setVanish] = useState(false);

  // Mobile
  const [metadata, setMetadata] = useState(false)

  // For Drag and drop
  const [drag, setDrag] = useState(false);

  const keyId = makeid(8);

  // Files
  const [files, setFiles] = useState([
    {
      name: 'untitled.js',
      language: 'javascript',
      value: ``,
    },
  ]);

  let file = files.find((a) => a.name == fileName);
  if (!file) file = files[0];

  const [language, setLanguage] = useState(
    // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
    loadLanguage(file.language == 'none' ? 'markdown' : file.language)
  );

  useEffect(() => {
    setLanguage(
      // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
      loadLanguage(file.language == 'none' ? 'markdown' : file.language)
    );
  }, [file.language]);

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

  useEffect(() => {
    function deleteFile(name: string) {
      const ff = files.filter(function (item) {
        return item.name !== name;
      });

      setFileName(ff[0].name);

      setFiles(ff);
    }

    const fileButtons: JSX.Element[] = [];

    const tmpFiles = [...files];

    tmpFiles.map((f) => {
      if (f.language == 'none') {
        f.name = f.name.split('.')[0] + '.md';
      }

      const cls = `edit-${f.name.replaceAll('.', '-')} edit`;
      fileButtons.push(
        <div key={f.name}>
          <button
            title={f.name}
            onClick={() => setFileName(f.name)}
            className={
              f.name === fileName ? 'fileSelect active-file' : 'fileSelect'
            }>
            <div>{f.name}</div>
            <div>
              <button className="file" title="Edit" onClick={() => showEdit(f)}>
                <FaCaretDown />
              </button>
            </div>
          </button>

          <div className={cls}>
            {' '}
            <form className="editForm" onSubmit={(event) => edit(event)}>
              <input
                onChange={(event) => updateEditLanguage(event, f.name)}
                className="file-name"
                name="filename"
                type="text"
                placeholder={f.name}
                autoComplete="off"></input>
              <p>
                <span
                  className={['language-show-edit', f.name + '-language'].join(
                    ' '
                  )}>
                  {f.language.charAt(0).toUpperCase() + f.language.slice(1)}
                </span>
              </p>

              <button
                title="Delete the file"
                disabled={files.length == 1}
                onClick={() => setTimeout(() => deleteFile(f.name), 400)}>
                Delete
              </button>
            </form>
          </div>
        </div>
      );
    });

    setTimeout(() => setBtns(fileButtons), 20);
  }, [fileName, files]);

  function closeEdit() {
    const div = document.querySelectorAll(`div.edit`);
    const back = document.querySelector<HTMLElement>(`.backdrop`);

    div.forEach((cls) => {
      (cls as HTMLElement).style['display'] = 'none';
    });
    back.style['display'] = 'none';
  }

  function showEdit(file: BoardFile) {
    const div = document.getElementsByClassName(
      `edit-${file.name.replaceAll('.', '-')}`
    )[0];
    const back = document.querySelector<HTMLElement>(`.backdrop`);
    (div as HTMLElement).style['display'] = 'flex';
    back.style['display'] = 'block';
  }

  function edit(event) {
    event.preventDefault();
    closeEdit();

    const input = document.querySelector<HTMLInputElement>(
      `.edit-${fileName.replaceAll('.', '-')}.edit form input`
    );
    if (!input) return;
    const name = input.value;

    const file = files.find((a) => a.name == fileName);

    const box = document.getElementsByClassName(`${fileName}-language`)[0];

    if (!name) return;
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      file.name = name;
      file.language = (
        (box as HTMLElement).innerText || box.textContent
      ).toLowerCase();

      setFileName(name);
    }
  }

  function updateEditLanguage(e: ChangeEvent<HTMLInputElement>, old) {
    const value = e.target.value;
    const box = document.getElementsByClassName(`${old}-language`)[0];

    if (!box) return;

    const l =
      extensions.find((x) =>
        x.key.includes('.' + value.replace('.', '^').split('^')[1])
      )?.name ||
      extensions.find((x) =>
        x.key.includes('.' + value.split('.')[value.split('.').length - 1])
      )?.name ||
      'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  function newFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dialog = document.querySelector<HTMLDialogElement>('dialog#newFile');
    const box = document.querySelector<HTMLElement>('.language-show');

    // @ts-ignore
    if (event.target[0].value == '') return dialog.close();
    // @ts-ignore
    const name = event.target[0].value;

    dialog.close(name);

    if (!name) return alert('Provide a valid name !');
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      setFiles((f) => [
        ...f,
        {
          name: name,
          language: (box.innerText || box.textContent).toLowerCase(),
          value: '',
        },
      ]);
    }
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

  function handleDrop(
    event: React.DragEvent<HTMLElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    setDrag(false);

    const fls = event.dataTransfer.files;
    uploadFile(fls)
  }

  function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.target;

    const fls = (target as EventTarget & HTMLInputElement).files;
    uploadFile(fls)
  }

  function showDialog() {
    const dialog = document.querySelector<HTMLDialogElement>('dialog#newFile');

    dialog.showModal();
  }

  function updateLanguage(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const box = document.querySelector('.language-show');

    const l =
      extensions.find((x) =>
        x.key.includes('.' + value.replace('.', '^').split('^')[1])
      )?.name || 'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  function isFile(dataTransfer: DataTransfer) {
    if (dataTransfer.types[0] == 'Files') return true;
    else false;
  }

  // HANDLE SUMBIT ----------------------------------------------------
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const { AESEncrypt } = await import('../utils/aes');

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
      options: [{ autoVanish: vanish, encrypt: encrypt }],
      files: encryptedFiles,
      key: keyId,
      createdAt: Date.now(),
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
  // ------------------------------------------------------------------------------

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
        <div
          onClick={() => {
            closeEdit();
            const form = document.querySelector<HTMLFormElement>(`.editForm`);
            form.requestSubmit();
          }}
          className={[styles.backdrop, 'backdrop'].join(' ')}></div>

        <div
          className={[
            styles.dropzone,
            styles.backdrop,
            drag ? 'droppy' : '',
          ].join(' ')}>
          <div className={[styles.dropNotif, 'dropNotif'].join(' ')}>
            <h2>{files.length >= 2 ? 'Oh no' : 'Drop it.'}</h2>
            <p>
              {files.length >= 2
                ? "You've reached the file limit."
                : "We'll handle the rest !"}
            </p>
            <div
              className={styles.fileUploadBox}
              style={{
                border: `3px dashed ${
                  files.length >= 2 ? 'var(--red)' : 'var(--background-darker)'
                }`,
                color:
                  files.length >= 2 ? 'var(--red)' : 'var(--special-color)',
              }}>
              <span style={{ fontSize: '64px', color: 'var(--special-color)' }}>
                {files.length >= 2 ? (
                  <FaWindowClose style={{ color: 'var(--red)' }} />
                ) : (
                  <FaCloudUploadAlt />
                )}
              </span>
              <p>
                {files.length >= 2
                  ? `There is a limit of 2 files per board at the moment. So we will not process this file. Delete one file and drop again.`
                  : ` We only accept program files and not images/audio/video. Just
                drop it we will handle the rest.`}
              </p>
            </div>
          </div>
        </div>

        <Header theme={theme} setTheme={setTheme} />

        <dialog id="newFile" open={false}>
          <div>
            <button
              title="Back"
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              onClick={() => {
                document.querySelector<HTMLDialogElement>('#newFile').close();
              }}
              className={styles.denyCreate}>
              <FaBackward />
            </button>
            <h2>Add new file</h2>
            <label
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              className={styles.upload}>
              <input
                type="file"
                id="file-upload"
                title="Upload"
                multiple={false}
                onChange={(event) => {
                  handleUpload(event);
                  document.querySelector<HTMLDialogElement>('#newFile').close();
                }}
              />
              <FaCloudUploadAlt title="Upload" />
            </label>
          </div>

          <form method="dialog" onSubmit={(event) => newFile(event)}>
            <input
              autoComplete="off"
              onChange={(event) => updateLanguage(event)}
              className="file-name"
              name="filename"
              type="text"
              placeholder="untitled.js"></input>
            <p>
              <span className="language-show">Javascript</span>
            </p>

            <button title="Create new file" className={styles.create}>
              Create
            </button>
          </form>
        </dialog>

        <div className={[generalStyles.grid, 'grid'].join(' ')}>
          <button
            title="More info about the project"
            className={["info", "mobile", (metadata ? 'opened' : null)].join(' ')}
            onClick={() => {
              setMetadata(!metadata)
            }}>
            <GoGear /> <span>Metadata</span>
          </button>
          <div className={[styles.project, 'projectForm', (metadata ? 'show' : null)].join(' ')}>
            <div className={[styles.details, 'details'].join(' ')}>
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
                    <LuShieldCheck className="enc icon" />
                  ) : (
                    <LuShieldOff
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
                disabled={code == '' && files.length <= 1}
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
                    style={{ opacity: 1, fontSize: '22px' }}
                    className="enc icon"
                  />
                ) : (
                  <LuTimerOff
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
                    style={{ opacity: 1, fontSize: '22px' }}
                    className="enc icon"
                  />
                ) : (
                  <LuShieldOff
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
                <div className="fileSelect plus active-file">
                  <button
                    title="New file"
                    disabled={files.length >= 2}
                    onClick={() => showDialog()}>
                    <FaPlus style={{ fontSize: '22px' }} />
                  </button>
                </div>
              </div>
              <div className={styles.prettier}>
                <button
                  title="Format the code"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '20px',
                  }}
                  onClick={(event) => {
                    const colors = ['#f8bc45', '#c596c7', '#56b3b4'];

                    formatCode(code, file.language)
                      .then((formatted) => {
                        file.value = formatted;
                        setCode(formatted);

                        (event.target as HTMLElement).style.color =
                          colors[Math.floor(Math.random() * colors.length)];

                        setInterval(() => {
                          (event.target as HTMLElement).style.color =
                            'var(--special-color)';
                        }, 5000);
                      })
                      .catch((err) => {
                        (event.target as HTMLElement).style.color = '#ea5e5e';
                        console.log(err);
                      });
                  }}>
                  <SiPrettier />
                </button>
              </div>
            </div>
            <CodeBoard
              style={
                drag ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }
              }
              code={file.value}
              readOnly={false}
              language={language}
              theme={theme}
              onChange={onChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

// Formatting code with Prettier
const formatCode = async (code: string, language: string) => {
  const prettier = await import('prettier/standalone');
  const babylonParser = await import('prettier/parser-babel');
  const css = await import('prettier/parser-postcss');
  const html = await import('prettier/parser-html');
  const angular = await import('prettier/parser-angular');
  const markdown = await import('prettier/parser-markdown');
  const typescript = await import('prettier/parser-typescript');
  const yaml = await import('prettier/parser-yaml');

  let parser = 'babel';

  switch (language) {
    case 'angular':
      parser = 'angular';
      break;
    case 'css':
      parser = 'css';
      break;
    case 'markdown':
    case 'mdx':
      parser = 'markdown';
      break;
    case 'html':
      parser = 'html';
      break;
    case 'typescript':
    case 'tsx':
      parser = 'typescript';
      break;
    case 'yaml':
      parser = 'yaml';
      break;
    default:
      parser = 'babel';
      break;
  }

  return prettier.format(code, {
    parser: parser,
    plugins: [babylonParser, css, html, markdown, typescript, yaml, angular],
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    bracketSameLine: true,
    endOfLine: 'auto',
  });
};

// Generate ID key for boards
const makeid = (length: number) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
