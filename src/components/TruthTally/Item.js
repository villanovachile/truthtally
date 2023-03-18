import React, { useState, useRef, useEffect } from "react";
import PencilIcon from "../../images/pencil-icon";
import XIcon from "../../images/x-icon";

const Item = ({ inputIdEdited, setInputIdEdited, listState, setItems, item, items, id, handleRemoveItem }) => {
  const [editingItem, setEditingItem] = useState(false);
  const itemInput = useRef();

  const editedItemSubmit = (e) => {
    e.preventDefault();
    items.forEach((item, i) => {
      if (item.id === id) {
        const newItem = { ...item, item: itemInput.current.value };
        const newArray = [...items];
        newArray.splice(i, 1, newItem);
        setItems(newArray);
      }
    });
    setEditingItem(false);
  };

  useEffect(() => {
    if (inputIdEdited !== id) {
      setEditingItem(false);
    }
  }, [id, inputIdEdited]);

  return (
    <div className="list-item">
      {/* <span className="list-item"> */}

      {/* {listState === "edit" && (
        <button className="remove-item" onClick={() => handleRemoveItem(id)}>
          ✖
        </button>
      )} */}
      <div className="remove-item">
        {listState === "edit" && (
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.88"
            fill="red"
            width={10}
            height={10}
            className="svg-button"
            onClick={() => handleRemoveItem(id)}
          >
            <path d="M6,6H6a20.53,20.53,0,0,1,29,0l26.5,26.49L87.93,6a20.54,20.54,0,0,1,29,0h0a20.53,20.53,0,0,1,0,29L90.41,61.44,116.9,87.93a20.54,20.54,0,0,1,0,29h0a20.54,20.54,0,0,1-29,0L61.44,90.41,35,116.9a20.54,20.54,0,0,1-29,0H6a20.54,20.54,0,0,1,0-29L32.47,61.44,6,34.94A20.53,20.53,0,0,1,6,6Z" />
          </svg>
        )}
      </div>
      <div className="item-name">
        {editingItem ? (
          <form
            onSubmit={(e) => {
              editedItemSubmit(e);
            }}
          >
            <input autoFocus className="edit-item-input" type="text" ref={itemInput} defaultValue={item}></input>
          </form>
        ) : (
          item
        )}
      </div>
      <div className="edit-item-icon">
        {listState === "edit" && (
          <svg
            fill="#000000"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            width="15px"
            height="15px"
            viewBox="0 0 528.899 528.899"
            className="svg-button"
            onClick={() => {
              setEditingItem(true);
              setInputIdEdited(id);
            }}
          >
            <g>
              <path
                d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
		c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
		C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
		L27.473,390.597L0.3,512.69z"
              />
            </g>
          </svg>
        )}
      </div>
      {/* // </span> */}
    </div>
  );
};

export default Item;
