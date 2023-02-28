import React from 'react';


const Stage = ({gameState, setGameState, items, pairs, setPairs, setItems, currentIndex, setLoadingText, setGameCompleted}) => {


    if (pairs.length && gameState === 'inProgress') {
    
        let key = 1;
    
        function nextRound(currentSelection) {
                    
            if (currentIndex.current <= pairs.length -1 ) {
                
                    items.map((item, i) => {
                        if (item.id === currentSelection.id){
                            
                            const newArray = items.map((item, n) => {
                                if (i === n) {
                                    
                                    
                                return { ...item, score: items[i].score + 1};
                                } else {
                                    
                                    
                                return item;
                                }
                            });
                            
                            setItems(newArray);
                            
                            
                            
                        }
                    }
                )
                if (currentIndex.current === pairs.length -1) {
                    currentIndex.current = 0;
                    setPairs([]);
                    setGameCompleted(true)
                    setLoadingText('Tabulating results...')
                    setGameState('loading');

                } else {
                    currentIndex.current++
                }
            }
            }
        


        return (
            <>
            <div className='stage-header'>Battle {currentIndex.current + 1} of {pairs.length} </div>
            
            
            <div className='stage-container'>
            

                    <div className='item-card' onClick={(e) => nextRound(pairs[currentIndex.current][0])}>
                        {pairs[currentIndex.current][0].item}
                    </div>
                    <div className='item-card-divider'>vs.</div>
                    <div className='item-card' key={key++} onClick={(e) => nextRound(pairs[currentIndex.current][1])}>
                    {pairs[currentIndex.current][1].item}
                    </div>

            </div>
            </>
        )
    }
}

export default Stage;