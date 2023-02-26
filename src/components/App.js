import React, { useState, useRef } from 'react';
import Header from './Header';
import ItemsList from './ItemsList';
import Stage from './Stage';
import Controls from './Controls';


//import logo from './logo.svg';


function App() {

  const [items, setItems] = useState ([
    // {
    //   item: 'Red',
    //   score: 0,
    //   id: 1
    // },
    // {
    //   item: 'Blue',
    //   score: 0,
    //   id: 2
    // },
    // {
    //   item: 'White',
    //   score: 0,
    //   id: 3
    // },
  ]);

  const [gameState, setGameState] = useState('start');

  const [pairs, setPairs] = useState([]);

  

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





const updatePairsList = (a) => {
  setPairs(a);
}



  return (
    
    <div className="main-container">  
      <Header />
      
      <ItemsList
        items={items}
        addItem={handleAddItem}
        // generatePairs={generatePairs}
        pairs={pairs}
        updatePairsList={updatePairsList}
        />

      <Stage
        items={items}
        setItems={setItems}
        pairs={pairs}
        setPairs={setPairs}
        gameState={gameState}
      />

      <Controls />


    </div>
  );
}

export default App;
