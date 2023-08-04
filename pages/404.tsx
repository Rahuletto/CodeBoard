//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useLayoutEffect, useState } from 'react';
// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';

// Icons
const BsQuestionDiamondFill = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/bs').then(mod => mod.BsQuestionDiamondFill), { ssr: false })

import { IconType } from 'react-icons-ng';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

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
        title="Uhhm ??"
        description="This was not supposed to happen. This board never existed (or) enabled AutoVanish (auto-delete)."
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
              <BsQuestionDiamondFill
                style={{ color: 'var(--red)', fontSize: '64px' }}
              />
              <h1 style={{ margin: '6px', textAlign: 'center' }}>
                Something{"'"}s wrong here.
              </h1>
              <p className="error-text" style={{ fontSize: '18px' }}>
                The board you are looking for never existed, Or just got{' '}
                <span className="tooltip">
                  AutoVanished
                  <span className="tooltiptext">
                    Boards that delete after a day.
                  </span>
                </span>
                .<br></br>Anyways, Wanna sip some coffee and have cookies ?
                <br></br>
                <br></br>but sadly i dont have cookies {'>'}:{'('}
                <span
                  style={{
                    fontStyle: 'italic',
                    opacity: 0.6,
                    marginLeft: '10px',
                  }}>
                  blame my developer
                </span>
              </p>
            </div>
            <div>
              <button onClick={() => router.push('/')}>Get back to Home</button>
            </div>
          </div>
        </div>

        
      </main>
      
    </div>
  );
};

export default Error;
