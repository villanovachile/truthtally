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
  setPreListTitleCopy,
  preListTitleCopy,
  setListTitle,
  listTitle,
  sourceTitleChanged,
  setEditingTitle,
  editedTitleSubmit,
  titleInput,
  sourceListType,
  sourceRankedListChanged,
  sourceListURI,
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
    setPreListTitleCopy(listTitle);
  };

  const editListCancel = () => {
    setListState("display");
    setEditingTitle(false);
    setItems(preEditListCopy);
    setListTitle(preListTitleCopy);
    setPreEditListCopy([]);
  };

  const editListOK = () => {
    setListState("display");
    // editedTitleSubmit(titleInput);
    setPreEditListCopy([]);
  };

  const shareButton = () => {
    if (uri === undefined && sourceListChanged === false && gameState === "start") {
      return items.length > 2 && listState === "edit" ? <button onClick={() => shareList()}>Save List</button> : null;
    } else if (uri !== undefined && (sourceListChanged || sourceTitleChanged) && gameState === "start") {
      return items.length > 2 && listState !== "edit" ? <button onClick={() => shareList()}>Save Changed List</button> : null;
    } else if (uri !== undefined && !sourceListChanged && !sourceTitleChanged && gameState === "start") {
      return items.length > 2 && listState !== "edit" ? <button onClick={() => shareList()}>Share List</button> : null;
    } else if (gameState === "finished") {
      return uri !== undefined && sourceListType === "ranked" ? <button onClick={() => shareList()}>Share Ranked List</button> : <button onClick={() => shareList()}>Save Ranked List</button>;
    }
  };

  const viewSourceList = () => {
    navigate("/list/" + sourceListURI);
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

      {items.length > 2 && gameState === "start" && ((listState !== "edit" && uri !== undefined) || (listState === "edit" && uri === undefined)) ? (
        <button onClick={() => genList()}>Rank List</button>
      ) : null}

      {items.length > 0 && gameState === "start" && listState === "edit" ? <button onClick={() => clearList()}>Clear</button> : null}

      {gameState !== "start" && gameState !== "loading" && gameState !== "preload" && (sourceListType === "new" || sourceListType === "unranked") ? (
        <button onClick={() => startOver()}>Start Over</button>
      ) : null}

      {gameState === "finished" && gameState !== "loading" && gameState !== "preload" && (sourceListType === "new" || sourceRankedListChanged === true) ? (
        <button onClick={() => rateAgain()}>Rank Again</button>
      ) : null}

      {gameState === "finished" && gameState !== "loading" && gameState !== "preload" && sourceListType === "ranked" && sourceRankedListChanged === false ? (
        <button onClick={() => rateAgain()}>Rank this list</button>
      ) : null}

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

      {gameState !== "start" && gameState !== "loading" && gameState !== "preload" && sourceListType === "ranked" ? <button onClick={() => viewSourceList()}>See Source List</button> : null}
    </div>
  );
};

export default Controls;
