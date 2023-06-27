// NextJS stuff
import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description }) => {
  return (
    <>
      <Head>
        <title>{title || 'CodeBoard'}</title>
        <meta name="title" content={title || 'CodeBoard'} />
        <meta
          name="description"
          content={
            description ||
            'CodeBoard is an open-source code sharing platform thats better in every way. With beautiful syntax highlighting and integrated with Prettier.'
          }
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cdeboard.vercel.app" />
        <meta property="og:title" content={title || 'CodeBoard'} />
        <meta property="og:color" content="#8d40bc" />
        <meta name="theme-color" content="#8d40bc" />
        <meta
          property="og:description"
          content={
            description ||
            'CodeBoard is an open-source code sharing platform thats better in every way. With beautiful syntax highlighting and integrated with Prettier.'
          }
        />
        <meta property="og:image" content="/favicon.ico" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cdeboard.vercel.app" />
        <meta property="twitter:title" content={title || 'CodeBoard'} />
        <meta
          property="twitter:description"
          content={
            description ||
            'Codeboard is an open source source code bin website thats better in every way '
          }
        />


        <link key="icon" rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default MetaTags;
