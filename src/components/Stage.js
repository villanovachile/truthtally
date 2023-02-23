import React from 'react';
import ItemCard from './ItemCard';

const Stage = ({pairs, gameState}) => {

if (pairs.length) {

let key = 1;

return (
    <div className='stage-container'>
        
        {
            pairs.map(pairItems =>
                pairItems.map(pairItem =>
                    <ItemCard key={key++} pairedItem={pairItem.item} />
                )
            )
            }
        
    </div>
)
    }
}

export default Stage;