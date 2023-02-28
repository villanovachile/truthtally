import React from 'react';

const Controls = ({items, setItems, nextItemId, setPairs, updatePairsList, gameState, setGameState, currentIndex, setLoadingText, setGameCompleted}) => {

    const genList = () => {
        
        const generatePairs = (arr) => {
            const result = [];
            for (let i = 0; i < arr.length; i++) {
              for (let j = i + 1; j < arr.length; j++) {
                result.push([arr[i], arr[j]]);
              }
            }
            setLoadingText('Generating pairs...');
            setGameCompleted(false);
            setGameState('loading');
            // Shuffle the array of pairs
            for (let i = result.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
          };
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
        setGameCompleted(false)
        setGameState('inProgress')
      }

    const startOver = () => {
        setItems([]);
        setPairs([]);
        setGameCompleted(false)
        setGameState('start');
        nextItemId.current = 0;
        currentIndex.current = 0;

    }
    
    return (
        <div className='controls'>

            {items.length > 2 && gameState === 'start' ? <button onClick={() => genList()}>Begin</button> : null}

            {items.length > 0 && gameState === 'start' ? <button onClick={() => clearList()}>Clear</button> : null}

            {gameState !== 'start' && gameState !== 'loading' ? <button onClick={() => startOver()}>Start Over</button> : null }
            
            {gameState !== 'start' && gameState !== 'loading' ? <button onClick={() => rateAgain()}>Rate Again</button> : null }


        </div>
    )
}

export default Controls;