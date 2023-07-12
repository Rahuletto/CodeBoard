// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Styles
import styles from '../styles/Privacy.module.css';

// Icons
import { FlFillIcFluentInprivateAccount24Filled } from 'react-icons/fl';

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
              <FlFillIcFluentInprivateAccount24Filled title="Privacy Matters" />
            </span>
          </div>
          <p style={{ paddingLeft: '0px' }}>
            We are not ready to waste your time with some{' '}
            <b>&quot;big blah blah blah&quot;</b> legal document. Thats why we
            made something thats *spot on* simple yet transparent policy.
          </p>
          <div className={styles.indent}>
            <a href="#definitions">
              <h1>Definitions</h1>
            </a>
            <div className={styles.indent}>
              <ul>
                <li>
                  &quot;Service&quot;, &quot;We&quot;, &quot;The Website&quot;
                  refers to the{' '}
                  <span
                    style={{
                      color: 'var(--special-color)',
                      fontWeight: 600,
                      fontFamily: 'JetBrains Mono',
                    }}>
                    CodeBoard
                  </span>
                  .
                </li>

                <li>
                  &quot;You&quot;, &quot;The User&quot; refers to the{' '}
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>
                    individual
                  </span>
                  or{' '}
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>
                    organisation
                  </span>{' '}
                  using this Service.
                </li>
              </ul>
            </div>
            <a href="#data">
              <h1>Your data</h1>
            </a>
            <div className={styles.indent}>
              <p>
                We will{' '}
                <span style={{ fontWeight: 600, color: 'var(--green)' }}>
                  not use your data
                </span>{' '}
                for out profits nor selling it. We{' '}
                <b style={{ color: 'var(--orange)' }}>only</b> store your code{' '}
                <span
                  style={{ fontWeight: 600, color: 'var(--special-color)',
                  fontFamily: 'JetBrains Mono', }}>
                  {
                    '(If you use Encryption option, We will store only the encrypted code snippet and not your decrypted code snippet)'
                  }
                </span>, options you provided. if you wish to share with the platform.
                We might use your cache to pre-load our components {'('}website
                items{')'} to make it very fast. But if you wish to opt-out, You
                can disable cookies and cache. Damn we don{"'"}t even get your
                personal data
              </p>
            </div>
            <a href="#liability">
              <h1>Liability</h1>
            </a>
            <div className={styles.indent}>
              <p>
                As this is a code sharing platform, you might come around with
                so called <b style={{ color: 'var(--red)' }}>bad actors</b>. The
                code snippets in this platform are made by other users. So we do{' '}
                <b>
                  <strong style={{ color: 'var(--orange)' }}>not</strong>
                </b>{' '}
                take responsibilities for any damages. Use it at your own risk.
                So we will not be liable to you or any third party for{' '}
                <b style={{ color: 'var(--red)' }}>
                  any loss of profits, use, goodwill, or data
                </b>{' '}
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
                If you come across a malicious board {'(code snippet)'} then{' '}
                <b style={{ color: 'var(--green)' }}>PLEASE</b> send the key{' '}
                {'(or)'} url via{' '}
                <a className={styles.link} href="mailto: rahulmarban@gmail.com">
                  email
                </a>{' '}
                or{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                  href="/discord">
                  discord
                </a>
              </p>
            </div>
            <a href="#questions">
              <h1 id="questions">Questions or concerns?</h1>
            </a>
            <div className={styles.indent}>
              <p>
                Reading this privacy notice will help you understand your{' '}
                <b style={{ color: 'var(--green)' }}>
                  privacy rights and choices
                </b>
                . If you do not agree with our policies and practices, please do
                not use our Services. If you still have any questions or
                concerns, please contact me at{' '}
                <a className={styles.link} href="mailto: rahulmarban@gmail.com">
                  rahulmarban@gmail.com
                </a>{' '}
                or{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                  href="/discord">
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
