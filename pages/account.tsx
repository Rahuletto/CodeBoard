// NextJS stuff
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Auth
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

// Styles
import styles from '../styles/Account.module.css';

// Icons
import { FaGithub } from 'react-icons-ng/fa';
import { LuRefreshCw } from 'react-icons-ng/lu';

// Models and mongoose
import User from '../model/user';

// Our imports
import connectDB from '../middleware/mongodb';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

export default function Account({ github, boards, id, api }) {
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const session = useSession();

  const [apiKey, setApiKey] = useState(api);
  const [ratelimit, setRatelimit] = useState(false);

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  async function deleteBoard(b) {
    const response = await fetch(
      `/api/delete?id=${b}&userId=${session.user.user_metadata.provider_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_KEY,
        },
      }
    );
    const result = await response.json();

    if (result) router.reload();
  }

  async function regenerate() {
    try {
      const response = await fetch(`/api/regenerate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_KEY,
        },
        body: JSON.stringify({ userId: session.user.user_metadata.provider_id }),
      });
      const result = await response.json();

      if (result.regen) {
        setApiKey(result.apiKey);
        setRatelimit(true);

        const btn = document.getElementById('regen');

        (btn as HTMLButtonElement).style.background = 'var(--red)';
        (btn as HTMLButtonElement).style.opacity = '0.4';
        (btn as HTMLButtonElement).disabled = true;
      } else throw new Error('RATELIMIT');
    } catch {
      setRatelimit(true);
      const btn = document.getElementById('regen');

      (btn as HTMLButtonElement).style.background = 'var(--red)';
      (btn as HTMLButtonElement).style.opacity = '0.4';
      (btn as HTMLButtonElement).disabled = true;
    }
  }

  return (
    <div className={styles.container}>
      <MetaTags />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.lander}>
          <div className={styles.account}>
            <div className={styles.wrapper}>
              <img alt="profile picture" src={session?.user?.user_metadata?.avatar_url} className={styles.profile} />

              <div className={styles.details}>
                <h1>{session?.user?.user_metadata?.name}</h1>
                {github ? (
                  <a href={github} className={styles.githubURL}>
                    <FaGithub style={{ marginRight: '6px' }} />
                    {session?.user?.user_metadata?.user_name}{' '}
                  </a>
                ) : null}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p>API Key: </p>{' '}
              <code className={styles.secret}>
                <span>{apiKey}</span>
              </code>
              <button
                title={ratelimit ? 'Ratelimited !' : 'Regenerate API Key'}
                onClick={() => regenerate()}
                id="regen"
                className={styles.regen}>
                <LuRefreshCw
                  title={ratelimit ? 'Ratelimited !' : 'Regenerate API Key'}
                />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p>User ID: </p>{' '}
              <code className={styles.secret}>
                <span>{id}</span>
              </code>
            </div>

            <button
              title="Sign out"
              onClick={() => {
                supabaseClient.auth.signOut()
                router.push('/')
              }}
              className={styles.signOut}>
              Sign Out
            </button>
          </div>
          <div className={styles.repo}>
            <h1>Boards</h1>
            {boards.map((b) => (
              <div className={styles.boardList} key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
                <div className={styles.buttons}>
                  <a title={`/bin/${b.key}`} href={`/bin/${b.key}`}>
                    /bin/{b.key}
                  </a>
                  <button
                    title="Delete the board"
                    onClick={() => deleteBoard(b.key)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!boards[0] ? <p>No boards found from your account</p> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  await connectDB()
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };

  const mongoUser = await User.findOne({ id: session.user.user_metadata.provider_id });

  if (!mongoUser) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  return {
    props: {
      boards: mongoUser.boards ?? [],
      id: mongoUser?.id ?? '',
      api: mongoUser?.apiKey ?? '',
      github: session?.user ? "https://github.com/" + session.user.user_metadata.user_name : '',
    },
  };
};