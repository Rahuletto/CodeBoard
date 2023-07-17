// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import { FlFillIcFluentInprivateAccount24Filled } from 'react-icons-ng/fl';
import Link from 'next/link';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });

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
        description="The future of code sharing is here. Codeboard is an open source bin website thats better in every way."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.land}>
          <span className={styles.glowBall1}></span>
          <span className={styles.glowBall2}></span>
          <div className={styles.welcome}>
            <h1 className={styles.headin}>
              The future of{' '}<br></br>
              <span className={generalStyles.purple}>code sharing platform</span>
            </h1>
            <p style={{ fontSize: '22px' }}>
              An <span className={generalStyles.purple}>open-source</span> code
              sharing platform thats better in every way.
            </p>
            <div className={styles.buttonHolder}>
              <Link
                style={{ width: 'fit-content' }}
                href="/"
                className={generalStyles.newProject}>
                <FaPlus title="New Board" style={{ marginRight: '10px' }} /> New
                board
              </Link>
              <Link
                style={{ width: 'fit-content' }}
                href="/privacy"
                className={styles.privacy}>
                <FlFillIcFluentInprivateAccount24Filled
                  title="Privacy Matters"
                  style={{ marginRight: '10px' }}
                />{' '}
                Privacy
              </Link>
            </div>
          </div>
          <Image
            className={styles.logo}
            width={162}
            height={185}
            src="/logo.svg"
            alt={'CodeBoard'}
          />
        </div>
        <hr className="splitter"></hr>

        <div className={styles.parent}>
          <span className={styles.glowBall3}></span>
          <div className={styles.div1}>
            <h2>Mobile friendly</h2>
            <p>
              The platform was designed with mobile in mind. As mobile devices
              account for 55% of all web traffic. Other code sharing services
              ignore mobile devices, but we do not. Because, We are the future
              of <span className={generalStyles.purple}>code sharing</span>
            </p>
          </div>
          <div className={styles.div2}>
            <h2>Encryption on board</h2>
            <p>
              We encrypt all code snippets during transit, so{' '}
              <span style={{ color: 'var(--green)' }}>only you</span> and the
              people who use your link can access them.{' '}
            </p>
          </div>
          <div className={styles.div4}>
            <h2>Supports 120+ Languages</h2>
            <p>
              We support various languages to fit your needs. Wanna share error
              logs ? You can! We support 120+ file formats including popular
              languages
            </p>
          </div>
        </div>

        <div className={styles.last}>
          <h3>Share your code, inspire others.</h3>
          <Link
            style={{ width: 'fit-content' }}
            href="/"
            className={generalStyles.newProject}>
            <FaPlus title="New Board" style={{ marginRight: '10px' }} /> New
            board
          </Link>
        </div>
        <footer>
          Made by <Link href="https://rahuletto.thedev.id">Rahuletto</Link>
        </footer>
      </main>
    </div>
  );
};

export default Home;
