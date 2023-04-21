import ListCard from '@/components/Lists/ListCard';
import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/Lists.module.css';

const ListsIndex = (props) => {
  return (
    <>
      <Head>
        <title>Browse Lists | Truth Tally</title>
        <meta property="og:title" content="Browse Lists" />
        <meta name="twitter:title" content="Browse Lists" />
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
      <div className={styles['lists-index-container']}>
        <div className={styles['lists-links-container']}>
          <div className={styles['unranked-lists-link-div']}>
            <Link href="/lists/unranked">
              <h2>Unranked Lists</h2>
            </Link>
          </div>
          <div className={styles['ranked-lists-link-div']}>
            <Link href="/lists/ranked">
              <h2>Ranked Lists</h2>
            </Link>
          </div>
        </div>
        <h2>Latest Unranked Lists</h2>
        <div className={styles['list-cards-container']}>
          <ListCard lists={props.unrankedListsNewest.lists} />
        </div>
        <h2>Latest Ranked Lists</h2>
        <div className={styles['list-cards-container']}>
          <ListCard lists={props.rankedListsNewest.lists} />
        </div>
        <h2>Most Popular Unranked Lists</h2>
        <div className={styles['list-cards-container']}>
          <ListCard lists={props.unrankedListsPopular.lists} />
        </div>
        <h2>Most Popular Ranked Lists</h2>
        <div className={styles['list-cards-container']}>
          <ListCard lists={props.rankedListsPopular.lists} />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const [unrankedNewest, rankedNewest, unrankedPopular, rankedPopular] = await Promise.all([
      fetch(`${process.env.API_URL}/api/get_lists?type=unranked&sort=newest&limit=8&skipCount=true`),
      fetch(`${process.env.API_URL}/api/get_lists?type=ranked&sort=newest&limit=8&skipCount=true`),
      fetch(`${process.env.API_URL}/api/get_lists?type=unranked&sort=popularity&limit=8&skipCount=true`),
      fetch(`${process.env.API_URL}/api/get_lists?type=ranked&sort=popularity&limit=8&skipCount=true`)
    ]);

    const unrankedListsNewest = await unrankedNewest.json();
    const rankedListsNewest = await rankedNewest.json();
    const unrankedListsPopular = await unrankedPopular.json();
    const rankedListsPopular = await rankedPopular.json();

    return {
      props: {
        unrankedListsNewest,
        rankedListsNewest,
        unrankedListsPopular,
        rankedListsPopular
      }
      // revalidate: 3600
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

export default ListsIndex;
