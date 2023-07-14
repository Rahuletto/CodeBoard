// NextJS stuff
import { useRouter } from 'next/router';
import React, { MouseEvent, memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';

// Styles
import boardStyles from '../../styles/Board.module.css';

// Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Our imports
import { MetaTags } from '../../components';
import { FetchResponse } from '../api/fetch';
import { Languages } from '../../utils/types/languages';

// Lazy loading
const CodeBoard = dynamic(() => import('../../components/CodeBoard'), {
  ssr: false,
});
const FileSelect = dynamic(() => import('../../components/FileSelect'), {
  ssr: false,
});

export function Embed({ board }: { board: FetchResponse }) {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  useEffect(() => {
    if (!board) router.push('/404');
  }, [board]);

  // DARK MODE & LIGHT MODE

  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  // Props
  const [height, setHeight] = useState(472);
  const [width, setWidth] = useState(1028);

  let file = board.files.find((a) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage(
    file.language == 'none' ? 'markdown' : (file.language as Languages)
  );

  const fileButtons = [];

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

  setTimeout(() => setBtns(fileButtons), 20);

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);

      const code = document.querySelector<HTMLElement>('.codeWrapper');
      code.style.height = height.toString();
      code.style.width = width.toString();
    });
  }, []);

  function handleCopies(event: MouseEvent, text: string) {
    var target = event.currentTarget;
    navigator.clipboard.writeText(text);
    target.classList.toggle('clicked-copy');
    setTimeout(() => {
      target.classList.toggle('clicked-copy');
    }, 5000);
  }

  return (
    <div>
      <MetaTags
        title="CodeBoard Embeds"
        description="Embed your code in your desired website as however you want with beautiful iframes"
        key={board.key}
      />

      <div
        className="codeWrapper"
        style={{
          borderRadius: '30px',
          border: '5px solid var(--background-dark)',
          position: 'inherit',
          width: width + 'px',
          height: height + 'px',
        }}>
        <div className="file-holder bin-copy">
          <div style={{ display: 'flex', gap: '12px' }}>{btns}</div>
          <div style={{ gap: '6px' }} className={boardStyles.copy}>
            <button
              title="Copy the whole program"
              style={{ height: '36px', display: 'flex', alignItems: 'center' }}
              onClick={(event) => {
                handleCopies(event, file.value.toString());
              }}>
              Copy
            </button>

            <button
              style={{ height: '36px', display: 'flex', alignItems: 'center' }}
              title="Source"
              onClick={() => {
                router.push(`/bin/${board.key}`);
              }}>
              Source
            </button>
          </div>
        </div>

        <CodeBoard
          width={width + 'px'}
          height={height + 'px'}
          language={language}
          code={file.value}
          readOnly={true}
          theme={theme}
          onChange={() => 'ok'}
        />
      </div>

      <style>
        {`
        html,
        body {
          overflow: hidden;
          margin: 0;
          background: transparent;
          min-height: 0;
        }
        .cm-editor {
          height: 80vh;
        }
      `}
      </style>
    </div>
  );
}

export default memo(function EmbedPage({ board }: { board: FetchResponse }) {
  return <Embed board={board} />;
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'public, max-age=31536000');

  const promiseBoard = await fetch(
    `https://board.is-an.app/api/fetch?id=${context.params.id}`,
    {
      cache: 'force-cache',
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_KEY,
      },
    }
  );

  if (promiseBoard.status == 200) {
    const board: FetchResponse = await promiseBoard.json();

    if (
      Number(board.createdAt) + 86400 * 1000 < Date.now() &&
      board?.autoVanish
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
