import Head from 'next/head';
import TruthTally from '@/components/TruthTally/';

const TruthTallyIndex = () => {
  return (
    <>
      <Head>
        <title>Create a list... | Truth Tally</title>
        <meta property="og:title" content="Create a list.." />
        <meta name="twitter:title" content="Create a list.." />
        <meta name="description" content="Truth Tally Ranker" />
        <meta property="og:image" key="og:image" content="/images/og-image.png" />
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <TruthTally />;
    </>
  );
};

export default TruthTallyIndex;
