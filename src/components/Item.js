import React from 'react';


const Item = ({item, id, removeItem}) => {
    return (
        <span className='list-item'>
            <button className='remove-item' onClick={() => removeItem(id)}>✖</button>
            {item}
        </span>

        
    );
}

export default Item;