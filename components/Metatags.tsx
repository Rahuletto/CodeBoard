// NextJS stuff
import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  k?: string;
  err404?: boolean;
  docs?: boolean
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, k, err404, docs }) => {
  return (
    <>
      <Head>
        <title>{title || 'CodeBoard'}</title>
        <meta name="title" content={title || 'CodeBoard'} />
        <meta
          name="description"
          content={
            description ||
            'CodeBoard is a community-driven code sharing platform built by developers, for developers. With beautiful syntax highlighting and integrated with Prettier.'
          }
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codeboard.tech" />
        <meta property="og:title" content={title || 'CodeBoard'} />
        <meta property="og:color" content={err404 ? "#ff5656" : "#a95fd6"} />
        <meta name="theme-color" content={err404 ? "#ff5656" : "#a95fd6"} />
        <meta
          property="og:description"
          content={
            description ||
            'CodeBoard is a community-driven code sharing platform built by developers, for developers. With beautiful syntax highlighting and integrated with Prettier.'
          }
        />
        <meta
          property="og:image"
          content={
            docs
              ? '/docs-og.png'
              : k
              ? `https://codeboard.tech/api/og?title=${title}&desc=${description}&key=${k}`
              : '/home-og.png'
          }
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://codeboard.tech" />
        <meta property="twitter:title" content={title || 'CodeBoard'} />
        <meta
          property="twitter:image"
          content={
            err404
              ? '/err-og.png'
              : k
              ? `https://codeboard.tech/api/og?title=${title}&desc=${description}&key=${k}`
              : '/home-og.png'
          }
        />
        <meta
          property="twitter:description"
          content={
            description ||
            'CodeBoard is a community-driven code sharing platform built by developers, for developers.'
          }
        />

        <link key="icon" rel="icon" href="/favicon.ico" />
        <meta
          name="google-site-verification"
          content="0Cmv3J0IwkFN7JLhsv8jWAnIlX3SaPHFrlIlWy4kzK4"
        />
      </Head>
    </>
  );
};

export default MetaTags;
// Who needs to use block. This doesnt even render as page
