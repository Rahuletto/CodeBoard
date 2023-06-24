// NextJS stuff
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';

// Languages
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

// Our Imports
import CodeBoard from '../../components/Code';
import Header from '../../components/Header';

// Encrypt-Decrypt
import { AESDecrypt } from '../../utils/aes'
import { FetchResponse } from '../api/fetch';
import { GetServerSidePropsContext } from 'next';

export function Embed({ board } : { board: FetchResponse }) {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || "dark")
  }, [])

  useEffect(() => {
    if (!board) router.push('/404');
  }, [board]);

  // DARK MODE & LIGHT MODE

  const [fileName, setFileName] = useState(board.files[0].name);
  const [btns, setBtns] = useState([]);

  // Props
  const [height, setHeight] = useState(472)
  const [width, setWidth] = useState(1028)
  

  let file = board.files.find((a) => a.name == fileName);
  if (!file) file = board.files[0];

  let language = loadLanguage( // @ts-ignore (Package didnt export a unified type to convert. Rather have 120+ strings)
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




export default memo(function EmbedPage({ board }: { board: FetchResponse }) {
  return <Embed board={board} />
})


export async function getServerSideProps(context: GetServerSidePropsContext) {

  const promiseBoard = await fetch(`https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`, { cache: 'no-cache' });

  

  if(promiseBoard.status == 200) {
    const maybeBoard: FetchResponse = await promiseBoard.json()

  let board: FetchResponse = maybeBoard;

  if (maybeBoard.encrypted) {
    try {
      const decryptedFiles = [];

      maybeBoard.files.forEach(f => {
        decryptedFiles.push({
          name: f.name,
          language: f.language,
          value: AESDecrypt(f.value)
        })
      })

      board = {
        name: maybeBoard.name,
        description: maybeBoard.description,
        files: decryptedFiles,
        key: maybeBoard.key,
        createdAt: maybeBoard.createdAt,
        status: 200,
        encrypted: true
      }
    } catch (err) { }
  }

    return { props: { board: board } }
  }
  else
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
}
