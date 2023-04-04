import React from 'react';
import RankedItem from './RankedItem';
import styles from '@/styles/TruthTally.module.css';

const RankedList = (props) => {
  const { listAuthor, listTitle, gameState, items } = props;
  const gameFinished = gameState === 'finished';
  return (
    gameFinished && (
      <div className={styles['results-container']}>
        <div className={styles['ranked-list-title']}>
          <h2>{listTitle}</h2>
          <h3>{listAuthor ? 'Ranked by ' + listAuthor : 'Ranked'}</h3>
        </div>
        <div className={styles['ranked-items']}>
          {items
            .sort((a, b) => b.score - a.score)
            .map((item, index) => (
              <RankedItem item={item.item} id={index + 1} key={index} />
            ))}
        </div>
      </div>
    )
  );
};

export default RankedList;
