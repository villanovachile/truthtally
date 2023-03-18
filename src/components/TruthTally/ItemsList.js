import React from "react";
import Item from "./Item";

const ItemsList = ({ listState, items, handleAddItem, gameState, handleRemoveItem }) => {
  // if (gameState === "start") {

  return (
    <div className="items-list">
      {items.map((item) => (
        <Item listState={listState} item={item.item} handleRemoveItem={handleRemoveItem} score={item.score} id={item.id} key={item.id.toString()} />
      ))}
    </div>
  );
  // }
};

export default ItemsList;
