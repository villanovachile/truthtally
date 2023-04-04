import React from 'react';
import styles from '@/styles/TruthTally.module.css';

const Stage = (props) => {
  const {
    gameState,
    setGameState,
    items,
    pairs,
    setPairs,
    setItems,
    currentIndex,
    setLoadingText,
    setRankingCompleted
  } = props;

  if (pairs.length && gameState === 'inProgress') {
    function nextRound(currentSelection) {
      if (currentIndex.current <= pairs.length - 1) {
        items.forEach((item, i) => {
          if (item.id === currentSelection.id) {
            const newArray = items.map((item, n) => {
              if (i === n) {
                return { ...item, score: items[i].score + 1 };
              } else {
                return item;
              }
            });

            setItems(newArray);
          }
        });
        if (currentIndex.current === pairs.length - 1) {
          currentIndex.current = 0;
          setPairs([]);
          setRankingCompleted(true);
          setLoadingText('Tabulating results...');
          setGameState('loading');
        } else {
          currentIndex.current++;
        }
      }
    }

    return (
      <>
        <div className={styles['stage-header']}>
          Round {currentIndex.current + 1} of {pairs.length}
        </div>

        <div className={styles['stage-container']}>
          <button className={styles['item-card']} onClick={(e) => nextRound(pairs[currentIndex.current][0])}>
            {pairs[currentIndex.current][0].item}
          </button>
          <div className={styles['item-card-divider']}>vs.</div>
          <button className={styles['item-card']} onClick={(e) => nextRound(pairs[currentIndex.current][1])}>
            {pairs[currentIndex.current][1].item}
          </button>
        </div>
      </>
    );
  }
};

export default Stage;
