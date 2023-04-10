import React from 'react';
import styles from '@/styles/TruthTally.module.css';

const RankedItem = (props) => {
  const { item, id } = props;
  let rankedItem = `${id}. ${item}`;
  return <li>{item}</li>;
  // <div className={styles['ranked-item']}>

  // </div>;
};
export default RankedItem;
