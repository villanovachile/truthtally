import React, { useState, useRef } from 'react';

const Item = ({
  setEditingTitle,
  inputIdEdited,
  setInputIdEdited,
  listState,
  setItems,
  item,
  items,
  id,
  handleRemoveItem,
  updateDraggableListItems
}) => {
  //   const [editingItem, setEditingItem] = useState(false);
  //   const itemInput = useRef();

  const [itemInput, setItemInput] = useState(item);
  const inputRef = useRef(null);

  function handleInputChange(event) {
    setItemInput(event.target.value);
  }

  const editedItemSubmit = (e) => {
    e.preventDefault();

    inputRef.current.blur();

    if (itemInput.trim() === '') {
      setItemInput(item);
      return;
    }

    let dupe = false;
    const input = itemInput.toLowerCase().replace(/\s+/g, '');
    if (input === '') {
      setItemInput(item);
      return;
    }

    items.forEach((item) => {
      if (item.item.toLowerCase().replace(/\s+/g, '') === input) {
        dupe = true;
      }
    });

    if (!dupe && input) {
      items.forEach((item, i) => {
        if (item.id === id) {
          const newItem = {
            ...item,
            item: itemInput.replace(/(^|\s)[a-z]/g, (f) => f.toUpperCase())
          };
          const newArray = [...items];
          newArray.splice(i, 1, newItem);
          setItems(newArray);
        }
      });
    } else {
      //   setEditingItem(false);

      return;
    }
    // setEditingItem(false);
  };

  //   useEffect(() => {
  //     if (inputIdEdited !== id) {
  //       setEditingItem(false);
  //     }
  //   }, [id, inputIdEdited]);

  return (
    <div className="list-item">
      <div className="remove-item">
        {listState === 'edit' && (
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
            fill="red"
            width={10}
            height={10}
            className="svg-button"
            onClick={() => handleRemoveItem(id)}>
            <path
              d="M6,6H6a20.53,20.53,0,0,1,29,0l26.5,26.49L87.93,6a20.54,20.54,0,0,1,29,
                    0h0a20.53,20.53,0,0,1,0,29L90.41,61.44,116.9,87.93a20.54,20.54,0,0,1,0,
                    29h0a20.54,20.54,0,0,1-29,0L61.44,90.41,35,116.9a20.54,20.54,0,0,1-29,
                    0H6a20.54,20.54,0,0,1,0-29L32.47,61.44,6,34.94A20.53,20.53,0,0,1,6,6Z"
            />
          </svg>
        )}
      </div>
      <div className="item-name">
        {listState === 'edit' ? (
          <form
            onSubmit={(e) => {
              editedItemSubmit(e);
            }}>
            <input
              onBlur={(e) => {
                editedItemSubmit(e);
              }}
              style={{ width: itemInput.length + 3 + 'ch' }}
              className="edit-item-input"
              type="text"
              value={itemInput}
              onChange={handleInputChange}
              ref={inputRef}></input>
          </form>
        ) : (
          item
        )}
      </div>
    </div>
  );
};

export default Item;
