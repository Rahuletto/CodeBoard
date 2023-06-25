//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import ThemeSwitch from '../components/ThemeSwitch';
import Header from '../components/Header';

const Error: NextPage = () => {

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || "dark")
  }, [])

  return (
    <div className={styles.container}>
      <Header title="X-X" description="Uhh. We encountered some issues with our servers. Lets hope its not the rain messing things up" />

      <main className={styles.main}>
        <header>
          <h1 className="title">C0deB0a2d</h1>
          <div className="buttons">
            <a href="/" className="newProject mobile">
              <FaPlus />
            </a>
            <a href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New b0a2d
            </a>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="lander">
          <h1 style={{ fontSize: '48px' }}> Broken servers x-x</h1>
          <div style={{fontSize: "18px"}}>
            Uhh. We encountered some issues with our servers. Lets hope its not the rain messing things up.<br></br>
            <br></br>Please try again after some time<br></br><span
              style={{ fontStyle: 'italic', opacity: 0.6 }}
            >{'*Psst*'} Error 500 is the error code for Internal Server Error</span>
          </div>
          <hr></hr>

          <code className='errorCode' >Error Code: 500</code>
        </div>
      </main>
    </div>
  );
};

export default Error;
