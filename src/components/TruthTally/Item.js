import React from 'react';


const Item = ({item, id, handleRemoveItem}) => {
    return (
        <span className='list-item'>
            <button className='remove-item' onClick={() => handleRemoveItem(id)}>✖</button>
            {item}
        </span>

        
    );
}

export default Item;