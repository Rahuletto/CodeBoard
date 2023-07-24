import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Styles
import generalStyles from '../../styles/General.module.css';

// Icons
const FaGithub = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaGithub), { ssr: false })

// Auth
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons-ng';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

export default function SignIn() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>('dark');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className={generalStyles.container}>
      <MetaTags
        title="Sign in"
        description="Login with your Github account and get more perks."
      />

      <main className={generalStyles.main}>
        <Header theme={theme} setTheme={setTheme} />

        <div className={[generalStyles.lander, 'signin-lander'].join(' ')}>
          <div className="signin">
            <div className="details">
              <FaGithub style={{ fontSize: '64px' }} />
              <h1 style={{ margin: '6px' }}>Sign in</h1>
              <p>
                We want you to authorize with GitHub. Don&quot;t worry, We are
                transparent of what we going to access.
              </p>
              <ul>
                <li>Your Name</li>
                <li>Your Profile picture</li>
                <li>
                  Your Email{' '}
                  <span style={{ color: 'var(--green)' }}>{'(Encrypted)'}</span>
                </li>
              </ul>
            </div>

            <div key="github">
              <button
                onClick={() =>
                  supabaseClient.auth.signInWithOAuth({
                    provider: 'github',
                  })
                }>
                <FaGithub /> Authorize with Github
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export const config = { runtime: "experimental-edge" }