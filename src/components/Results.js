import React from 'react';
import ResultItem from './ResultItem';

const Results = ({gameState, items}) => {

    if ( gameState === 'finished' ) {
        let key = 1
        return (
            <div className='results-container'>
                <h2>Results</h2>
                <ol>
                {
                    items.sort((a,b) => b.score - a.score).map(item => 
                    
                    <ResultItem
                    item={item.item}
                    key={key++}
                    />
                    )
                    
                }
                </ol>

            </div>
        )
    }
}

export default Results;