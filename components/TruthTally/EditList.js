import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import Item from './Item';
import AddItemForm from './AddItemForm';
import styles from '@/styles/TruthTally.module.css';

const Droppable = dynamic(() => import('react-beautiful-dnd').then((module) => module.Droppable), { ssr: false });

const EditList = (props) => {
  const {
    inputIdEdited,
    setInputIdEdited,
    setEditingTitle,
    listState,
    items,
    setItems,
    handleAddItem,
    handleRemoveItem,
    draggableListItems,
    updateDraggableListItems
  } = props;

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const tempItems = Array.from(draggableListItems);
    const [reorderedItem] = tempItems.splice(result.source.index, 1);
    tempItems.splice(result.destination.index, 0, reorderedItem);
    updateDraggableListItems(tempItems);
  }

  useEffect(() => {
    setItems(draggableListItems);
  }, [draggableListItems]);

  return (
    <div className={styles['items-list']}>
      <AddItemForm {...props} />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="edit-items">
          {(provided) => (
            <div className={styles['edit-items-list']} {...provided.droppableProps} ref={provided.innerRef}>
              {draggableListItems.map((item, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <Item
                      {...provided}
                      listState={listState}
                      setItems={setItems}
                      items={items}
                      item={item.item}
                      handleRemoveItem={handleRemoveItem}
                      id={item.id}
                      inputIdEdited={inputIdEdited}
                      setInputIdEdited={setInputIdEdited}
                      setEditingTitle={setEditingTitle}
                      updateDraggableListItems={updateDraggableListItems}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
  // }
};

export default EditList;
