// NextJS Stuff
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import styles from '../styles/Home.module.css';

// Load Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons from React-Icons-NG (Thanks 💖)
import { FaPlus, FaCaretDown, FaBackward } from 'react-icons-ng/fa';
import { GoShieldCheck, GoShieldSlash, GoGear } from 'react-icons-ng/go';
import { VscNewFile } from 'react-icons-ng/vsc';
import { LuTimer, LuTimerOff } from 'react-icons-ng/lu';
import { SiPrettier } from 'react-icons-ng/si';

// Our Imports
import { extensions } from '../utils/extensions';
import CodeBoard from '../components/Code';
import { BoardFile } from '../utils/board';
import ThemeSwitch from '../components/ThemeSwitch';
import Header from '../components/Header';

// Encrypt
import Cryptr from 'cryptr'

const Home: NextPage = () => {
  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_ENCRPT);
  const router = useRouter();

  // Items
  const [fileName, setFileName] = useState('untitled.js');
  const [btns, setBtns] = useState([]);

  // Validation
  const [code, setCode] = useState('');

  // mode
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Inputs
  const [title, setTitle] = useState('Untitled');
  const [description, setDescription] = useState('');
  const [encrypt, setEncrypt] = useState(true);
  const [vanish, setVanish] = useState(false);

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

  const [language, setLanguage] = useState( // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
    loadLanguage(file.language == 'none' ? 'markdown' : file.language)
  );

  useEffect(() => {
    setLanguage( // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
      loadLanguage(file.language == 'none' ? 'markdown' : file.language)
    );
  }, [file.language]);

  const onChange = React.useCallback(
    (value: string, viewUpdate: any) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

    tmpFiles.map((file) => {
      if (file.language == 'none') {
        file.name = file.name.split('.').join('-') + '.md';
      }

      const cls = `edit-${file.name.split('.').join('-')} edit`;

      fileButtons.push(
        <div key={file.name}>
          <div className="fileSelect">
            <button onClick={() => setFileName(file.name)}>{file.name}</button>
            <button onClick={() => showEdit(file)}>
              <FaCaretDown />
            </button>
          </div>

          <div className={cls}>
            {' '}
            {/** eslint-disable-next-line react-hooks/exhaustive-deps */}
            <form className="editForm" onSubmit={(event) => edit(event, file)}>
              <input
                pattern="^[^~)('!*<>:;,?*|/]+$"
                onChange={(event) => updateEditLanguage(event)}
                className="file-name"
                name="filename"
                type="text"
                placeholder={file.name}
                autoComplete="off"
              ></input>
              <p>
                <span className="language-show-edit">
                  {file.language.charAt(0).toUpperCase() + file.language.slice(1)}
                </span>
              </p>

              <button
                disabled={files.length <= 1}
                onClick={() => setTimeout(() => deleteFile(file.name), 400)}
              >
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
    const div = document.querySelector<HTMLElement>(
      `div.edit-${file.name.split('.').join('-')}`
    );
    const back = document.querySelector<HTMLElement>(`.backdrop`);
    div.style['display'] = 'flex';
    back.style['display'] = 'block';
  }

  function edit(event: FormEvent<HTMLFormElement>, file: BoardFile) {
    event.preventDefault();
    closeEdit();
    // @ts-ignore
    const name = event.target[0].value;

    const box = document.querySelector<HTMLElement>(
      `.edit-${file.name.split('.').join('-')} form .language-show-edit`
    );

    if (!name) return;
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      if (file.name == file.name) {
        file.name = name;
        file.language = (box.innerText || box.textContent).toLowerCase();
      } else {
        file.name = name;
        file.language = (box.innerText || box.textContent).toLowerCase();
      }

      setFileName(name);
    }
  }

  function updateEditLanguage(e: ChangeEvent<HTMLInputElement>) {
    const n = e.target.value;
    const box = document.querySelector('.language-show-edit');

    const l =
      extensions.find((x) => x.key.includes('.' + n.replace('.', '^').split('^')[1]))
        ?.name || 'none';

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

  function showDialog() {
    const dialog = document.querySelector<HTMLDialogElement>('dialog#newFile');

    dialog.showModal();
  }

  function updateLanguage(e: ChangeEvent<HTMLInputElement>) {
    const n = e.target.value;
    const box = document.querySelector('.language-show');

    const l = extensions.find((x) => x.key.includes('.' + n.replace('.', '^').split('^')[1]))
      ?.name || 'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  // HANDLE SUMBIT ----------------------------------------------------
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const keyId = makeid(8);

    let encryptedFiles: BoardFile[] = [];

    if(encrypt) {
      files.forEach(file => {
        encryptedFiles.push(
          {
            name: file.name,
            language: file.language,
            value: String(cryptr.encrypt(file.value))
          }
        )
      })

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
        'Authorization': process.env.NEXT_PUBLIC_KEY
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);

    const result = await response.json();
    router.push(`/bin/${keyId}`);
  };
  // ------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div
          onClick={() => {
            closeEdit();
            const form = document.querySelector<HTMLFormElement>(`.editForm`);
            form.requestSubmit();
          }}
          className="backdrop"
        ></div>

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

        <dialog id="newFile" open={false}>
          <div>
            <button
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              onClick={() => {
                document.querySelector<HTMLDialogElement>('#newFile').close();
              }}
              className="back"
            >
              <FaBackward />
            </button>
            <h2>Add new file</h2>
          </div>
          <form method="dialog" onSubmit={(event) => newFile(event)}>
            <input
              autoComplete="off"
              pattern="^[^~)('!*<>:;,?*|/]+$"
              onChange={(event) => updateLanguage(event)}
              className="file-name"
              name="filename"
              type="text"
              placeholder="untitled.js"
            ></input>
            <p>
              <span className="language-show">Javascript</span>
            </p>

            <button className="create">
              <VscNewFile style={{ marginRight: '4px' }} /> Create
            </button>
          </form>
        </dialog>



        <div className="grid">
          <button
            className="info mobile"
            onClick={(event) => {
              document.querySelector('.projectForm').classList.toggle('show');
              (event.target as HTMLButtonElement).classList.toggle('opened');
            }}
          >
            <GoGear /> <span>Metadata</span>
          </button>
          <div className="projectForm">
            <div className="details">
              <form onSubmit={(event) => handleSubmit(event)}>
                <div className="formName">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Untitled."
                    name="project-name"
                  ></input>{' '}
                  {encrypt ? (
                    <GoShieldCheck className="enc icon" />
                  ) : (
                    <GoShieldSlash
                      style={{ color: 'var(--red)' }}
                      className="enc icon"
                    />
                  )}
                </div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter a short description."
                  maxLength={128}
                  name="project-desc"
                ></textarea>

                <div className="optionGrid">
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
                        onChange={() => setEncrypt(!encrypt)}
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
                className="save"
                disabled={code == ''}
                onClick={() => {
                  const form = document.querySelector<HTMLFormElement>(`.details form`);
                  form.requestSubmit();
                }}
              >
                Save
              </button>
              <span
                style={{ borderRadius: '12px' }}
                className="tooltiptext gridy"
              >
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
                  <GoShieldCheck
                    style={{ opacity: 1, fontSize: '22px' }}
                    className="enc icon"
                  />
                ) : (
                  <GoShieldSlash
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
                <div className="fileSelect plus">
                  <button
                    disabled={files.length >= 2}
                    onClick={() => showDialog()}
                  >
                    <FaPlus style={{ fontSize: '22px' }} />
                  </button>
                </div>
              </div>
              <div className="copypasta">
                <button
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '22px',
                  }}
                  onClick={(event) => {
                    const colors = ['#f8bc45', '#c596c7', '#56b3b4'];

                    (event.target as HTMLElement).style.color =
                      colors[Math.floor(Math.random() * colors.length)];
                    formatCode(code)
                      .then((formatted) => {
                        file.value = formatted;
                        setCode(formatted);
                      })
                      .catch((err) => {
                        (event.target as HTMLElement).style.color = '#ea5e5e';
                        console.log(err)
                      });

                    setInterval(() => {
                      (event.target as HTMLElement).style.color = 'var(--special-color)';
                    }, 5000);
                  }}
                >
                  <SiPrettier />
                </button>
              </div>
            </div>
            <CodeBoard
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

export default Home;

// Formatting code with Prettier
const formatCode = async (code: string) => {
  const prettier = await import('prettier/standalone');
  const babylonParser = await import('prettier/parser-babel');

  return prettier.format(code, {
    parser: 'babel',
    plugins: [babylonParser],
    semi: true,
    singleQuote: true,
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
