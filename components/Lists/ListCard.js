import Link from 'next/link';
import styles from '@/styles/Lists.module.css';

const ListCard = ({ lists }) => {
  return (
    <>
      {lists.map((list, index) => (
        <div className={styles['list-card']} key={index}>
          <Link href={`/list/${list.uri}`}>
            <h3>{list.title}</h3>
          </Link>
          <p>
            {list.type === 'unranked'
              ? list.author && 'created by ' + list.author
              : list.author && 'ranked by ' + list.author}
          </p>
        </div>
      ))}
    </>
  );
};

export default ListCard;
