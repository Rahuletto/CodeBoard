// NextJS stuff
import type { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Auth
import { Session, getServerSession } from 'next-auth';
import authOptions from './api/auth/[...nextauth]';
import { signOut, useSession } from 'next-auth/react';

// Styles
import styles from '../styles/Account.module.css';

// Icons
import { FaGithub } from 'react-icons-ng/fa';
import { LuRefreshCw } from 'react-icons-ng/lu';

// Models and mongoose
import User from '../model/user';
import connectDB from '../middleware/mongodb';

// Our imports
import PBKDF2 from '../utils/encrypt';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

export default function Account({ github, boards, id, api }) {
  const [apiKey, setApiKey] = useState(api);
  const [ratelimit, setRatelimit] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied</p>;
  }

  async function deleteBoard(b) {
    const response = await fetch(
      `/api/delete?id=${b}&email=${PBKDF2(session.user.email)}`,
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
        body: JSON.stringify({ email: PBKDF2(session.user.email) }),
      });
      const result = await response.json();

      if (result.regen) {
        setApiKey(result.apiKey);
        setRatelimit(true);
        
        const btn = document.getElementById('regen');

        (btn as HTMLButtonElement).style.background = 'var(--red)';
        (btn as HTMLButtonElement).style.opacity = '0.4';
        (btn as HTMLButtonElement).disabled = true;
        
      } else throw new Error("RATELIMIT")
    } catch {
      setRatelimit(true)
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
              <img src={session.user.image} className={styles.profile} />

              <div className={styles.details}>
                <h1>{session.user.name}</h1>
                {github ? (
                  <a href={github} className={styles.githubURL}>
                    <FaGithub style={{ marginRight: '6px' }} />
                    {github.replace('https://github.com/', '')}{' '}
                  </a>
                ) : null}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p>API Key: </p>{' '}
              <code
                style={{
                  fontFamily: 'JetBrains Mono',
                  padding: '2px 6px',
                  background: 'var(--background-dark)',
                  borderRadius: '8px',
                  userSelect: 'all',
                }}>
                {apiKey}
              </code>
              <button
                title={ratelimit ? "Ratelimited !" : "Regenerate API Key"}
                onClick={() => regenerate()}
                id="regen"
                className={styles.regen}>
                <LuRefreshCw title={ratelimit ? "Ratelimited !" : "Regenerate API Key"} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p>User ID: </p>{' '}
              <code
                style={{
                  fontFamily: 'JetBrains Mono',
                  padding: '2px 6px',
                  background: 'var(--background-dark)',
                  borderRadius: '8px',
                  userSelect: 'all',
                }}>
                {id}
              </code>
            </div>

            <button
              title="Sign out"
              onClick={() => signOut({ callbackUrl: '/' })}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connectDB();

  const session: Session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return { redirect: { destination: '/' } };
  }

  const g = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(
      `${session.user.name} in:name`
    )}`
  );
  const gAPI = await g.json();

  const user = await User.findOne({ name: session.user.name });

  if (!user) {
    return { redirect: { destination: '/' } };
  }

  return {
    props: {
      github: gAPI.items ? gAPI?.items[0]?.html_url : null,
      boards: user?.boards ?? [],
      id: user?.id ?? '',
      api: user?.apiKey ?? '',
    },
  };
}
