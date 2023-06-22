// NextJS Stuff
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

// Load Languages
import { langs, loadLanguage } from '@uiw/codemirror-extensions-langs';

// Icons from React-Icons-NG (Thanks 💖)
import { FaPlus, FaCaretDown, FaBackward } from 'react-icons-ng/fa';
import { GoShieldCheck, GoShieldSlash, GoGear } from 'react-icons-ng/go';
import { VscNewFile } from 'react-icons-ng/vsc';
import { LuTimer, LuTimerOff } from 'react-icons-ng/lu';
import { SiPrettier } from 'react-icons-ng/si';

// Our Imports
import { ext, languages } from './_app';
import CodeBoard from '../components/Code';

const Home: NextPage = () => {
  const router = useRouter();
  
  // Items
  const [fileName, setFileName] = useState('untitled.js');
  const [btns, setBtns] = useState([]);

  // Validation
  const [code, setCode] = useState('');

  // mode
  const [theme, setTheme] = useState('');

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

  const [language, setLanguage] = useState(loadLanguage(
    file.language == 'none' ? 'markdown' : file.language
  ))

  useEffect(() => {
    
    setLanguage(loadLanguage(
      file.language == 'none' ? 'markdown' : file.language
    ));
  }, [file.language]);

  const onChange = React.useCallback(
    (value, viewUpdate) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (file.language == 'none') setFileName(fileName.split('.')[0] + '.md');

      const changed = files.find((a) => a.name === fileName);

      changed.value = value;
      setCode(value);
    },
    [fileName]
  );

  useEffect(() => {
    function deleteFile(name) {
    const ff = files.filter(function (item) {
      return item.name !== name;
    });

    setFileName(ff[0].name);

    setFiles(ff);
  }
    
    const fileButtons = [];

    const tmpFiles = [...files];

    tmpFiles.map((obj) => {
      if (obj.language == 'none') {
        obj.name = obj.name.split('.').join('-') + '.md';
      }

      const cls = `edit-${obj.name.split('.').join('-')} edit`;

      fileButtons.push(
        <div key={obj.name}>
          <div className="fileSelect">
            <button onClick={() => setFileName(obj.name)}>{obj.name}</button>
            <button onClick={() => showEdit(obj)}>
              <FaCaretDown />
            </button>
          </div>

          <div className={cls}> {/** eslint-disable-next-line react-hooks/exhaustive-deps */ }
            <form className="editForm" onSubmit={(event) => edit(event, obj)}>
              <input
                pattern="^[^~)('!*<>:;,?*|/]+$"
                onChange={(event) => updateEditLanguage(event)}
                className="file-name"
                name="filename"
                type="text"
                placeholder={obj.name}
                autoComplete="off"
              ></input>
              <p>
                <span className="language-show-edit">
                  {obj.language.charAt(0).toUpperCase() + obj.language.slice(1)}
                </span>
              </p>

              <button
                disabled={files.length <= 1} 
                onClick={() => setTimeout(() => deleteFile(obj.name), 400)}
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
    const back = document.querySelector(`.backdrop`);

    div.forEach((cls) => {
      cls.style['display'] = 'none';
    });
    back.style['display'] = 'none';
  }

  function showEdit(obj) {
    const div = document.querySelector(
      `div.edit-${obj.name.split('.').join('-')}`
    );
    const back = document.querySelector(`.backdrop`);
    div.style['display'] = 'flex';
    back.style['display'] = 'block';
  }

  function edit(event, obj) {
    event.preventDefault();
    closeEdit();

    const name = event.target[0].value;

    const box = document.querySelector(
      `.edit-${obj.name.split('.').join('-')} form .language-show-edit`
    );

    if (!name) return;
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      if (file.name == obj.name) {
        file.name = name;
        file.language = (box.innerText || box.textContent).toLowerCase();
      } else {
        obj.name = name;
        obj.language = (box.innerText || box.textContent).toLowerCase();
      }

      setFileName(name);
    }
  }

  

  function updateEditLanguage(e) {
    const n = e.target.value;
    const box = document.querySelector('.language-show-edit');

    const l =
      ext.find((x) => x.key.includes('.' + n.replace('.', '^').split('^')[1]))
        ?.name || 'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  function newFile(event) {
    event.preventDefault();
    const dialog = document.querySelector('dialog#newFile');
    const box = document.querySelector('.language-show');

    if (event.target[0].value == '') return dialog.close(name);

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
    const dialog = document.querySelector('dialog#newFile');

    dialog.showModal();
  }

  function updateLanguage(e) {
    const n = e.target.value;
    const box = document.querySelector('.language-show');

    const l = ext.find((x) => x.name === '.' + n.split('.')[1])?.key || 'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  // DARK MODE & LIGHT MODE

  function detectColorScheme() {
    //local storage is used to override OS theme settings
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') == 'light') {
        setTheme('light');
      }
    } else if (!window.matchMedia) {
      //matchMedia method not supported
      return false;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      //OS theme setting detected as dark
      setTheme('light');
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme == 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
  function switchTheme(e) {
    const toggleSwitch = e.target;
    if (e.target.checked) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
      setTheme('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      toggleSwitch.checked = false;
      setTheme('light');
    }
  }

  // HANDLE SUMBIT ----------------------------------------------------
  const handleSubmit = async (event) => {
    
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const keyId = makeid(8);
    const data = {
      name: title || 'Untitled',
      description: description || 'No Description',
      options: [{ autoVanish: vanish, encrypt: encrypt }],
      files: files,
      key: keyId,
      createdAt: Date.now(),
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);
    // API endpoint where we send form data.
    const endpoint = '/api/create';

    // Form the request for sending data  the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    router.push(`/bin/${keyId}`);
  };
  // ------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <Head>
        <title>CodeBoard</title>
        <meta name="description" content="CodeBoard" />
        <link rel="icon" href="/sus.png" />
        <link
          href="https://use.fontawesome.com/releases/v6.0.0/css/all.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
        />
      </Head>

      <main className={styles.main}>
        <div
          onClick={() => {
            closeEdit();
            const form = document.querySelector(`.editForm`);
            form.requestSubmit();
          }}
          className="backdrop"
        ></div>

        <dialog id="newFile" close="true">
          <div>
            <button
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              onClick={() => {
                document.querySelector('#newFile').close();
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

        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <a href="/" className="newProject mobile">
              <FaPlus />
            </a>
            <a href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </a>
            <label id="themeSwitch">
              <input
                onChange={(event) => switchTheme(event)}
                type="checkbox"
              ></input>
            </label>
          </div>
        </header>

        <div className="grid">
          <button
            className="info mobile"
            onClick={(event) => {
              document.querySelector('.projectForm').classList.toggle('show');
              event.target.classList.toggle('opened');
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
                  const form = document.querySelector(`.details form`);
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

                    event.target.style.color =
                      colors[Math.floor(Math.random() * colors.length)];
                    event.target.disabled = true;
                    formatCode(code)
                      .then((formatted) => {
                        file.value = formatted;
                        setCode(formatted);
                      })
                      .catch(() => {
                        event.target.style.color = '#ea5e5e';
                      });

                    setInterval(() => {
                      event.target.style.color = 'var(--special-color)';
                      event.target.disabled = false;
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

      <Script onLoad={() => detectColorScheme()} id="dark-mode">
          {`console.log("Loaded")`}
        </Script>
      
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
