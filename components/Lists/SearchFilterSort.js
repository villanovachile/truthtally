import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Lists.module.css';

const SearchFilterSort = ({ type }) => {
  const [searchType, setSearchType] = useState('title');
  const searchInput = useRef();
  const navigate = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate.push(`/lists/${type}?${searchType}=${searchInput.current.value}`);
  };

  return (
    <div className={styles['search-filter-sort']}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="Search" ref={searchInput} />

        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">Title</option>
          <option value="tags">Tags</option>
          <option value="items">Items</option>
          <option value="all">All</option>
        </select>
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchFilterSort;
