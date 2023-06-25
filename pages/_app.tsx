// NextJS Stuff
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';

// Loader
import { Loader } from '../components/Loader';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const elem = document.querySelector<HTMLElement>('.loading-brr');
      if (elem) elem.style.opacity = '0';
    }, 2999);
    setTimeout(() => setLoading(true), 3000);
  }, []);

  const blacklist = ['/raw/[id]', '/embed/[id]', '/404'];
  if (
    !loading &&
    !blacklist.some((substring) => router.pathname.includes(substring))
  ) {
    return (
      
    <>
      <Loader />
      <Component {...pageProps} />
    </>
    ) 
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
