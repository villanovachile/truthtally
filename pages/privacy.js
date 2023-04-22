import Head from 'next/head';
import Link from 'next/link';

const Privacy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Truth Tally</title>
        <meta property="og:title" content="Privacy Policy" />
        <meta name="twitter:title" content="Privacy Policy" />
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
        <h1>Privacy Policy</h1>
        <p>
          At Truth Tally, privacy is taken seriously. The importance of protecting personal information is understood,
          and Truth Tally is committed to keeping it safe and secure. This Privacy Policy explains how personal
          information is collected, used, and protected when using the Truth Tally website or mobile app.
        </p>
        <h3>Data Collection and Use</h3>
        <p>
          Truth Tally does not collect any personal information when using the site. However, when a user shares a list
          with friends, that list is stored in the Truth Tally database. This list may include personal information that
          the user has entered, such as their name when sharing a list. While the content of the shared lists is not
          monitored, Truth Tally encourages users to refrain from entering any personal information that they do not
          want to be shared with others.
        </p>
        <p>
          Truth Tally uses Firebase anonymous authentication to provide a seamless user experience without requiring
          users to create an account. No personally identifiable information is collected during this process, and no
          user IDs are stored in the database at this time.
        </p>
        <p>
          Please note that while unlisted lists will not be displayed on the Ranked and Unranked list pages, they are
          still accessible by anyone who has the URL. Additionally, if a user shares an unlisted list with someone and
          that person ranks the list, and shares or makes it listed, the original unranked list will become accessible
          through that shared ranked list. Users are encouraged to be mindful of this when sharing lists.
        </p>
        <h3>Data Protection</h3>
        <p>
          Truth Tally takes reasonable measures to protect personal information from unauthorized access or disclosure.
          Shared lists are stored in a secure database that is only accessible by authorized personnel. Security
          procedures are regularly reviewed to ensure that information remains safe. Firebase anonymous authentication
          is also used to ensure user privacy and security.
        </p>
        <h3>Data Removal</h3>
        <p>
          If a user has shared a list that contains personal information that they would like to remove, please{' '}
          <Link href="/contact">contact Truth Tally</Link>. The list will be promptly removed from the database and any
          necessary steps will be taken to ensure that the information is no longer accessible.
        </p>
        <h3>Changes to the Privacy Policy</h3>
        <p>
          Truth Tally reserves the right to update or modify this Privacy Policy at any time. Any changes will be
          reflected on this page, and a user&rsquo;s continued use of the site after such changes have been made will
          constitute their acceptance of the revised policy.
        </p>
        <h3>Contact Truth Tally</h3>
        <p>
          If there are any questions or concerns about the Privacy Policy, please{' '}
          <Link href="/contact">contact Truth Tally</Link>.
        </p>
      </div>
    </>
  );
};

export default Privacy;
