import React, { useRef } from 'react';

const AddItemForm = ({ updateDraggableListItems, setInputIdEdited, setEditingTitle, handleAddItem, items }) => {
  const itemInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    let dupe = false;
    const input = itemInput.current.value.toLowerCase().replace(/\s+/g, '');
    items.forEach((item) => {
      if (item.item.toLowerCase().replace(/\s+/g, '') === input) {
        dupe = true;
      }
    });

    if (!dupe && input) {
      handleAddItem(itemInput.current.value.replace(/(^|\s)[a-z]/g, (f) => f.toUpperCase()));
      e.currentTarget.reset();
    }
  };

  return (
    <div className="add-item-form">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          ref={itemInput}
          onFocus={() => {
            setInputIdEdited('add-item');
            setEditingTitle(false);
          }}
          placeholder="Enter an item"
        />
        <input type="submit" value="+" />
      </form>
    </div>
  );
};

export default AddItemForm;
