// NextJS Stuff
import '../styles/globals.css';
import '../styles/mobile.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  
  fetch('https://project-code.rahuldumbman.repl.co/api/connect');
  
  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <>
     {loading ? ( <Component {...pageProps} />) : (<h1>Loading</h1>)}
    </>
  );
}

export default MyApp;


