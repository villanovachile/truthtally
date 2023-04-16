import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Lists.module.css';

const Pagination = ({ ...props }) => {
  const { totalPages, currentPage, type } = props;
  const navigate = useRouter();
  return (
    <div className={styles['list-pagination']}>
      <span>PAGE: </span>
      {Array.from({ length: totalPages }, (_, i) => {
        const currentParams = new URLSearchParams(navigate.asPath.split('?')[1]);
        currentParams.set('page', i + 1);
        const queryString = currentParams.toString();
        return (
          <Link
            className={styles[i + 1 === parseInt(currentPage) ? 'pagination-current-page' : 'pagination-page']}
            key={i}
            href={`/lists/${type}?${queryString}`}>
            {i + 1}
          </Link>
        );
      })}
    </div>
  );
};

export default Pagination;
