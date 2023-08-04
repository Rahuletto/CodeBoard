
//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useState } from 'react';

// Styles
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';
import update from '../styles/Update.module.css';

// Icons
import { PiStarFourFill } from 'react-icons-ng/pi';


// Lazy loading
const MetaTags = dynamic(() => import('../components/Metatags'), { ssr: true });
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const Update: NextPage = () => {
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

  useLayoutEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={styles.container}>
      <MetaTags
        title="Updates"
        description="New Updates, new features, new experience."
      />

      <main className={styles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div
          className={[generalStyles.lander, 'update-lander'].join(' ')}
          style={{
            height: "auto",
            backgroundImage:
              'repeating-linear-gradient(-45deg,#fcba03,#fcba03 1px,transparent 1px,transparent 6px)',
          }}>
          <div className="update">
            <div className="details">
              <PiStarFourFill style={{ fontSize: "48px", color: "#fcba03", filter: "drop-shadow(0px 0px 20px #fcba03)" }} />
              <h1 style={{ margin: '6px', textAlign: 'center' }}>
                Updates
              </h1>
              <p className="update-text" style={{ fontSize: '18px' }}>
                Check out what{"'"}s new and updated. Catch up and use all of our features without missing them out !
              </p>
            </div>
            <div className={update.grid}>
              <div className={update.updates}>
                <h1>New way to interact</h1>
                <p className="key">We made sure that you can also use context menu {"(right click menu)"} to interact with the website.</p>
              </div>

              <div className={update.updates}>
                <h1>Confirmation</h1>
                <p className="key">Never delete the files accidentally, Get a confirmation prompt before doing that irreversible action.</p>
              </div>

              <div className={update.updates}>
                <h1>UI Tweaks</h1>
                <p className="key">Tweaking some ui and updating them to make it uniform with the design language.</p>
              </div>

              <div className={update.updates}>
                <h1>Bug Fixes</h1>
                <p className="key">Simply fixing bugs, not that much exciting.</p>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Update;
