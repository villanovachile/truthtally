import React from 'react';
import Item from './Item';
import AddItemForm from './AddItemForm';

const EditList = ({
  inputIdEdited,
  setInputIdEdited,
  setEditingTitle,
  listState,
  items,
  setItems,
  handleAddItem,
  gameState,
  handleRemoveItem
}) => {
  // if (gameState === "start") {

  return (
    <div className="items-list">
      <AddItemForm
        setInputIdEdited={setInputIdEdited}
        setEditingTitle={setEditingTitle}
        handleAddItem={handleAddItem}
        items={items}
      />
      {items.map((item) => (
        <Item
          listState={listState}
          setItems={setItems}
          items={items}
          item={item.item}
          handleRemoveItem={handleRemoveItem}
          score={item.score}
          id={item.id}
          key={item.id.toString()}
          inputIdEdited={inputIdEdited}
          setInputIdEdited={setInputIdEdited}
          setEditingTitle={setEditingTitle}
        />
      ))}
    </div>
  );
  // }
};

export default EditList;
