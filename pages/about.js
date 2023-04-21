import Link from 'next/link';
import Head from 'next/head';

const About = () => {
  return (
    <>
      <Head>
        <title>About | Truth Tally</title>
        <meta property="og:title" content="About" />
        <meta name="twitter:title" content="About" />
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
      <div style={{ textAlign: 'left', margin: '30px' }}>
        <h1>About Truth Tally</h1>
        <p>
          Truth Tally is the ultimate list ranking app that allows you to create custom lists of your favorite things
          and rank them in order of preference. Whether it&rsquo;s music, movies, books, art, or science, Truth Tally
          makes it easy to discover your own truth and share it with your friends.
        </p>
        <p>
          The app began as a create-react-app and has evolved into a Next.js app, thanks to my journey into learning
          React. As a fledgling developer, I wanted to create an app that helped take my interest in building modern,
          responsive web applications to the next level. Truth Tally is the result of that effort, and I am proud to say
          that it has much further along in terms of functionality and scope than I had ever expected.
        </p>
        <p>
          I believe in the power of open source software. That&rsquo;s why my app is available on{' '}
          <Link href="https://github.com/villanovachile/truthtally" target="_blank">
            GitHub
          </Link>
          , where users can report bugs, request features, or even contribute to the codebase themselves. I believe that
          collaboration is the key to creating great software, and am excited to see where the community takes Truth
          Tally in the future.
        </p>
        <p>Thank you for using Truth Tally, and happy list-making!</p>
      </div>
    </>
  );
};

export default About;
