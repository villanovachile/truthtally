import React from 'react';
import Item from './Item';
import AddItemForm from './AddItemForm';

const ItemsList = ({items, handleAddItem, gameState, handleRemoveItem}) => {

  if (gameState === 'start') {
    return (
        <div className="items-list">

        <AddItemForm 
        handleAddItem={handleAddItem}
        items={items}
        />
                  {items.map(item =>
        <Item
          item={item.item}
          handleRemoveItem={handleRemoveItem}
          score={item.score}
          id={item.id}
          key={item.id.toString()}
        />
      )}

        </div>
    );
  }
}

export default ItemsList;