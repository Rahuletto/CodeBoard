//NextJS stuff
import type { NextPage } from 'next';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import ThemeSwitch from '../components/ThemeSwitch';
import Header from '../components/Header';

const Error: NextPage = () => {

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div className={styles.container}>
      <Header title="Uhhm ??" description="This was not supposed to happen. This board never existed (or) enabled AutoVanish (auto-delete)." />

      <main className={styles.main}>
        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <a href="/" className="newProject mobile">
              <FaPlus />
            </a>
            <a href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </a>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="lander">
          <h1 style={{ fontSize: '48px' }}> Something{"\&#39"}s wrong here.</h1>
          <p>
            The board you are looking for never existed, Or just got{' '}
            <div className="tooltip rick">
              <p>AutoVanished</p>
              <span className="tooltiptext">
                Boards that delete after a day.
              </span>
            </div>
            .<br></br>Anyways, Wanna sip some coffee and have cookies ?<br></br>
            <br></br>but sadly i dont have
            cookies {'>'}:{"("}
            <span
              style={{ fontStyle: 'italic', opacity: 0.6, marginLeft: '10px' }}
            >
              blame my developer
            </span>
          </p>
          <hr></hr>

          <a
            style={{ width: 'fit-content', marginTop: '12px' }}
            href="/"
            className="newProject"
          >
            <FaPlus style={{ marginRight: '10px' }} /> New board
          </a>
        </div>
      </main>
    </div>
  );
};

export default Error;
