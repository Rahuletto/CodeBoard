//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useLayoutEffect, useState } from 'react';

// Styles
import { IconType } from 'react-icons-ng';
import generalStyles from '../../styles/General.module.css';
import styles from '../../styles/Home.module.css';

// Icons
const FaWindowClose = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaWindowClose), { ssr: false })

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../../components/Footer'), { ssr: false });

const Error: NextPage = () => {
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        err404={true}
        title="Auth Error"
        description="This was not supposed to happen. Your github returned nothing to us."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div
          className={[generalStyles.lander, 'error-lander'].join(' ')}
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg,var(--red),var(--red) 1px,transparent 1px,transparent 6px)',
          }}>
          <div className="error" style={{ maxWidth: '700px' }}>
            <div className="details">
              <FaWindowClose
                style={{ color: 'var(--red)', fontSize: '64px' }}
              />
              <h1 style={{ margin: '6px', textAlign: 'center' }}>
                Auth Error.
              </h1>
              <p className="error-text" style={{ fontSize: '18px' }}>
                An error occured while authorizing you to GitHub. Please try
                again. If this occurs again, Please contact our support
              </p>
            </div>
            <div>
              <button onClick={() => router.push('/')}>Get back to Home</button>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Error;
