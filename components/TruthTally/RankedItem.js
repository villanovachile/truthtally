import React from 'react';
import styles from '@/styles/TruthTally.module.css';

const RankedItem = (props) => {
  const { item, id } = props;
  let rankedItem = `${id}. ${item}`;
  return <div className={styles['ranked-item']}>{rankedItem}</div>;
};
export default RankedItem;
