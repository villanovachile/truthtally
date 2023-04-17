import Link from 'next/link';
import ListCard from '@/components/Lists/ListCard';
import styles from '@/styles/Home.module.css';

import Image from 'next/image';

const Home = (props) => {
  return (
    <>
      <h1> Truth Tally</h1>
      <div className={styles['feature-container']}>
        <Image src="/images/pexels-cottonbro-studio-3693108.jpg" alt="music" height="400" width="267"></Image>
        <span>
          <p>
            Welcome to Truth Tally, the app that lets you create and rank custom lists of your favorite things. With
            Truth Tally, you can easily organize your interests, from music and movies to books, art, and science. Once
            you&rsquo;ve added your items, you can rank them in order of preference, allowing you to see which ones
            truly matter to you.
          </p>
          <p>
            But that&rsquo;s not all. With Truth Tally, you can also share your lists with your friends, both unranked
            and ranked. Show them what you&rsquo;re into and get their feedback, or challenge them to create their own
            lists and see how they compare to yours.
          </p>
          <p>
            And if you&rsquo;re looking for inspiration, check out our premade lists, featuring curated selections of
            the best in pop culture, history, and more. Whether you&rsquo;re a casual fan or a serious aficionado,
            you&rsquo;ll find something to love on Truth Tally.
          </p>
          <p>
            So why wait? <Link href="/list/">Create a list</Link> and start organizing your truth.
          </p>
        </span>
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

export async function getStaticProps() {
  try {
    const [unrankedNewest, rankedNewest, unrankedPopular, rankedPopular] = await Promise.all([
      fetch(`${process.env.API_URL}/api/get_lists?type=unranked&sort=newest&limit=8`),
      fetch(`${process.env.API_URL}/api/get_lists?type=ranked&sort=newest&limit=8`),
      fetch(`${process.env.API_URL}/api/get_lists?type=unranked&sort=popularity&limit=8`),
      fetch(`${process.env.API_URL}/api/get_lists?type=ranked&sort=popularity&limit=8`)
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
      },
      revalidate: 3600
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
