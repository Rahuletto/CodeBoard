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
    setTimeout(() => setLoading(true), 2000); // just read the fun things in the loading screen bruh

    setTimeout(() => {
      const elem = document.querySelector<HTMLElement>('.loadScreen');
      if (elem) elem.style.opacity = '0';
    }, 1800);
  }, []);

  const blacklist = ['/raw/[id]', '/embed/[id]', '/404', '/500', '/home']; // blacklist these urls
  if (
    !loading &&
    !blacklist.some((substring) => router.pathname.includes(substring))
  ) {
    return (
      <>
        <Loader />
        <Component {...pageProps} /> {/** For getting its meta tags */}
      </>
    );
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
