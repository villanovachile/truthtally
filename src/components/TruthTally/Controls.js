import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  setListAuthor,
  updateDraggableListItems
}) => {
  let navigate = useNavigate();
  let { uri } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseIconStyle = {
    // position: isCollapsed ? 'absolute' : 'relative',
    // bottom: isCollapsed ? '0' : '20px'
    // // right: '20px'
  };

  const toggleCollapse = () => {
    setShowContent(!showContent);
    setIsCollapsed(!isCollapsed);
  };

  const contentStyle = {
    maxHeight: showContent ? '1000px' : '0',
    padding: showContent ? '10px 0px 10px 0px' : '0px'
  };

  useEffect(() => {
    items.length > 2 ? setIsButtonDisabled(false) : setIsButtonDisabled(true);
  }, [items]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowContent(true);
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const genList = () => {
    const generatePairs = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          result.push([arr[i], arr[j]]);
        }
      }
      setLoadingText('Generating pairs...');
      setGameCompleted(false);
      setGameState('loading');
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
    updateDraggableListItems([]);
    setGameCompleted(false);
    setGameState('start');
    // nextItemId.current = 0;
    // currentIndex.current = 0;
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
    setGameState('inProgress');
    setListAuthor();
  };

  const startOver = () => {
    // if (uri === undefined) {
    // updateDraggableListItems([]);
    // setItems([]);
    const resetScores = items.map((item) => ({ ...item, score: 0 }));
    setItems(resetScores);
    setPairs([]);
    setGameCompleted(false);
    setGameState('start');
    nextItemId.current = 0;
    currentIndex.current = 0;
    // navigate('/');
    // return;
    // }
    // navigate(0);
  };

  const shareList = () => {
    setShowShareModal(true);
  };

  const editListButton = () => {
    setListState('edit');
    setPreEditListCopy(items);
    updateDraggableListItems(items);
    setPreListTitleCopy(listTitle);
  };

  const editListCancel = () => {
    setListState('display');
    setEditingTitle(false);
    setItems(preEditListCopy);
    setListTitle(preListTitleCopy);
    setPreEditListCopy([]);
  };

  const editListOK = () => {
    setListState('display');
    setItems(items.map((item, index) => ({ ...item, id: index + 1 })));
    // editedTitleSubmit(titleInput);
    setPreEditListCopy([]);
  };

  const shareButton = () => {
    if (uri === undefined && sourceListChanged === false && gameState === 'start') {
      return listState === 'edit' ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share List
        </button>
      ) : null;
    } else if (uri !== undefined && (sourceListChanged || sourceTitleChanged) && gameState === 'start') {
      return listState !== 'edit' ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share New List
        </button>
      ) : null;
    } else if (uri !== undefined && !sourceListChanged && !sourceTitleChanged && gameState === 'start') {
      return listState !== 'edit' ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share List
        </button>
      ) : null;
    } else if (gameState === 'finished') {
      return uri !== undefined && sourceListType === 'ranked' ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share Ranked List
        </button>
      ) : (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share Ranked List
        </button>
      );
    }
  };

  const viewSourceList = () => {
    navigate('/list/' + sourceListURI);
  };

  return (
    <div className="controls">
      <div className={`controls-buttons${isCollapsed ? ' collapsed' : ''}`} style={contentStyle}>
        {listState === 'edit' && uri !== undefined && (
          <>
            <button
              onClick={() => {
                editListOK();
              }}>
              {' '}
              OK
            </button>

            <button
              onClick={() => {
                editListCancel();
              }}>
              Cancel
            </button>
          </>
        )}

        {gameState === 'start' &&
        ((listState !== 'edit' && uri !== undefined) || (listState === 'edit' && uri === undefined)) ? (
          <button onClick={() => genList()} disabled={isButtonDisabled}>
            Rank List
          </button>
        ) : null}

        {gameState === 'start' && listState === 'edit' ? (
          <button onClick={() => clearList()} disabled={items.length > 0 ? false : true}>
            Clear
          </button>
        ) : null}

        {gameState !== 'start' &&
        gameState !== 'loading' &&
        gameState !== 'preload' &&
        (sourceListType === 'new' || sourceListType === 'unranked') ? (
          <button onClick={() => startOver()}>Start Over</button>
        ) : null}

        {gameState === 'finished' &&
        gameState !== 'loading' &&
        gameState !== 'preload' &&
        (sourceListType === 'new' || sourceRankedListChanged === true) ? (
          <button onClick={() => rateAgain()}>Rank Again</button>
        ) : null}

        {gameState === 'finished' &&
        gameState !== 'loading' &&
        gameState !== 'preload' &&
        sourceListType === 'ranked' &&
        sourceRankedListChanged === false ? (
          <button onClick={() => rateAgain()}>Rank this list</button>
        ) : null}

        {listState === 'display' && gameState !== 'loading' && gameState === 'start' && (
          <>
            <button
              onClick={() => {
                editListButton();
              }}>
              Edit List
            </button>
          </>
        )}

        {shareButton()}

        {gameState !== 'start' && gameState !== 'loading' && gameState !== 'preload' && sourceListType === 'ranked' ? (
          <button onClick={() => viewSourceList()}>See Unranked List</button>
        ) : null}

        {(gameState === 'finished' || uri !== undefined) && (
          <button onClick={() => navigate('/')}>Create New List</button>
        )}
      </div>

      {gameState !== 'loading' && (
        <div className="collapse-div">
          {!isCollapsed ? (
            <svg
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              className="collapse-button"
              style={collapseIconStyle}
              onClick={toggleCollapse}>
              <g fill="#FFFFFF" transform="matrix(-1, 0, 0, -1, 1000, 1000)">
                <path
                  d="M835.1,10l121.7,122.3L500,586.8L43.2,132.3L164.9,10L500,
            343.5L835.1,10L835.1,10z M500,746.6L164.9,413.2L43.2,535.4L500,
            990l456.8-454.6L835.1,413.2L500,746.6L500,746.6z"
                />
              </g>
            </svg>
          ) : (
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 1000 1000"
              width="20px"
              height="20px"
              className="collapse-button"
              style={collapseIconStyle}
              onClick={toggleCollapse}>
              <g fill="#FFFFFF">
                <path
                  d="M835.1,10l121.7,122.3L500,586.8L43.2,132.3L164.9,10L500,
            343.5L835.1,10L835.1,10z M500,746.6L164.9,413.2L43.2,535.4L500,
            990l456.8-454.6L835.1,413.2L500,746.6L500,746.6z"
                />
              </g>
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default Controls;
