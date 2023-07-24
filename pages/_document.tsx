import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';

import {DM_Sans, JetBrains_Mono} from 'next/font/google'
const dm = DM_Sans({ weight: ['500', '700'],display: "swap", style: ['normal'] })
const mono = JetBrains_Mono({ weight: ['400', '500', '700'],display: "swap", style: ['normal'] })

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <style jsx global>
          {`
          html {
            --root-font: ${dm.style.fontFamily};
            --mono-font: ${mono.style.fontFamily};
          }
          `}
        </style>
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
