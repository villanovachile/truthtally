import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/TruthTally.module.css';

const Controls = (props) => {
  const {
    listState,
    setListState,
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
    setRankingCompleted,
    sourceListChanged,
    setPreEditListCopy,
    preEditListCopy,
    setPreListTitleCopy,
    preListTitleCopy,
    setListTitle,
    listTitle,
    sourceTitleChanged,
    setEditingTitle,
    sourceListType,
    sourceRankedListChanged,
    sourceListURI,
    setListAuthor,
    updateDraggableListItems,
    draggableListItems,
    setIsRankingSharedList,
    uri
  } = props;

  let router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isSourceListRanked = sourceListType === 'ranked';
  const isSourceListUnranked = sourceListType === 'unranked';
  const isSourceListNew = sourceListType === 'new';
  const startGameState = gameState === 'start';
  const finishedGameState = gameState === 'finished';
  const inProgressGameState = gameState === 'inProgress';
  const isListEditMode = listState === 'edit';
  const showLoadingScreen = gameState === 'loading';
  const isPreload = gameState === 'preload';

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
    setItems(items.map((item, index) => ({ ...item, id: index + 1, score: 0 })));
    updateDraggableListItems(items.map((item, index) => ({ ...item, id: index + 1 })));
    const generatePairs = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          result.push([arr[i], arr[j]]);
        }
      }

      setListState('display');
      setLoadingText('Generating pairs...');
      setRankingCompleted(false);
      setGameState('loading');
      // Shuffle the array of pairs
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };
    setListAuthor();
    updatePairsList(generatePairs(items.map((item, index) => ({ ...item, id: index + 1 }))));
  };

  const clearList = () => {
    setItems([]);
    setPairs([]);
    updateDraggableListItems([]);
    setRankingCompleted(false);
    setGameState('start');
    return;
  };

  const rankAgain = () => {
    isSourceListRanked && setIsRankingSharedList(true);
    items.sort((a, b) => a.id - b.id);
    currentIndex.current = 0;
    genList();
    setRankingCompleted(false);
    setGameState('inProgress');
    setListAuthor();
  };

  const startOver = () => {
    isSourceListNew && setListState('edit');
    const resetScores = items.map((item) => ({ ...item, score: 0 }));
    setItems(resetScores);
    setPairs([]);
    setRankingCompleted(false);
    setGameState('start');
    nextItemId.current = 0;
    currentIndex.current = 0;
  };

  const newList = () => {
    isSourceListNew && setListState('edit');
    clearList();
    nextItemId.current = 0;
    currentIndex.current = 0;
    router.push('/');
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
    setPreEditListCopy([]);
  };

  const shareButton = () => {
    if (uri === undefined && !sourceListChanged && startGameState) {
      return isListEditMode ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share List
        </button>
      ) : null;
    } else if (uri !== undefined && (sourceListChanged || sourceTitleChanged) && startGameState) {
      return !isListEditMode ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share New List
        </button>
      ) : null;
    } else if (uri !== undefined && !sourceListChanged && !sourceTitleChanged && startGameState) {
      return !isListEditMode ? (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share List
        </button>
      ) : null;
    } else if (finishedGameState) {
      return (
        <button onClick={() => shareList()} disabled={isButtonDisabled}>
          Share Ranked List
        </button>
      );
    }
  };

  const viewSourceList = () => {
    router.push('/list/' + sourceListURI);
  };

  return (
    <div className={styles.controls}>
      <div className={`${styles['controls-buttons']} ${isCollapsed ? styles.collapsed : ''}`} style={contentStyle}>
        {isListEditMode && uri !== undefined && (
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

        {startGameState && ((!isListEditMode && uri !== undefined) || (isListEditMode && uri === undefined)) ? (
          <button onClick={() => genList()} disabled={isButtonDisabled}>
            Rank List
          </button>
        ) : null}

        {startGameState && isListEditMode ? (
          <button onClick={() => clearList()} disabled={items.length > 0 ? false : true}>
            Clear
          </button>
        ) : null}

        {!startGameState && !showLoadingScreen && !isPreload && (isSourceListNew || isSourceListUnranked) ? (
          <button onClick={() => startOver()}>Start Over</button>
        ) : null}

        {!showLoadingScreen && !isPreload && inProgressGameState ? (
          <button onClick={() => rankAgain()}>Rank Again</button>
        ) : null}

        {finishedGameState && !showLoadingScreen && !isPreload && isSourceListRanked && !sourceRankedListChanged ? (
          <button onClick={() => rankAgain()}>Rank this list</button>
        ) : null}

        {!isListEditMode && !showLoadingScreen && startGameState && (
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

        {!startGameState && !showLoadingScreen && !isPreload && !inProgressGameState && isSourceListRanked ? (
          <button onClick={() => viewSourceList()}>See Unranked List</button>
        ) : null}

        {(finishedGameState || uri !== undefined) && !isPreload && !showLoadingScreen && !inProgressGameState && (
          <button onClick={() => newList()}>Create New List</button>
        )}
      </div>

      {!showLoadingScreen && (
        <div className={styles['collapse-div']}>
          {!isCollapsed ? (
            <svg
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              className={styles['collapse-button']}
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
              className={styles['collapse-button']}
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
