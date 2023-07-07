// NextJS Stuff
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Styles
import generalStyles from '../../styles/General.module.css';

// Icons
import { FaWindowClose } from 'react-icons-ng/fa';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

export default function SignError() {
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={generalStyles.container}>
      <MetaTags title="Wait what" description="Login error uh." />

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={[generalStyles.lander, 'signin-lander', 'error-land'].join(' ')} style={{backgroundImage: 'repeating-linear-gradient(-45deg,var(--red),var(--red) 1px,transparent 1px,transparent 6px)'}}>
          <div className="signin-btn">
            <div className="details">
              <FaWindowClose
                style={{ color: 'var(--red)', fontSize: '64px' }}
              />
              <h1 style={{ margin: '6px' }}>Error</h1>
              <p>
                An error occured while authorizing you to GitHub. Please try
                again. If this occurs again, Please contact our support
              </p>
            </div>
            <div>
              <button onClick={() => router.push('/')}>Get back to Home</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
