import Link from 'next/link';
import ListCard from './ListCard';
import SearchFilterSort from './SearchFilterSort';
import styles from '@/styles/Lists.module.css';

const Lists = ({ ...props }) => {
  const { lists, totalCount, type, totalPages, currentPage } = props;
  const listType = type === 'ranked' ? 'Ranked' : 'Unranked';

  return (
    <>
      <div className={styles['lists-container']}>
        <h1>{listType} Lists</h1>
        <p>Total number of lists: {totalCount} </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <p>Type: {type}</p>
        <SearchFilterSort type={type} />
        <div className={styles['list-cards-container']}>
          <ListCard lists={lists} />
        </div>

        <div className={styles['list-pagination']}>
          <span>PAGE: </span>
          {Array.from({ length: totalPages }, (_, i) => {
            return (
              <Link
                className={styles[i + 1 === parseInt(currentPage) ? 'pagination-current-page' : 'pagination-page']}
                key={i}
                href={`/lists/${type}?page=${i + 1}`}>
                {i + 1}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Lists;
