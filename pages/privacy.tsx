// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Styles
import styles from '../styles/Privacy.module.css';

// Icons
import { FlFillIcFluentInprivateAccount24Filled } from 'react-icons-ng/fl';

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
        description="Welcome to codeboard ! Codeboard is an open source bin website thats better in every way."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={styles.privacyLander}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className={styles.privacyHeader}>Privacy Policy</h1>
            <span
              className="enc icon"
              style={{
                fontSize: '52px',
                marginBottom: '-16px',
              }}>
              <FlFillIcFluentInprivateAccount24Filled />
            </span>
          </div>
          <p style={{ paddingLeft: '0px' }}>
            We are not ready to waste your time with some <b>&quot;big blah blah
            blah&quot;</b> legal document. Thats why we made something thats *spot
            on* simple yet transparent policy.
          </p>
          <div className={styles.indent}>
            <a href="#definitions">
              <h1>Definitions</h1>
            </a>
            <div className={styles.indent}>
              <ul>
                <li>
                  &quot;Service&quot;, &quot;We&quot;, &quot;The Website&quot;
                  refers to the CodeBoard.
                </li>

                <li>
                  &quot;You&quot;, &quot;The User&quot; refers to the individual
                  or organisation using this Service.
                </li>
              </ul>
            </div>
            <a href="#data">
              <h1>Your data</h1>
            </a>
            <div className={styles.indent}>
              <p>
                We will not use your data for out profits nor selling it. We{' '}
                <b>only</b> store your code, options you provided. if you wish
                to share with the platform. We might use your cache to pre-load
                our components {'('}website items{')'} to make it very fast. But
                if you wish to opt-out, You can disable cookies and cache. Damn
                we don{"'"}t even get your personal data
              </p>
            </div>
            <a href="#liability">
              <h1>Liability</h1>
            </a>
            <div className={styles.indent}>
              <p>
                As this is a code sharing platform, you might come around with
                so called <b>bad actors</b>. So we will not be liable to you or
                any third party for any loss of profits, use, goodwill, or data,
                or for any incidental, indirect, special, consequential or
                exemplary damages, however arising, that result from:
              </p>
              <ul>
                <li>
                  The use, disclosure, or display of your User-Generated Content
                </li>
                <li>Your use or inability to use the Service</li>
              </ul>
              <p>
                If you come across a malicious board {'(code)'} then{' '}
                <b>PLEASE</b> send the key {'(or)'} url via{' '}
                <a className={styles.link} href="mailto: rahulmarban@gmail.com">
                  email
                </a>{' '}
                or{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                  href="https://discord.com/users/770551872309166090">
                  discord
                </a>
              </p>
            </div>
            <a href="#questions">
              <h1 id="questions">Questions or concerns?</h1>
            </a>
            <div className={styles.indent}>
              <p>
                Reading this privacy notice will help you understand your
                privacy rights and choices. If you do not agree with our
                policies and practices, please do not use our Services. If you
                still have any questions or concerns, please contact me at{' '}
                <a className={styles.link} href="mailto: rahulmarban@gmail.com">
                  rahulmarban@gmail.com
                </a>{' '}
                or{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                  href="https://discord.com/users/770551872309166090">
                  at Discord
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
