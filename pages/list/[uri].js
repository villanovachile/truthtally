import Head from 'next/head';
import TruthTally from '@/components/TruthTally/TruthTally';

const TruthTallyURI = ({ uri, listData }) => {
  const listTitle = listData.title;
  const listAuthor = listData.author;
  const rankedTitle = listAuthor ? `${listTitle} ranked by ${listAuthor}` : `${listTitle} ranked`;
  const unrankedTitle = listAuthor ? `${listTitle} created by ${listAuthor}` : `${listTitle}`;

  const titlePrefix = listData.type === 'unranked' ? unrankedTitle : rankedTitle;
  const title = `${titlePrefix} | Truth Tally`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={titlePrefix} />
        <meta name="twitter:title" content={titlePrefix} />
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

      <TruthTally uri={uri} listData={listData} />
    </>
  );
};

export async function getServerSideProps(context) {
  const { uri } = context.params;
  const { v } = context.query;

  try {
    let apiUrl = `${process.env.API_URL}/api/get_list?uri=${uri}`;
    if (v) {
      apiUrl += `&v=${v}`;
    }

    const response = await fetch(apiUrl);

    const listData = await response.json();

    if (listData === 'not_found') {
      return {
        notFound: true
      };
    }

    return {
      props: {
        uri,
        listData
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: 'Failed to fetch data'
      }
    };
  }
}

export default TruthTallyURI;
