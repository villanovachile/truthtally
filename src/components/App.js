import React, { useState, useRef } from 'react';
import Header from './Header';
import ItemsList from './ItemsList';
import Stage from './Stage';
import Controls from './Controls';
import Results from './Results';


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
    // {
    //   item: 'Green',
    //   score: 0,
    //   id: 4
    // },
  ]);

  const [gameState, setGameState] = useState('start');

  const [pairs, setPairs] = useState([]);

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);


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


  const handleRemoveItem = (id) => {
    setItems(prevItems => prevItems.filter( p => p.id !== id ));
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
        removeItem={handleRemoveItem}
        pairs={pairs}
        updatePairsList={updatePairsList}
        gameState={gameState}
        setGameState={setGameState}
        />

      <Stage
        items={items}
        setItems={setItems}
        pairs={pairs}
        setPairs={setPairs}
        gameState={gameState}
        setGameState={setGameState}
        currentIndex={currentIndex}
      />

      <Results
        items={items}
        setItems={setItems}
        pairs={pairs}
        setPairs={setPairs}
        gameState={gameState}
        setGameState={setGameState}
        currentIndex={currentIndex}
      />

      <Controls 
        items={items}
        setItems={setItems}
        updatePairsList={updatePairsList}
        pairs={pairs}
        gameState={gameState}
        setGameState={setGameState}
        currentIndex={currentIndex}
        nextItemId={nextItemId}
        setPairs={setPairs}
      />


    </div>
  );
}

export default App;
