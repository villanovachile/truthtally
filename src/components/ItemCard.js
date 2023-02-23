import React from 'react';

const ItemCard = ({pairedItem}) => {
    let key = 0;
    
    return (
        <div className='item-card' key={key++} onClick={(e) => console.log('it worked')}>
            {pairedItem}
        </div>
    )
}

export default ItemCard;