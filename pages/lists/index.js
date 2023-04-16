import ListCard from '@/components/Lists/ListCard';
import styles from '@/styles/Lists.module.css';

const ListsIndex = (props) => {
  return (
    <div className={styles['lists-index-container']}>
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
  );
};

export async function getServerSideProps(context) {
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

export default ListsIndex;
