// NextJS stuff
import Head from 'next/head';

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <>
      <Head>
        <title>{title || 'CodeBoard'}</title>
        <meta name="title" content={title || 'CodeBoard'} />
        <meta
          name="description"
          content={
            description ||
            'Codeboard is an open source source code bin website thats better in every way '
          }
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://board.is-an.app" />
        <meta property="og:title" content="CodeBoard" />
        <meta
          property="og:description"
          content="Codeboard is an open source source code bin website thats better in every way"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://board.is-an.app" />
        <meta property="twitter:title" content="CodeBoard" />
        <meta
          property="twitter:description"
          content="Codeboard is an open source source code bin website thats better in every way"
        />

        <link rel="icon" href="/sus.png" />
      </Head>
      <link
        href="https://use.fontawesome.com/releases/v6.0.0/css/all.css"
        rel="stylesheet"
      />
    </>
  );
};

export default Header;
