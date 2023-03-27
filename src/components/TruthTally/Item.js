import React, { useState, useRef, useEffect } from 'react';
import { Store } from 'react-notifications-component';

const Item = (props) => {
  const {
    setEditingTitle,
    inputIdEdited,
    setInputIdEdited,
    listState,
    setItems,
    item,
    items,
    id,
    handleRemoveItem,
    updateDraggableListItems,
    ...provided
  } = props;

  const [itemInput, setItemInput] = useState(item);
  const inputRef = useRef(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [itemMaxWidth, setItemMaxWidth] = useState('600px');

  const toggleEditingItem = () => {
    setIsEditingItem(!isEditingItem);
  };

  useEffect(() => {
    const handleResize = () => {
      const initialWidth = window.innerWidth;
      setItemMaxWidth(initialWidth > 768 ? '600px' : '60vw');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useOnClickOutside(inputRef, (event) => {
    if (document.activeElement === inputRef.current) {
      editedItemSubmit(event);
    }
  });

  function useOnClickOutside(ref, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchmove', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchmove', listener);
      };
    }, [ref, handler]);
  }

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
            item: itemInput.replace(/(^|\s)[a-z]/g, (f) => f.toUpperCase()).trim()
          };
          const newArray = [...items];
          newArray.splice(i, 1, newItem);
          setItems(newArray);
          updateDraggableListItems(newArray);
        }
        setItemInput(itemInput.replace(/(^|\s)[a-z]/g, (f) => f.toUpperCase()).trim());
      });
    } else {
      setItemInput(item);
      itemInput !== item &&
        Store.addNotification({
          title: 'Duplicate Item',
          message: 'The item already exists in the list',
          type: 'danger',
          insert: 'top',
          isMobile: true,
          breakpoint: 768,
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__slideInDown'],
          animationOut: ['animate__animated', 'animate__slideUp'],
          dismiss: {
            duration: 3000
          }
        });
      return;
    }
  };

  return (
    <div
      className={listState === 'display' ? 'list-item' : 'edit-list-item'}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}>
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
        {listState === 'edit' && isEditingItem ? (
          <form
            onSubmit={(e) => {
              editedItemSubmit(e);
            }}>
            <input
              autoFocus
              onBlur={() => {
                toggleEditingItem();
              }}
              style={{ width: itemInput.length + 3 + 'ch', itemMaxWidth }}
              className="edit-item-input"
              type="text"
              maxLength="100"
              value={itemInput}
              onChange={handleInputChange}
              ref={inputRef}
              onClick={() => inputRef.current.focus()}></input>
          </form>
        ) : (
          <div
            style={
              listState === 'edit'
                ? {
                    backgroundColor: '#e0e0e0',
                    cursor: 'pointer',
                    width: itemInput.length + 3 + 'ch',
                    maxWidth: itemMaxWidth,
                    padding: '0px'
                  }
                : { backgroundColor: '#FFFFFF' }
            }
            onClick={() => {
              listState === 'edit' && toggleEditingItem();
            }}
            title="Click to edit">
            {item}
          </div>
        )}
      </div>
      {listState === 'edit' && (
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <title>Drag list item</title>
            <path d="M2 11h16v2H2zm0-4h16v2H2zm8 11l3-3H7l3 3zm0-16L7 5h6l-3-3z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Item;
