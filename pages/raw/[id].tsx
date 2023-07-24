// NextJS Stuff
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { sudoFetch } from '../../utils/sudo-fetch';

export default function MyComponent({
  id,
  file,
}: {
  id: string;
  file: string;
}) {
  const supabase = useSupabaseClient();
  const [text, setText] = useState('');

  useEffect(() => {
    sudoFetch(supabase, id, true).then((b) => {
      if (!b) return router.push('/404');

      const f = b.files.find((a) => a.name == file)
      setText(f.value);
    });
  });
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

// Edge Function
export const config = {
  runtime: 'experimental-edge' 
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: { id: context.params.id, file: context.query.file } };
}
