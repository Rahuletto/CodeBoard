// Styles
import styles from './styles/Header.module.css';

// Component
import ThemeSwitch from './ThemeSwitch';

// Icons
import { FaPlus, FaUserAlt } from 'react-icons-ng/fa';
import { VscGithubInverted } from 'react-icons-ng/vsc';

import { useSession, signIn, signOut } from "next-auth/react"

type MetaTagsProps = {
  theme?: string;
  setTheme?: Function;
  drag?: boolean
}

const Header: React.FC<MetaTagsProps> = (
  { theme, setTheme, drag } = { drag: false }
) => {
  const { data: session } = useSession()
  return (
    <header className={drag ? "dragging" : ""}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/home" className={styles.title}>
        CodeBoard
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          style={{ height: '42px' }}
          href="/github"
          className={[styles.newProject, 'pc'].join(' ')}>
          <VscGithubInverted style={{ marginRight: '10px' }} /> Github
        </a>
      </div>
      <div className={styles.buttons}>
        <a href="/" className={[styles.newProject, 'mobile'].join(' ')}>
          <FaPlus />
        </a>
        <a href="/" className={[styles.newProject, 'pc'].join(' ')}>
          <FaPlus style={{ marginRight: '10px' }} />{' '}
          New Board
        </a>
        {session ? <img src={session.user.image} alt="user" className={[styles.newProject].join(' ')} /> : <a onClick={() => signIn()} href="/" className={[styles.newProject].join(' ')}><FaUserAlt/></a>}
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default Header;
