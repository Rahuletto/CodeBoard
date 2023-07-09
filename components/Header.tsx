// Styles
import styles from './styles/Header.module.css';

// Component
import ThemeSwitch from './ThemeSwitch';

// Icons
import { FaPlus, FaUserAlt } from 'react-icons-ng/fa';
import { VscGithubInverted } from 'react-icons-ng/vsc';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

type MetaTagsProps = {
  theme?: string;
  setTheme?: Function;
  drag?: boolean;
};

const Header: React.FC<MetaTagsProps> = (
  { theme, setTheme, drag } = { drag: false }
) => {
  const router = useRouter()
  const { data: session } = useSession();
  return (
    <header className={drag ? 'dragging' : ''}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/home" className={styles.title}>
          CodeBoard
        </a>
        <a
          title="API Documentation"
          href="/docs"
          className={[styles.api, 'pc'].join(' ')}>
          API
        </a>
      </div>
      <div className={styles.buttons}>
        <a href="/" className={[styles.newProject, 'mobile'].join(' ')}>
          <FaPlus />
        </a>
        <a href="/" className={[styles.newProject, 'pc'].join(' ')}>
          <FaPlus style={{ marginRight: '10px' }} /> New Board
        </a>
        {session ? (
          <img title="Account Settings" onClick={() => router.push('/account')} src={session.user.image} alt="user" className={styles.profile} />
        ) : (
          <a
            title="Sign in"
            onClick={() => signIn()}
            className={[styles.profile].join(' ')}>
            <FaUserAlt title="Sign in" />
          </a>
        )}
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default Header;
