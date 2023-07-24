
//NextJS stuff
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
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
          <div className="update" style={{ maxWidth: '1100px' }}>
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
                <h1>Command Pallette</h1>
                <p className="key">We have introduced the all new Command pallette. If you are familiar with famous IDEs, this would be familiar too ! Get things fast with <span>Ctrl</span> <span>K</span>.</p>
              </div>

              <div className={update.updates}>
                <h1>Full fledged code editor</h1>
                <p className="key">We are not a {'"paste it and share"'} platform anymore, we now have auto-complete, zen mode and everything that you would expect from a standalone IDE.</p>
              </div>

              <div className={update.updates}>
                <h1>Optimization++</h1>
                <p className="key">We optimized most of the things to give performance boost for client and the server side as well.</p>
              </div>

              <div className={update.updates}>
                <h1>Keybinds</h1>
                <p className="key">Keybinds are here. Throw your mouse because you can control codeboard with just your keyboard.</p>
              </div>

              <div className={update.updates}>
                <h1>New Right-Click menu</h1>
                <p className="key">I sometimes feel lazy to click some buttons thats far apart. But not anymore, right click the code editor and do its useful features.</p>
              </div>

              <div className={update.updates}>
                <h1>Logs tab</h1>
                <p className="key">Some bin just doesnt offer this, rather you paste your errors/logs as a comment or separate bin. Not anymore ! Use the logs panel to paste your logs instead of separate file or bin.</p>
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
