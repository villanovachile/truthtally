import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Lists.module.css';

const SearchFilterSort = ({ type }) => {
  const [searchType, setSearchType] = useState('title');
  const [sortType, setSortType] = useState('title_asc');
  const searchInput = useRef();
  const navigate = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // setSortType('title_asc');
    const currentParams = new URLSearchParams(navigate.asPath.split('?')[1]);
    currentParams.set('sort', sortType);
    navigate.push(`/lists/${type}?${searchType}=${searchInput.current.value}&sort=${sortType}`);
  };

  const handleSortChange = (e) => {
    const sortType = e.target.value;
    setSortType(e.target.value);
    const currentParams = new URLSearchParams(navigate.asPath.split('?')[1]);
    currentParams.set('sort', sortType);
    currentParams.set('page', 1);
    const queryString = currentParams.toString();
    navigate.push(`/lists/${type}?${queryString}`);
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
        <select value={sortType} onChange={handleSortChange}>
          <option value="title_asc">Title: A-Z</option>
          <option value="title_desc">Title: Z-A</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popularity">Popular</option>
        </select>
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchFilterSort;