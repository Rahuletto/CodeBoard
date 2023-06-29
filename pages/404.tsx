//NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Styles
import generalStyles from '../styles/General.module.css';

// Icons
import { FaPlus } from 'react-icons-ng/fa';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true })
const Header = dynamic(() => import('../components/Header'), { ssr: true })

const Error: NextPage = () => {
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={generalStyles.container}>
      <MetaTags
        title="Uhhm ??"
        description="This was not supposed to happen. This board never existed (or) enabled AutoVanish (auto-delete)."
      />

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={generalStyles.lander}>
          <h1 style={{ fontSize: '48px' }}> Something{"'"}s wrong here.</h1>
          <div style={{ fontSize: '18px' }}>
            The board you are looking for never existed, Or just got{' '}
            <div className="tooltip rick">
              <p>AutoVanished</p>
              <span className="tooltiptext">
                Boards that delete after a day.
              </span>
            </div>
            .<br></br>Anyways, Wanna sip some coffee and have cookies ?<br></br>
            <br></br>but sadly i dont have cookies {'>'}:{'('}
            <span
              style={{ fontStyle: 'italic', opacity: 0.6, marginLeft: '10px' }}>
              blame my developer
            </span>
          </div>
          <hr></hr>

          <a
            style={{ width: 'fit-content', marginTop: '18px' }}
            href="/"
            className={generalStyles.newProject}>
            <FaPlus style={{ marginRight: '10px' }} /> New board
          </a>

          <code className="errorCode">Error Code: 404</code>
        </div>
      </main>
    </div>
  );
};

export default Error;
