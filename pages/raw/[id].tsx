import { GetServerSidePropsContext } from 'next';
import { AESDecrypt } from '../../utils/aes';
import { FetchResponse } from '../api/fetch';

export default function MyComponent({ text }) {
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

    return { props: { text: text } };
  } else return { props: { text: 'Board not found !' } };
}
