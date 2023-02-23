import React from 'react';
import Item from './Item';
import GenPairs from './GenPairs';
import AddItemForm from './AddItemForm';

const ItemsList = ({items, addItem, pairs, updatePairsList}) => {
    return (
        <div className="items-list">

        <AddItemForm 
        addItem={addItem}
        items={items}
        />
                  {items.map(item =>
        <Item
          item={item.item}
          score={item.score}
          id={item.id}
          key={item.id.toString()}
        />
      )}
      
      <GenPairs
        items={items}
        updatePairsList={updatePairsList}
        pairs={pairs}
        />
        </div>
    );
}

export default ItemsList;