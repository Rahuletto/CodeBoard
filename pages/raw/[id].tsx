// NextJS Stuff
import { GetServerSidePropsContext } from 'next';

// Our stuff
import { AESDecrypt } from '../../utils/aes';
import { FetchResponse } from '../api/fetch';
import { Board } from '../../utils/board';

export default function MyComponent({ runtime, text } : { runtime: any, text: string })  {
  return (
    <textarea
      disabled
      style={{
        resize: 'none',
        background: 'transparent',
        border: '0px none',
        height: '95vh',
        width: '100%',
      }}
      value={text}
    ></textarea>
  );
}

export const config = {
	runtime: 'edge',
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const promiseBoard = await fetch(
    `https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`,
    { cache: 'force-cache' }
  );

  const maybeBoard: FetchResponse = await promiseBoard.json();

  if (promiseBoard.status == 200) {
    let text: string;

    const file = maybeBoard.files.find((a) => a.name == context.query.file);

    if (!file || !file?.value) return { props: { text: 'File not found !' } };

    text = file.value;

    if (maybeBoard.encrypted) text = AESDecrypt(file.value);

    return { props: { runtime: process.env.NEXT_RUNTIME, text: text } };
  } else return { props: { text: 'Board not found !' } };
}
