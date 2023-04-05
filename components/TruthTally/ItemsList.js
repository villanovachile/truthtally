import React from 'react';
import Item from './Item';
import styles from '@/styles/TruthTally.module.css';

const ItemsList = (props) => {
  const { listState, items, handleRemoveItem } = props;

  return (
    <div className={styles['items-list']}>
      {items.map((item) => (
        <Item
          listState={listState}
          item={item.item}
          handleRemoveItem={handleRemoveItem}
          id={item.id}
          key={item.id.toString()}
        />
      ))}
    </div>
  );
};

export default ItemsList;
