import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script strategy="beforeInteractive" id="dark-mode">
          {`
        const theme = localStorage.getItem('theme');
        if (theme == 'light') {
            console.log("Light theme user ? Never seen a programmer using light theme x-x")
            document.documentElement.setAttribute('data-theme', 'light');
        } else document.documentElement.setAttribute('data-theme', 'dark');
        `}
        </Script>
      </body>
    </Html>
  );
}
