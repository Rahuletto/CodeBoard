//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useLayoutEffect, useState } from 'react';
// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';

// Icons
const FaHeartBroken = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaHeartBroken), { ssr: false })


import Link from 'next/link';
import { IconType } from 'react-icons-ng';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });
const Error: NextPage = () => {
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        err404={true}
        title="500: Internal Server Error"
        description="Uhh. We encountered some issues with our servers. Lets hope its not the rain messing things up"
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div
          className={[generalStyles.lander, 'error-lander'].join(' ')}
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg,var(--red),var(--red) 1px,transparent 1px,transparent 6px)',
          }}>
          <div className="error" style={{ maxWidth: '700px' }}>
            <div className="details">
              <FaHeartBroken
                style={{ color: 'var(--red)', fontSize: '64px' }}
              />
              <h1 style={{ margin: '6px', textAlign: 'center' }}>
                Brokn s3rvers
              </h1>
              <p className="error-text" style={{ fontSize: '18px' }}>
                Uhh. I{"'"}ve encountered some issues with<br></br>our servers.
                Imma report it to <Link id="author" href="https://rahuletto.thedev.id">Rahuletto</Link><br></br>
                <br></br>Please try again after some time.<br></br>
                <span
                  style={{
                    fontStyle: 'italic',
                    opacity: 0.6,
                    marginLeft: '10px',
                  }}>
                  *Psst* Error 500 is the error code for Internal Server Error
                </span>
              </p>
            </div>
            <div>
              <button onClick={() => router.push('/')}>Get back to Home</button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Error;
