import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 Not Found | Truth Tally</title>
        <meta property="og:title" content="404 Not Found" />
        <meta name="twitter:title" content="404 Not Found" />
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
      <div className="error404-div">
        <h1>Error 404</h1>
        <Image src="/images/logo192.png" alt="Truth Tally logo" width={100} height={100} />
        <h2>Not Found</h2>
        <Link href="/list">CREATE A NEW LIST</Link>
      </div>
    </>
  );
};

export default NotFoundPage;
