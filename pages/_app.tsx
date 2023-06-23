// NextJS Stuff
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Styles
import '../styles/globals.css';
import '../styles/mobile.css';

// Loader
import { Loader } from '../components/Loader';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => document.querySelector<HTMLElement>('.loading-brr').style.opacity = "0", 2999)
    setTimeout(() => setLoading(true), 3000)
  }, [])

  if (!loading && router.pathname != "/embed/[id]") {
    return (<Loader />)
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;


