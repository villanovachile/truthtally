import Head from 'next/head';
import '@/styles/globals.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import { ReactNotifications } from 'react-notifications-component';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false; /* eslint-disable import/first */
export default function App({ Component, pageProps }) {
  return (
    <>
      <ReactNotifications />
      <Head>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>Truth Tally</title>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="List Ranker" />
        <meta name="author" content="Daniel Rodriguez" />
        <meta property="og:image" key="og:image" content="/images/og-image.png" />
        <meta name="keywords" content="bias, ranker, list sorter, HTML, CSS, JavaScript, React" />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
