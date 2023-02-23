import React, { useState, useRef } from 'react';
import Header from './Header';
import List from './Item';
import AddItemForm from './AddItemForm';
import GenList from './GenList';

//import logo from './logo.svg';


function App() {

  const [items, setItems] = useState ([
    {
      item: 'Red',
      score: 0,
      id: 1
    },
    {
      item: 'Rlue',
      score: 0,
      id: 2
    },
    {
      item: 'White',
      score: 0,
      id: 3
    },
  ]);

  const nextItemId = useRef(3);


  const handleAddItem = (item) => {
    nextItemId.current++
    
    setItems(prevItems =>  [
      ...prevItems,
      {
        item,
        score: 0,
        id: nextItemId.current
      }
    ]);
  }


  return (
    <div className="main-container">  
      <Header />

      <AddItemForm 
        addItem={handleAddItem}
        items={items}
      />
      
      {items.map(item =>
        <List
          item={item.item}
          score={item.score}
          id={item.id}
          key={item.id.toString()}
        />
      )}
      
      <GenList items={items} />


    </div>
  );
}

export default App;
