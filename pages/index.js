import Head from 'next/head';
import ListCard from '@/components/Lists/ListCard';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Home = (props) => {
  const navigate = useRouter();
  return (
    <>
      <Head>
        <title>Truth Tally | List Ranker</title>
        <meta property="og:title" content="Truth Tally" />
        <meta name="twitter:title" content="Truth Tally" />
        <meta name="description" content="List Ranker / Bias Sorter" />
        <meta property="og:image" key="og:image" content="/images/og-image.png" />
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className={styles['feature-container']}>
        <div className={styles['feature-container-image']}>
          <Image
            src="/images/truthtally-home-feature.png"
            alt="Truth Tally Home Feature"
            height="256"
            width="400"></Image>
        </div>
        <div className={styles['feature-container-description']}>
          <p>
            Welcome to Truth Tally, the app that lets you create and rank custom lists of your favorite things. With
            Truth Tally, you can easily organize your interests, from music and movies to books, art, science, and more.
          </p>
          <button onClick={() => navigate.push('/list')}>Create a List</button>
          <button onClick={() => navigate.push('/lists')}>Browse Lists</button>
        </div>
      </div>
      <div className={styles['feature-container']}>
        <div className={styles['feature-container-description']}>
          <h3>Create a list</h3>
          <p>
            The first step to using Truth Tally is to create a list of your favorite things. Whether you&rsquo;re a
            music buff, a movie fanatic, or an art lover, you can easily add items to your list using our user-friendly
            interface. You can create as many lists as you want, and each list can include up to 50 items.
          </p>
        </div>
        <div className={styles['feature-container-image']}>
          <Image
            src="/images/truthtally-home-flow-01.png"
            alt="Truth Tally Home Feature"
            height="300"
            width="400"></Image>
        </div>
      </div>

      <div className={styles['feature-container']}>
        <div className={styles['feature-container-image']}>
          <Image
            src="/images/truthtally-home-flow-02.png"
            alt="Truth Tally Home Feature"
            height="300"
            width="400"></Image>
        </div>
        <div className={styles['feature-container-description']}>
          <h3>Rank the items in your list</h3>
          <p>
            Once you&rsquo;ve created your list, it&rsquo;s time to rank the items. Our unique ranking system generates
            pairs of items for you to choose from. Simply select your preferred item from each pair, and our algorithm
            will calculate the score for each item based on your preferences.
          </p>
        </div>
      </div>

      <div className={styles['feature-container']}>
        <div className={styles['feature-container-description']}>
          <h3>Share your list with friends</h3>
          <p>
            Finally, it&rsquo;s time to share your list with friends! You can easily share your unranked and ranked
            lists with your friends via social media, email, or any other messaging platform. See if your friends agree
            with your rankings, or challenge them to create their own lists and see how they compare to yours.
          </p>
        </div>
        <div className={styles['feature-container-image']}>
          <Image
            src="/images/truthtally-home-flow-03.png"
            alt="Truth Tally Home Feature"
            height="300"
            width="400"></Image>
        </div>
      </div>

      <div className={styles['lists-index-container']}>
        <div className={styles['list-cards-container']}>
          <h2>Latest Unranked Lists</h2>
          <ListCard lists={props.unrankedListsNewest.lists} />
        </div>

        <div className={styles['list-cards-container']}>
          <h2>Latest Ranked Lists</h2>
          <ListCard lists={props.rankedListsNewest.lists} />
        </div>

        <div className={styles['list-cards-container']}>
          <h2>Popular Unranked Lists</h2>
          <ListCard lists={props.unrankedListsPopular.lists} />
        </div>

        <div className={styles['list-cards-container']}>
          <h2>Popular Ranked Lists</h2>
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

export default Home;
