import React, { useRef } from 'react';
import { Store } from 'react-notifications-component';
import styles from '@/styles/TruthTally.module.css';

const AddItemForm = (props) => {
  const { setInputIdEdited, setEditingTitle, handleAddItem, items } = props;
  const itemInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length >= 50) {
      Store.addNotification({
        title: 'Too many items',
        message: 'The list cannot contain more than 50 items',
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

    let dupe = false;
    const input = itemInput.current.value.toLowerCase().replace(/\s+/g, '');

    items.forEach((item) => {
      if (item.item.toLowerCase().replace(/\s+/g, '') === input) {
        dupe = true;
      }
    });

    if (!dupe && input) {
      handleAddItem(itemInput.current.value.trim().replace(/(^|\s)[a-z]/g, (f) => f.toUpperCase()));
      e.currentTarget.reset();
      return;
    }
    dupe &&
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
    !input && e.currentTarget.reset();
  };

  return (
    <div className={styles['add-item-form']}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          maxLength="100"
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
