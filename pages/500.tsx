// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Styles
import generalStyles from '../styles/General.module.css';

// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true })
const Header = dynamic(() => import('../components/Header'), { ssr: false })

const Error: NextPage = () => {
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={generalStyles.container}>
      <MetaTags
        title="500: Internal Server Error"
        description="Uhh. We encountered some issues with our servers. Lets hope its not the rain messing things up"
      />

      <main className={generalStyles.main}>
        <Header ISE={true} theme={theme} setTheme={setTheme} />

        <div className={generalStyles.lander}>
          <h1 style={{ fontSize: '48px' }}> Brokn s3rvers x-x</h1>
          <div style={{ fontSize: '18px' }}>
            Uhh. We encountered some issues with our servers. Lets hope its not
            the rain messing things up.<br></br>
            <br></br>Please try again after some time<br></br>
            <span style={{ fontStyle: 'italic', opacity: 0.6 }}>
              {'*Psst*'} Error 500 is the error code for Internal Server Error
            </span>
          </div>
          <hr></hr>

          <code className="errorCode">Error Code: 500</code>
        </div>
      </main>
    </div>
  );
};

export default Error;
