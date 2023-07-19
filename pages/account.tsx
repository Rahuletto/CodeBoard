// NextJS stuff
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Auth and Database
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

// Styles
import styles from '../styles/Account.module.css';

// Icons
import { FaGithub, FaUser } from 'react-icons-ng/fa';
import { LuRefreshCw } from 'react-icons-ng/lu';
import { Md2RobotExcited } from 'react-icons-ng/md2';

// Our imports
import { User } from '../utils/types/user';
import { PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';
import { AESDecrypt } from '../utils/aes';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

export default function Account({ github, bds, apiBds, id, api }) {
  const router = useRouter();

  const supabase = useSupabaseClient();
  const session = useSession();

  const [apiKey, setApiKey] = useState(api);
  const [ratelimit, setRatelimit] = useState(false);

  const [boards, setBoards] = useState(bds);
  const [mode, setMode] = useState('user');
  const [isUser, setIsUser] = useState(true);

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  function switchMode() {
    if (mode == 'user') {
      setMode('api');
      setBoards(apiBds);
      setIsUser(false);
    } else if (mode == 'api') {
      setMode('user');
      setBoards(bds);
      setIsUser(true);
    }
  }

  async function deleteBoard(b) {
    const { error } = await supabase.from('Boards').delete().eq('key', b);

    if (!error) router.reload();
    else console.error(error);
  }

  async function regenerate() {
    try {
      const response = await fetch(`/api/regenerate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: api,
        },
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
              <img
                alt="profile picture"
                src={session?.user?.user_metadata?.avatar_url}
                className={styles.profile}
              />

              <div className={styles.details}>
                <h1>{session?.user?.user_metadata?.name}</h1>
                {github ? (
                  <Link href={github} className={styles.githubURL}>
                    <FaGithub style={{ marginRight: '6px' }} />
                    {session?.user?.user_metadata?.user_name}{' '}
                  </Link>
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
                onClick={() => (ratelimit ? null : regenerate())}
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
                router.push('/');
                supabase.auth.signOut();
              }}
              className={styles.signOut}>
              Sign Out
            </button>
          </div>
          <div
            className={styles.repo}
            style={!isUser ? { borderColor: 'var(--purple)' } : null}>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
              }}>
              <h1>{isUser ? 'Your Boards' : 'API Boards'}</h1>

              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '26px', color: 'var(--purple)' }}>
                  <Md2RobotExcited
                    title="Boards made using your api"
                    style={{ fontSize: '26px', color: 'var(--purple)' }}
                  />
                </span>
                <label className="switch">
                  <input
                    checked={isUser}
                    onChange={(event) => {
                      switchMode();
                    }}
                    type="checkbox"
                  />
                  <span className="boardSlider round"></span>
                </label>
                <span style={{ fontSize: '26px', color: 'var(--green)' }}>
                  <FaUser
                    title="Boards made by you"
                    style={{ fontSize: '24px', color: 'var(--green)' }}
                  />
                </span>
              </div>
            </div>

            {boards &&
              boards.map((b) => (
                <div className={styles.boardList} key={b.key}>
                  <h3>{b.name}</h3>
                  <p>{b.description}</p>
                  <div className={styles.buttons}>
                    <Link title={`/bin/${b.key}`} href={`/bin/${b.key}`}>
                      /bin/{b.key}
                    </Link>
                    {isUser ? (
                      <button
                        title="Delete the board"
                        onClick={() => deleteBoard(b.key)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            {!boards || !boards[0] ? <p>No boards found</p> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
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

  const { data: user }: { data: User } = await supabase
    .from('Users')
    .select()
    .eq('id', session?.user?.user_metadata?.provider_id)
    .limit(1)
    .single();

  if (!user) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  const {
    data: boards,
  }: { data: { key: string; name: string; description: string }[] } =
    await supabase
      .from('Boards')
      .select('key, name, description')
      .eq('author', session?.user?.user_metadata?.provider_id);

  const {
    data: apiBds,
  }: {
    data: { key: string; name: string; description: string }[];
    error: PostgrestError;
  } = await supabase
    .from('Boards')
    .select()
    .eq('madeBy', session?.user?.user_metadata?.provider_id);

  return {
    props: {
      bds: boards ?? [],
      apiBds: apiBds ?? [],
      id: user?.id ?? '',
      api: user?.apiKey ?? '',
      github: session?.user
        ? 'https://github.com/' + session.user.user_metadata.user_name
        : '',
    },
  };
};
