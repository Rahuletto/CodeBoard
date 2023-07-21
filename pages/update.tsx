
//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';
import update from '../styles/Update.module.css'

// Icons
import { PiStarFourFill } from 'react-icons-ng/pi';
import Link from 'next/link';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

const Error: NextPage = () => {
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        title="Updates"
        description="New Updates, new features, new experience."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div
          className={[generalStyles.lander, 'update-lander'].join(' ')}
          style={{
            height: "auto",
            backgroundImage:
              'repeating-linear-gradient(-45deg,#fcba03,#fcba03 1px,transparent 1px,transparent 6px)',
          }}>
          <div className="update" style={{ maxWidth: '1100px' }}>
            <div className="details">
              <PiStarFourFill style={{ fontSize: "48px", color: "#fcba03", filter: "drop-shadow(0px 0px 20px #fcba03)" }} />
              <h1 style={{ margin: '6px', textAlign: 'center' }}>
                Updates
              </h1>
              <p className="update-text" style={{ fontSize: '18px' }}>
                Check out what{"'"}s new and updated. Catch up and use all of our features without missing them out !
              </p>
            </div>
            <div className={update.grid}>
              <div className={update.updates}>
                <h1>Command Pallette</h1>
                <p className="key">We have introduced the all new Command pallette. If you are familiar with famous IDEs, this would be familiar too ! Get things fast with <span>Ctrl</span> <span>K</span>.</p>
              </div>
            </div>
          </div>
        </div>
        <footer style={{ marginTop: '20px' }}>
          Made by <Link href="https://rahuletto.thedev.id">Rahuletto</Link>
        </footer>
      </main>
    </div>
  );
};

export default Error;
