// Styles
import styles from './styles/Header.module.css';

// NextJS
import Link from 'next/link';

// Component
import ThemeSwitch from './ThemeSwitch';

// Icons
import { FaPlus, FaUserAlt } from 'react-icons-ng/fa';

import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

type MetaTagsProps = {
  theme?: string;
  setTheme?: Function;
  drag?: boolean;
};

const Header: React.FC<MetaTagsProps> = (
  { theme, setTheme, drag } = { drag: false }
) => {
  const router = useRouter()
  const session = useSession()

  return (
    <header className={drag ? 'dragging' : ''}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/home" className={styles.title}>
          CodeBoard
        </Link>
        <Link
          title="API Documentation"
          href="/docs"
          className={[styles.api, 'pc'].join(' ')}>
          API
        </Link>
      </div>
      <div className={styles.buttons}>
        <Link href="/" className={[styles.newProject, 'mobile'].join(' ')}>
          <FaPlus />
        </Link>
        <Link href="/" className={[styles.newProject, 'pc'].join(' ')}>
          <FaPlus style={{ marginRight: '10px' }} /> New Board
        </Link>
        {session ? (
          <img title="Account Settings" onClick={() => router.push('/account')} src={session?.user?.user_metadata?.avatar_url} alt="user" className={styles.profile} />
        ) : (
          <Link
            title="Sign in"
            href="/auth/signin"
            className={[styles.profile].join(' ')}>
            <FaUserAlt title="Sign in" />
          </Link>
        )}
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default Header;
