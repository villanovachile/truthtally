import React from 'react';


const Item = ({item, score, items}) => {
    return (
        <div className='list-item'>{item}({score})</div>

        
    );
}

export default Item;