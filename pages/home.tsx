// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import { FlFillIcFluentInprivateAccount24Filled } from 'react-icons-ng/fl';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true })
const Header = dynamic(() => import('../components/Header'), { ssr: true })
 

const Home: NextPage = () => {
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        title="CodeBoard"
        description="Welcome to codeboard ! Codeboard is an open source bin website thats better in every way."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.lander}>
          <h1 className={styles.headin}>CodeBoard</h1>
          <p style={{ fontSize: '20px' }}>
            CodeBoard is an open-source code sharing platform thats better in
            every way.
            <br></br>With beautiful syntax highlighting and integrated with
            Prettier.<br></br>
            <br></br>
            <span style={{ fontStyle: 'italic', opacity: 0.8 }}>
              Supporting 125 languages so far!
            </span>
          </p>
          <div className={styles.buttonHolder}>
          <a
            style={{ width: 'fit-content' }}
            href="/"
            className={generalStyles.newProject}>
            <FaPlus title="New Board" style={{ marginRight: '10px' }} /> New board
          </a>
          <a
            style={{ width: 'fit-content' }}
            href="/privacy"
            className={styles.privacy}>
            <FlFillIcFluentInprivateAccount24Filled title="Privacy Matters" style={{ marginRight: '10px' }} /> Privacy
          </a>
          </div>
        </div>
        <footer>
          Made by <a href="https://rahuletto.thedev.id">Rahuletto</a>
        </footer>
      </main>
    </div>
  );
};

export default Home;
