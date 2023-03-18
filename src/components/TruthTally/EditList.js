import React, { useState } from "react";
import Item from "./Item";
import AddItemForm from "./AddItemForm";

const EditList = ({ listState, items, setItems, handleAddItem, gameState, handleRemoveItem }) => {
  // if (gameState === "start") {
  const [inputIdEdited, setInputIdEdited] = useState();
  return (
    <div className="items-list">
      <AddItemForm handleAddItem={handleAddItem} items={items} />
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
        />
      ))}
    </div>
  );
  // }
};

export default EditList;
