
// NextJS stuff
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import Head from 'next/head';

// Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Our Imports
import connectDB from '../../middleware/mongodb';
import CodeBoard from '../../components/Code';
import { Board } from '../../utils/board';
import Header from '../../components/Header';

function Embed({ board }) {
  const router = useRouter();
  const { id } = router.query;

  board = JSON.parse(board);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const { asPath } = useRouter();
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  useEffect(() => {
    if (!board) router.push('/404');
  }, [board, id]);

  // DARK MODE & LIGHT MODE

  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  // Props
  const [height, setHeight] = useState(472)
  const [width, setWidth] = useState(1028)
  

  let file = board.files.find((a) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage(
    file.language == 'none' ? 'markdown' : file.language
  );

  const fileButtons = [];

  board.files.map((f) => {
    if (file.language == 'none') {
      file.name = file.name.split('.')[0] + '.md';
    }

    fileButtons.push(
      <div key={file.name}>
        <div className="fileSelect">
          <button onClick={() => setFileName(file.name)}>{file.name}</button>
        </div>
      </div>
    );
  });

  setTimeout(() => setBtns(fileButtons), 20);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
      
      const code = document.querySelector<HTMLElement>('.codeWrapper')
      code.style.height = height.toString()
      code.style.width = width.toString()

      
    });
  }, []);

  return (
    <div>
      <Header title="CodeBoard Embeds" description="Embed your code in your desired website as however you want with beautiful iframes" />

      <div
        className="codeWrapper"
        style={{
          borderRadius: '30px',
          border: '5px solid var(--background-dark)',
          position: "inherit",
          width: width + "px",
          height: height + "px",
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

      <style>
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




export default memo(function EmbedPage({ board }: {board: Board}) {
  return <Embed board={board} />
})

export async function getServerSideProps(context: any) {
  fetch('https://cdeboard.vercel.app/api/connect');

  const board = await fetch(`https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`);

  if(board.status == 200) {
    return { props: { board: JSON.stringify(board.json()) } }
  }
  else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}
