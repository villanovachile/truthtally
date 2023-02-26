import React from 'react';
import ResultItem from './ResultItem';

const Results = ({gameState, items}) => {

    if ( gameState === 'finished' ) {
        let rank = 1
        let key = 1
        return (
            <div className='results-container'>
                <h2>Results</h2>
                {
                    items.sort((a,b) => b.score - a.score).map(item => 
                    
                    <ResultItem
                    rank={rank++}
                    item={item.item}
                    key={key++}
                    />
                    )
                    
                }

            </div>
        )
    }
}

export default Results;