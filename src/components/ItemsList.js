import React from 'react';
import Item from './Item';
import AddItemForm from './AddItemForm';

const ItemsList = ({items, addItem, pairs, updatePairsList, gameState, setGameState}) => {

  if (gameState === 'start') {
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

        </div>
    );
  }
}

export default ItemsList;