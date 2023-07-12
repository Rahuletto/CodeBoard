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
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=360, stale-while-revalidate=480'
  )

  const promiseBoard = await fetch(
    `https://board.is-an.app/api/fetch?id=${context.params.id}`,
    { cache: 'force-cache' }
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

    let text: string;

    const file = board.files.find((a) => a.name == context.query.file);

    if (!file || !file?.value) return { props: { text: 'File not found !' } };

    text = file.value;
    
    return { props: { text: text } };
  } else return { props: { text: 'Board not found !' } };
}
