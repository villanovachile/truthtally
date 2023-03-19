import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ItemsList from "./ItemsList";
import EditList from "./EditList";
import Stage from "./Stage";
import Controls from "./Controls";
import Results from "./Results";
import LoadingSpinner from "./LoadingSpinner";
import ShareListModal from "./ShareListModal";

function TruthTally() {
  const [sourceListChanged, setSourceListChanged] = useState(false);

  const [sourceRankedListChanged, setSourceRankedListChanged] = useState(false);

  const [sourceTitleChanged, setSourceTitleChanged] = useState(false);

  let { uri } = useParams();

  let navigate = useNavigate();

  const history = useLocation();

  const [items, setItems] = useState([]);

  const [listTitle, setListTitle] = useState();

  const [sourceItemsList, setSourceItemsList] = useState([]);

  const [sourceListTitle, setSourceListTitle] = useState();

  const [sourceListType, setSourceListType] = useState();

  const [showShareModal, setShowShareModal] = useState(false);

  const [preEditListCopy, setPreEditListCopy] = useState([]);

  const [preListTitleCopy, setPreListTitleCopy] = useState();

  const [editingTitle, setEditingTitle] = useState(false);

  const [titleInput, setTitleInput] = useState();

  const [gameState, setGameState] = useState("preload");

  const [listState, setListState] = useState();

  const [gameCompleted, setGameCompleted] = useState();

  const [loadingText, setLoadingText] = useState("");

  const [pairs, setPairs] = useState([]);

  const [shareButtonLabel, setShareButtonLabel] = useState();

  const [inputIdEdited, setInputIdEdited] = useState();

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);

  useEffect(() => {
    const storedValue = window.sessionStorage.getItem("showShareModal");
    if (storedValue) {
      setShowShareModal(JSON.parse(storedValue));
    }
  }, []);

  // useEffect(() => {
  //   window.sessionStorage.setItem("showShareModal", JSON.stringify(showShareModal));
  // }, [showShareModal]);

  useEffect(() => {
    setItems([]);
    const fetchURL = "/.netlify/functions/get_list?uri=" + uri;
    if (uri === undefined) {
      setLoadingText("Loading...");
      setGameState("start");
      setShowShareModal(false);
      setListState("edit");
      setListTitle("Untitled List");
      setSourceListType("new");
      return;
    }
    (async () => {
      try {
        setLoadingText("Loading...");
        let results = await fetch(fetchURL).then((response) => response.json());
        if (results !== "not_found" && results.type === "unranked") {
          setSourceListType("unranked");
          setListTitle(results.title);
          setSourceItemsList([]);
          let id = 0;
          results[uri].forEach((item) => {
            nextItemId.current++;

            setSourceItemsList((prevItems) => [
              // Creates a temporary copy of source list, with renumerated id and score
              ...prevItems,
              {
                item: item.item,
                score: 0,
                id: id++,
              },
            ]);

            setSourceListTitle(results.title);

            setItems((prevItems) => [
              // loads the items state with source list
              ...prevItems,
              {
                item: item.item,
                score: 0,
                id: item.id,
              },
            ]);
          });
          setListState("display");
          setGameState("start");
        } else if (results !== "not_found" && results.type === "ranked") {
          setSourceListType("ranked");
          setListTitle(results.title);
          setSourceListTitle(results.title);
          setSourceItemsList([]);

          results[uri].forEach((item) => {
            nextItemId.current++;

            setSourceItemsList((prevItems) => [
              // Creates a temporary copy of source list, with renumerated id and score
              ...prevItems,
              {
                item: item.item,
                score: item.score,
                id: item.id,
              },
            ]);

            setItems((prevItems) => [
              ...prevItems,
              {
                item: item.item,
                score: item.score,
                id: item.id,
              },
            ]);
          });
          setListState("display");
          setGameState("finished");
        } else {
          navigate("/list/404");
        }
      } catch (error) {
        console.log("Error: ", error);
        navigate("/list/404");
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
        id: nextItemId.current,
      },
    ]);
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
      JSON.stringify(currentListItemNames) === JSON.stringify(sourceListItemNames) ? setSourceListChanged(false) : setSourceListChanged(true);
      JSON.stringify(items) === JSON.stringify(sourceItemsList) ? setSourceRankedListChanged(false) : setSourceRankedListChanged(true);
    }
  }, [items, sourceItemsList, uri]);

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((p) => p.id !== id));
  };

  const updatePairsList = (a) => {
    setPairs(a);
  };

  function handleTitleInputChange(event) {
    setTitleInput(event.target.value);
  }

  const editedTitleSubmit = (e) => {
    e.preventDefault();
    setTitleInput(listTitle);
    if (titleInput !== "") {
      console.log(sourceListTitle);
      console.log(titleInput);

      sourceListTitle !== titleInput ? setSourceTitleChanged(true) : setSourceTitleChanged(false);
      setListTitle(titleInput);
    }
    setEditingTitle(false);
  };

  useEffect(() => {
    setTitleInput(listTitle);
  }, [listTitle]);

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
  };

  return (
    <div className="truthtally-container">
      {showShareModal && <div className="modal-overlay" />}
      <Controls {...props} />

      <div className="list-title">
        {editingTitle && (listState === "edit" || gameState === "finished") ? (
          <form
            style={{ width: titleInput.length + 50 + "ch" }}
            onSubmit={(e) => {
              editedTitleSubmit(e);
            }}
          >
            <input autoFocus style={{ width: titleInput.length + 10 + "ch" }} className="edit-item-input" type="text" defaultValue={listTitle} onChange={handleTitleInputChange}></input>
          </form>
        ) : (
          listTitle
        )}

        {(listState === "edit" || gameState === "finished") && (gameState !== "loading" || gameState !== "inProgress") && (
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
              setInputIdEdited("title");
            }}
          >
            <g>
              <path
                d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
		c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
		C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
		L27.473,390.597L0.3,512.69z"
              />
            </g>
          </svg>
        )}
      </div>

      <LoadingSpinner {...props} />

      <Stage {...props} />

      <Results {...props} />

      {listState === "display" && gameState === "start" && <ItemsList {...props} />}

      {listState === "edit" && gameState === "start" && <EditList {...props} />}

      {showShareModal && <ShareListModal {...props} />}
    </div>
  );
}

export default TruthTally;
