import React from 'react';

const ItemCard = ({pairedItem}) => {
    let key = 0;
    
    return (
        <div className='item-card' key={key++}>
            {pairedItem}
        </div>
    )
}

export default ItemCard;