// NextJS Stuff
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import styles from '../../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import { GoShieldCheck, GoGitBranch, GoGear } from 'react-icons-ng/go';

// Database
import Code from '../../model/code';

// Our Imports
import { ext } from '../_app';
import CodeBoard from '../../components/Code';

export default function Bin({ bin }) {
  const router = useRouter();
  const { id } = router.query;

  bin = JSON.parse(bin);

  const [theme, setTheme] = useState('dark');

  const { asPath } = useRouter();
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const URL = `${origin}${asPath}`;

  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(URL)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!bin) router.push('/404');
  }, [bin, id]);

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

  const [fileName, setFileName] = useState(bin.files[0].name);
  const [btns, setBtns] = useState([]);

  let file = bin.files.find((a) => a.name == fileName);
  if (!file) file = bin.files[0];

  let language = loadLanguage(
    file.language == 'none' ? 'markdown' : file.language
  );

  const fileButtons = [];

  bin.files.map((obj) => {
    if (obj.language == 'none') {
      obj.name = obj.name.split('.')[0] + '.md';
    }

    fileButtons.push(
      <div key={obj.name}>
        <div className="fileSelect">
          <button onClick={() => setFileName(obj.name)}>{obj.name}</button>
        </div>
      </div>
    );
  });

  setTimeout(() => setBtns(fileButtons), 20);

  return (
    <div className={styles.container}>
      <Head>
        <title>{bin.name}/CodeBoard</title>
        <meta name="description" content="CodeBoard" />
        <link rel="icon" href="/sus.png" />
      </Head>

      <main className={styles.main}>
        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <Link href="/" className="newProject mobile">
              <FaPlus />
            </Link>
            <Link href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </Link>
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
              <form>
                <div className="formName">
                  <input
                    value={bin.name}
                    readOnly
                    placeholder="Untitled."
                    name="project-name"
                  ></input>{' '}
                  {bin.options[0]?.encrypt ? (
                    <GoShieldCheck className="enc icon" />
                  ) : null}
                </div>
                <textarea
                  value={bin.description}
                  readOnly
                  placeholder="Enter a short description."
                  maxLength={128}
                  name="project-desc"
                ></textarea>
              </form>
            </div>
            <div className="tooltip">
              <button
                className="save"
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GoGitBranch style={{ marginRight: '12px' }} /> Fork
              </button>
              <span style={{ borderRadius: '12px' }} className="tooltiptext">
                Coming soon..
              </span>
            </div>
          </div>

          <div className="codeWrapper">
            <div className="file-holder bin-copy">
              <div>{btns}</div>
              <div className="copypasta">
                <button
                  onClick={(event) => {
                    handleCopyClick();
                    event.target.innerHTML = 'Copied !';
                    event.target.style.background = 'var(--green)';
                    event.target.style.color = '#17191b';
                    setTimeout(() => {
                      event.target.innerHTML = 'Copy URL';
                      event.target.style.background = 'transparent';
                      event.target.style.color = 'var(--special-color)';
                    }, 5000);
                  }}
                >
                  Copy URL
                </button>
                <button
                  onClick={(event) => {
                    const iframe = `<iframe
  src="${location.origin}/embed/${bin.key}"
  style="width: 1024px; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>
`;

                    navigator.clipboard.writeText(iframe);
                    event.target.innerHTML = 'Copied !';
                    event.target.style.background = 'var(--green)';
                    event.target.style.color = '#17191b';
                    setTimeout(() => {
                      event.target.innerHTML = 'Embed';
                      event.target.style.background = 'transparent';
                      event.target.style.color = 'var(--special-color)';
                    }, 5000);
                  }}
                >
                  Embed
                </button>
                ;
              </div>
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

      <Script onLoad={() => detectColorScheme()} id="dark-mode">
        {`console.log("Loaded")`}
      </Script>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  fetch('https://project-code.rahuldumbman.repl.co/api/connect');

  const bin = await Code.findOne({ key: context.params.id });

  if (bin) return { props: { bin: JSON.stringify(bin) } };
  else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}
