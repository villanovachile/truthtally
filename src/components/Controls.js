import React from 'react';

const Controls = ({items, setItems, nextItemId, setPairs, updatePairsList, gameState, setGameState, currentIndex}) => {

    const genList = () => {
        
        const generatePairs = (arr) => {
        
          const result = [];
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              result.push([arr[i], arr[j]]);
            }
          }
          setGameState('inProgress')
          return result;
        }

        updatePairsList(generatePairs(items));
        
      }

      const clearList = () => {
        setItems([]);
        nextItemId.current = 0;
      }

    const rateAgain = () => {
        const resetScores = items.map(item => ({ ...item, score: 0 }));
        setItems(resetScores);
        currentIndex.current = 0;
        genList();
        setGameState('inProgress')
      }

    const startOver = () => {
        setItems([]);
        setPairs([]);
        setGameState('start');
        nextItemId.current = 0;
        currentIndex.current = 0;

    }
    
    return (
        <div className='controls'>

            {items.length > 2 && gameState === 'start' ? <button onClick={() => genList()}>Begin</button> : null}

            {items.length > 0 && gameState === 'start' ? <button onClick={() => clearList()}>Clear</button> : null}

            {gameState !== 'start' ? <button onClick={() => startOver()}>Start Over</button> : null }
            
            {gameState !== 'start' ? <button onClick={() => rateAgain()}>Rate Again</button> : null }


        </div>
    )
}

export default Controls;