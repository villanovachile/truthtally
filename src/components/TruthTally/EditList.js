import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  handleRemoveItem,
  draggableListItems,
  updateDraggableListItems
}) => {
  // if (gameState === "start") {

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    let id = 1;
    const tempItems = Array.from(draggableListItems);
    const [reorderedItem] = tempItems.splice(result.source.index, 1);
    tempItems.splice(result.destination.index, 0, reorderedItem);
    updateDraggableListItems(tempItems);
  }

  useEffect(() => {
    setItems(draggableListItems);
  }, [draggableListItems]);

  return (
    <div className="items-list">
      <AddItemForm
        setInputIdEdited={setInputIdEdited}
        setEditingTitle={setEditingTitle}
        handleAddItem={handleAddItem}
        items={items}
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="edit-items">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {draggableListItems.map((item, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <Item
                        listState={listState}
                        setItems={setItems}
                        items={items}
                        item={item.item}
                        handleRemoveItem={handleRemoveItem}
                        score={item.score}
                        id={item.id}
                        inputIdEdited={inputIdEdited}
                        setInputIdEdited={setInputIdEdited}
                        setEditingTitle={setEditingTitle}
                        updateDraggableListItems={updateDraggableListItems}
                        draggableListItems={draggableListItems}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
  // }
};

export default EditList;
