import React, { useState, useRef } from "react";
import ItemsList from "./ItemsList";
import Stage from "./Stage";
import Controls from "./Controls";
import Results from "./Results";
import LoadingSpinner from "./LoadingSpinner";

function TruthTally() {
  const [items, setItems] = useState([]);

  const [gameState, setGameState] = useState("start");

  const [gameCompleted, setGameCompleted] = useState(false);

  const [loadingText, setLoadingText] = useState("");

  const [pairs, setPairs] = useState([]);

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);

  const handleAddItem = (item) => {
    nextItemId.current++;

    setItems((prevItems) => [
      ...prevItems,
      {
        item,
        score: 0,
        id: nextItemId.current,
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((p) => p.id !== id));
  };

  const updatePairsList = (a) => {
    setPairs(a);
  };

  const props = {
    items,
    setItems,
    gameState,
    setGameState,
    gameCompleted,
    setGameCompleted,
    loadingText,
    setLoadingText,
    pairs,
    setPairs,
    currentIndex,
    nextItemId,
    handleAddItem,
    handleRemoveItem,
    updatePairsList,
  };

  return (
    <div className="truthtally-container">
      <LoadingSpinner {...props} />

      <Controls {...props} />

      <Stage {...props} />

      <Results {...props} />

      <ItemsList {...props} />
    </div>
  );
}

export default TruthTally;
