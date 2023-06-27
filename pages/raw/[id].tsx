// NextJS Stuff
import { GetServerSidePropsContext } from 'next';

// Our stuff
import { AESDecrypt } from '../../utils/aes';
import { FetchResponse } from '../api/fetch';

export default function MyComponent({ text }: { text: string }) {
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
      value={text}></textarea>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const promiseBoard = await fetch(
    `https://cdeboard.vercel.app/api/fetch?id=${context.params.id}`,
    { cache: 'force-cache' }
  );

  if (promiseBoard.status == 200) {
    const maybeBoard: FetchResponse = await promiseBoard.json();

    if (
      Number(maybeBoard.createdAt) + 86400 * 1000 < Date.now() &&
      maybeBoard?.autoVanish
    )
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };

    let text: string;

    const file = maybeBoard.files.find((a) => a.name == context.query.file);

    if (!file || !file?.value) return { props: { text: 'File not found !' } };

    text = file.value;

    if (maybeBoard.encrypted) text = AESDecrypt(file.value);

    return { props: { text: text } };
  } else return { props: { text: 'Board not found !' } };
}
