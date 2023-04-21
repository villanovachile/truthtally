import { useRouter } from 'next/router';
import ListCard from './ListCard';
import Pagination from './Pagination';
import SearchFilterSort from './SearchFilterSort';
import styles from '@/styles/Lists.module.css';

const Lists = ({ ...props }) => {
  const { lists, totalCount, type, totalPages, currentPage } = props;
  const listType = type === 'ranked' ? 'Ranked' : 'Unranked';
  const navigate = useRouter();

  return (
    <>
      <div className={styles['lists-container']}>
        <h1>{listType} Lists</h1>

        <SearchFilterSort type={type} />
        {totalCount > 0 && (
          <>
            <Pagination totalPages={totalPages} currentPage={currentPage} type={type} />
            <p>
              <b>Total: {totalCount} </b>
            </p>
            <div className={styles['list-cards-container']}>
              <ListCard lists={lists} />
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} type={type} />
          </>
        )}
        {totalCount === 0 && (
          <>
            <p>No results found</p>
          </>
        )}
      </div>
    </>
  );
};

export default Lists;
