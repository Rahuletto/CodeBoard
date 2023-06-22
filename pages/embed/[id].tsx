
// NextJS stuff
import { useRouter } from 'next/router';
import Code from '../../model/code';
import connectDB from '../../middleware/mongodb';
import React, { memo, useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { withRouter } from 'next/router';

// Languages
import { langs, loadLanguage } from '@uiw/codemirror-extensions-langs';

// Our Imports
import { ext, languages } from '../_app';
import CodeBoard from '../../components/Code';

function Embed({ bin }) {
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

  // Props
  const [height, setHeight] = useState(472)
  const [width, setWidth] = useState(1028)
  

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

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
      
      const code = document.querySelector('.codeWrapper')
      code.style.height = height
      code.style.width = width

      
    });
  }, []);

  return (
    <div onLoad={() => detectColorScheme()}>
      <Head>
        <title>CodeBoard Embeds</title>
        <meta name="description" content="CodeBoard" />
        <link rel="icon" href="/sus.png" />
      </Head>

      <div
        className="codeWrapper"
        style={{
          borderRadius: '30px',
          border: '5px solid var(--background-dark)',
          position: "inherit",
          width: width + "px",
          heigh: height + "px",
        }}
      >
        <div className="file-holder">{btns}</div>
        <CodeBoard
          width={width + "px"}
          height={height + "px"}
          language={language}
          code={file.value}
          readOnly={true}
          theme={theme}
          onChange={() => "ok"}
        />
      </div>

      <style jsx global>
        {`
        html,
        body {
          margin: 0;
          background: transparent;
          min-height: 0;
        }
      `}
      </style>
    </div>
  );
}




export default memo(function EmbedPage({ bin }) {
  return <Embed bin={bin} />
})

export async function getServerSideProps(context: any) {
  await connectDB();

  const bin = await Code.findOne({ key: context.params.id });

  if (bin) return { props: { bin: JSON.stringify(bin) } };
  else
    return {
      redirect: {
        permanent: false,
        destination: '/embed',
      },
    };
}
