import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const Controls = ({
  listState,
  setListState,
  shareListButtonLabel,
  setShowModal,
  setShowShareModal,
  items,
  setItems,
  nextItemId,
  setPairs,
  updatePairsList,
  gameState,
  setGameState,
  currentIndex,
  setLoadingText,
  setGameCompleted,
  sourceListChanged,
  setSourceListChanged,
  setPreEditListCopy,
  preEditListCopy,
}) => {
  let navigate = useNavigate();
  let { uri } = useParams();

  const genList = () => {
    const generatePairs = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          result.push([arr[i], arr[j]]);
        }
      }
      setLoadingText("Generating pairs...");
      setGameCompleted(false);
      setGameState("loading");
      // Shuffle the array of pairs
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    updatePairsList(generatePairs(items));
  };

  const clearList = () => {
    // if (uri === undefined) {
    setItems([]);
    setPairs([]);
    setGameCompleted(false);
    setGameState("start");
    nextItemId.current = 0;
    currentIndex.current = 0;
    // navigate("/");
    return;
    // }
    // navigate("/");
    // navigate(0);
  };

  const rateAgain = () => {
    const resetScores = items.map((item) => ({ ...item, score: 0 }));
    setItems(resetScores);
    currentIndex.current = 0;
    genList();
    setGameCompleted(false);
    setGameState("inProgress");
  };

  const startOver = () => {
    if (uri === undefined) {
      setItems([]);
      setPairs([]);
      setGameCompleted(false);
      setGameState("start");
      nextItemId.current = 0;
      currentIndex.current = 0;
      navigate("/");
      return;
    }
    navigate(0);
  };

  const shareList = () => {
    setShowShareModal(true);
  };

  const editListButton = () => {
    setListState("edit");
    setPreEditListCopy(items);
  };

  const editListCancel = () => {
    setListState("display");
    setItems(preEditListCopy);
    setPreEditListCopy([]);
  };

  const editListOK = () => {
    setListState("display");
    setPreEditListCopy([]);
  };

  const shareButton = () => {
    if (uri === undefined && sourceListChanged === false) {
      return items.length > 2 && (gameState === "start" || gameState === "finished") && listState === "edit" ? <button onClick={() => shareList()}>Save List</button> : null;
    } else if (uri !== undefined && sourceListChanged === true) {
      return items.length > 2 && (gameState === "start" || gameState === "finished") && listState !== "edit" ? <button onClick={() => shareList()}>Save Changed List</button> : null;
    } else {
      return items.length > 2 && (gameState === "start" || gameState === "finished") && listState !== "edit" ? <button onClick={() => shareList()}>Share List</button> : null;
    }
  };

  return (
    <div className="controls">
      {listState === "edit" && uri !== undefined && (
        <>
          <button
            onClick={() => {
              editListOK();
            }}
          >
            {" "}
            OK
          </button>

          <button
            onClick={() => {
              editListCancel();
            }}
          >
            Cancel
          </button>
        </>
      )}

      {items.length > 2 && gameState === "start" && listState !== "edit" ? <button onClick={() => genList()}>Rank List</button> : null}

      {items.length > 0 && gameState === "start" && listState === "edit" ? <button onClick={() => clearList()}>Clear</button> : null}

      {gameState !== "start" && gameState !== "loading" && gameState !== "preload" ? <button onClick={() => startOver()}>Start Over</button> : null}

      {gameState !== "start" && gameState !== "loading" && gameState !== "preload" ? <button onClick={() => rateAgain()}>Rate Again</button> : null}

      {listState === "display" && gameState !== "loading" && gameState === "start" && (
        <>
          <button
            onClick={() => {
              editListButton();
            }}
          >
            Edit List
          </button>
        </>
      )}

      {shareButton()}
    </div>
  );
};

export default Controls;
