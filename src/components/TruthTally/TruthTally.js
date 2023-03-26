import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import ItemsList from './ItemsList';
import EditList from './EditList';
import Stage from './Stage';
import Controls from './Controls';
import Results from './Results';
import LoadingSpinner from './LoadingSpinner';
import ShareListModal from './ShareListModal';

function TruthTally() {
  const [isRankingSharedList, setIsRankingSharedList] = useState(false);
  const [draggableListItems, updateDraggableListItems] = useState([]);
  const [items, setItems] = useState([]);
  const [sourceListChanged, setSourceListChanged] = useState(false);

  const [titleMaxWidth, setTitleMaxWidth] = useState('600px');

  const [sourceRankedListChanged, setSourceRankedListChanged] = useState(false);

  const [sourceTitleChanged, setSourceTitleChanged] = useState(false);

  const [sourceListURI, setSourceListURI] = useState();

  let { uri } = useParams();

  let navigate = useNavigate();

  const history = useLocation();

  const [listTitle, setListTitle] = useState('');

  const [listAuthor, setListAuthor] = useState();

  const [sourceListTags, setSourceListTags] = useState([]);

  const [sourceItemsList, setSourceItemsList] = useState([]);

  const [sourceListTitle, setSourceListTitle] = useState();

  const [sourceListType, setSourceListType] = useState();

  const [showShareModal, setShowShareModal] = useState(false);

  const [preEditListCopy, setPreEditListCopy] = useState([]);

  const [preListTitleCopy, setPreListTitleCopy] = useState();

  const [editingTitle, setEditingTitle] = useState(false);

  const [titleInput, setTitleInput] = useState();

  const [gameState, setGameState] = useState('preload');

  const [listState, setListState] = useState();

  const [gameCompleted, setGameCompleted] = useState();

  const [loadingText, setLoadingText] = useState('');

  const [pairs, setPairs] = useState([]);

  const [shareButtonLabel, setShareButtonLabel] = useState();

  const [inputIdEdited, setInputIdEdited] = useState();

  const [metaDescription, setMetaDescription] = useState();

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);

  const titleInputRef = useRef(null);

  useEffect(() => {
    const storedValue = window.sessionStorage.getItem('showShareModal');
    if (storedValue) {
      setShowShareModal(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem('showShareModal', JSON.stringify(showShareModal));
  }, [showShareModal]);

  useEffect(() => {
    setItems([]);
    setSourceTitleChanged(false);
    const fetchURL = '/.netlify/functions/get_list?uri=' + uri;

    if (uri === undefined) {
      setLoadingText('Loading...');
      setGameState('start');
      setShowShareModal(false);
      setListState('edit');
      setListTitle('Add a List Title...');
      setSourceListType('new');
      setListAuthor();
      return;
    }

    (async () => {
      try {
        setLoadingText('Loading...');
        let results = await fetch(fetchURL).then((response) => response.json());

        if (results !== 'not_found' && results.type === 'unranked') {
          setSourceListType('unranked');
          setListTitle(results.title);
          setSourceItemsList([]);
          setListAuthor();
          setSourceListURI(results.source_uri);
          setIsRankingSharedList(false);
          setSourceListTags(results.tags);
          let id = 0;
          results[uri].forEach((item) => {
            nextItemId.current++;

            setSourceItemsList((prevItems) => [
              // Creates a temporary copy of source list, with renumerated id and score
              ...prevItems,
              {
                item: item.item,
                score: 0,
                id: id++
              }
            ]);

            setSourceListTitle(results.title);

            setItems((prevItems) => [
              // loads the items state with source list
              ...prevItems,
              {
                item: item.item,
                score: 0,
                id: item.id
              }
            ]);
          });

          setListState('display');
          setGameState('start');
        } else if (results !== 'not_found' && results.type === 'ranked') {
          setIsRankingSharedList(false);
          setSourceListType('ranked');
          setListTitle(results.title);
          setSourceListTags(results.tags);
          setListAuthor(results.author);
          setSourceListTitle(results.title);
          setSourceListURI(results.source_uri);
          setSourceItemsList([]);

          results[uri].forEach((item) => {
            nextItemId.current++;

            setSourceItemsList((prevItems) => [
              // Creates a temporary copy of source list, with renumerated id and score
              ...prevItems,
              {
                item: item.item,
                score: item.score,
                id: item.id
              }
            ]);

            setItems((prevItems) => [
              ...prevItems,
              {
                item: item.item,
                score: item.score,
                id: item.id
              }
            ]);
          });
          setListState('display');
          setGameState('finished');
        } else {
          navigate('/list/404');
        }
      } catch (error) {
        console.log('Error: ', error);
        navigate('/list/404');
      }
    })();
  }, [history, navigate, uri]);

  const handleAddItem = (item) => {
    nextItemId.current++;

    setItems((prevItems) => [
      ...prevItems,
      {
        item,
        score: 0,
        id: nextItemId.current
      }
    ]);

    updateDraggableListItems((prevItems) => [
      ...prevItems,
      {
        item,
        score: 0,
        id: nextItemId.current
      }
    ]);
    // updateDraggableListItems(items);
  };

  useEffect(() => {
    let currentListItemNames = [];
    let sourceListItemNames = [];

    items.forEach((item) => {
      currentListItemNames.push(item.item);
    });
    sourceItemsList.forEach((item) => {
      sourceListItemNames.push(item.item);
    });

    if (uri !== undefined) {
      JSON.stringify(currentListItemNames) === JSON.stringify(sourceListItemNames)
        ? setSourceListChanged(false)
        : setSourceListChanged(true);
      JSON.stringify(items) === JSON.stringify(sourceItemsList)
        ? setSourceRankedListChanged(false)
        : setSourceRankedListChanged(true);
    }
  }, [items, sourceItemsList, uri]);

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((p) => p.id !== id));
    updateDraggableListItems((prevItems) => prevItems.filter((p) => p.id !== id));
  };

  const updatePairsList = (a) => {
    setPairs(a);
  };
  function handleTitleInputChange(event) {
    setTitleInput(event.target.value);
  }

  const editedTitleSubmit = (e) => {
    e.preventDefault();

    if (!/[a-zA-Z]/.test(titleInput)) {
      Store.addNotification({
        title: 'Invalid Title',
        message: 'The title must contain at least one alphabet character',
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
      setTitleInput(listTitle);
      return;
    }

    titleInputRef.current.blur();

    if (titleInput.trim() !== '') {
      sourceListTitle !== titleInput ? setSourceTitleChanged(true) : setSourceTitleChanged(false);
      setListTitle(titleInput.trim());
      setTitleInput(titleInput.trim());
    }
    setEditingTitle(false);
  };

  useEffect(() => {
    const rankedTitle = listAuthor ? ' - ranked by ' + listAuthor : ' ranked';
    setTitleInput(listTitle);
    uri === undefined && (document.title = 'Create your list...');
    sourceListType === 'unranked' && (document.title = listTitle);
    sourceListType === 'ranked' && (document.title = listTitle + rankedTitle);
  }, [listTitle]);

  const titleInputFocus = (e) => {
    listTitle === 'Add a List Title...' && e.target.select();
  };

  useEffect(() => {
    !titleInputRef && titleInputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const initialWidth = window.innerWidth;
      setTitleMaxWidth(initialWidth > 768 ? '650px' : '90vw');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    uri,
    navigate,
    sourceItemsList,
    showShareModal,
    setShowShareModal,
    listState,
    setListState,
    shareButtonLabel,
    setShareButtonLabel,
    sourceListChanged,
    setSourceListChanged,
    preEditListCopy,
    setPreEditListCopy,
    setPreListTitleCopy,
    preListTitleCopy,
    setListTitle,
    listTitle,
    sourceTitleChanged,
    setSourceTitleChanged,
    sourceListTitle,
    setSourceListTitle,
    setEditingTitle,
    editedTitleSubmit,
    titleInput,
    inputIdEdited,
    setInputIdEdited,
    sourceListType,
    setSourceListType,
    sourceRankedListChanged,
    setSourceRankedListChanged,
    sourceListURI,
    setSourceListURI,
    listAuthor,
    setListAuthor,
    draggableListItems,
    updateDraggableListItems,
    isRankingSharedList,
    setIsRankingSharedList,
    sourceListTags,
    setSourceListTags
  };

  return (
    <div className="truthtally-container">
      {showShareModal && <div className="modal-overlay" />}
      <Controls {...props} />

      <div className="list-title">
        {listState === 'edit' || (editingTitle && gameState === 'finished') ? (
          <form
            style={{ width: titleInput.length + 5 + 'ch' }}
            onBlur={(e) => {
              editedTitleSubmit(e);
            }}
            onSubmit={(e) => {
              editedTitleSubmit(e);
            }}>
            <input
              autoFocus
              style={{ width: titleInput.length + 5 + 'ch' }}
              className="list-title"
              type="text"
              maxLength="100"
              value={titleInput}
              onChange={handleTitleInputChange}
              ref={titleInputRef}
              onClick={(e) => {
                titleInputFocus(e);
              }}></input>
          </form>
        ) : (
          <div
            style={
              listState === 'edit'
                ? {
                    backgroundColor: '#7a0000',
                    cursor: 'pointer',
                    width: titleInput.length + 9 + 'ch',
                    maxWidth: titleMaxWidth,
                    padding: '0px'
                  }
                : { backgroundColor: '#5f0000' }
            }
            onClick={() => {
              listState === 'edit' && setEditingTitle(!editingTitle);
            }}
            title="Click to edit">
            <h3>{listTitle}</h3>
          </div>
        )}

        {((sourceTitleChanged && sourceListType !== 'new') ||
          (sourceListChanged && sourceListType !== 'new') ||
          (sourceTitleChanged && sourceListType === 'ranked')) &&
          listState === 'display' && <h3>*</h3>}

        {gameState === 'finished' && (
          <svg
            fill="#FFFFFF"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            width="15px"
            height="15px"
            viewBox="0 0 528.899 528.899"
            className="svg-button"
            onClick={() => {
              setEditingTitle(true);
              setInputIdEdited('title');
            }}>
            <g>
              <path
                d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z 
                M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,
                45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z 
                M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
                L27.473,390.597L0.3,512.69z"
              />
            </g>
          </svg>
        )}
      </div>

      <LoadingSpinner {...props} />

      <Stage {...props} />

      <Results {...props} />

      {listState === 'display' && gameState === 'start' && <ItemsList {...props} />}

      {listState === 'edit' && gameState === 'start' && <EditList {...props} />}

      {items.length < 3 && gameState === 'start' && (
        <div className="start-info">
          <h3>Getting Started</h3>
          <ol>
            <li>Enter a title for your list. </li>
            <li>Enter 3 or more items and click "Rank List" to begin ranking.</li>
          </ol>
        </div>
      )}

      {showShareModal && <ShareListModal {...props} />}
    </div>
  );
}

export default TruthTally;
