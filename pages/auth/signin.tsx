// NextJS Stuff
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Auth
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import authOptions from '../api/auth/[...nextauth]';

// Styles
import generalStyles from '../../styles/General.module.css';

// Icons
import { FaGithub } from 'react-icons-ng/fa';

// Lazy loading
const MetaTags = dynamic(() => import('../../components/Metatags'), {
  ssr: true,
});
const Header = dynamic(() => import('../../components/Header'), { ssr: true });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // DARK MODE & LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark' | string>();

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
          <div className="signin-btn">
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
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  <FaGithub /> Authorize with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
