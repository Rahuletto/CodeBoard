//NextJS stuff
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script'
import Link from 'next/link'
import styles from '../styles/Home.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';

const Error: NextPage = () => {
  const router = useRouter();

  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState('dark');

  function detectColorScheme() {
    //local storage is used to override OS theme settings
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') == 'light') {
        setTheme('light');
      }
    } else if (!window.matchMedia) {
      //matchMedia method not supported
      return false;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      //OS theme setting detected as dark
      setTheme('light');
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme == 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
  // Theme switcher
  function switchTheme(e) {
    const toggleSwitch = e.target;
    if (e.target.checked) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
      setTheme('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      toggleSwitch.checked = false;
      setTheme('light');
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Uhhh ?</title>
        <meta name="description" content="CodeBoard" />
        <link rel="icon" href="/sus.png" />
      </Head>

      <main className={styles.main}>
        <header>
          <h1 className="title">CodeBoard</h1>
          <div className="buttons">
            <Link href="/" className="newProject mobile">
              <FaPlus />
            </Link>
            <Link href="/" className="newProject pc">
              <FaPlus style={{ marginRight: '10px' }} /> New board
            </Link>
            <label id="themeSwitch">
              <input
                onChange={(event) => switchTheme(event)}
                type="checkbox"
              ></input>
            </label>
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
            .<br></br>Anyways, Wanna sip some coffee ?<br></br>
            <br></br>Do you need cookies for the coffee ? but sadly i dont have
            one {'>'}:({' '}
            <italic
              style={{ fontStyle: 'italic', opacity: 0.6, marginLeft: '10px' }}
            >
              blame my developer
            </italic>
          </p>
          <hr></hr>

          <Link
            style={{ width: 'fit-content', marginTop: '12px' }}
            href="/"
            className="newProject"
          >
            <FaPlus style={{ marginRight: '10px' }} /> New board
          </Link>
        </div>
      </main>

       <Script onLoad={() => detectColorScheme()} id="dark-mode">
          {`console.log("Loaded")`}
        </Script>
    </div>
  );
};

export default Error;
