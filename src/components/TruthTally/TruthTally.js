import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ItemsList from "./ItemsList";
import EditList from "./EditList";
import Stage from "./Stage";
import Controls from "./Controls";
import Results from "./Results";
import LoadingSpinner from "./LoadingSpinner";
import ShareListModal from "./ShareListModal";
import PencilIcon from "../../images/pencil-icon.js";

function TruthTally() {
  const [sourceListChanged, setSourceListChanged] = useState(false);

  let { uri } = useParams();

  let navigate = useNavigate();

  const history = useLocation();

  const [items, setItems] = useState([]);

  const [listTitle, setListTitle] = useState();

  const [sourceItemsList, setSourceItemsList] = useState([]);

  const [showShareModal, setShowShareModal] = useState(false);

  const [currentItemsListEmpty, setCurrentItemsListEmpty] = useState(true);

  const [preEditListCopy, setPreEditListCopy] = useState([]);

  const [preListTitleCopy, setPreListTitleCopy] = useState();

  const [gameState, setGameState] = useState("preload");

  const [listState, setListState] = useState();

  const [gameCompleted, setGameCompleted] = useState();

  const [loadingText, setLoadingText] = useState("");

  const [pairs, setPairs] = useState([]);

  const [shareButtonLabel, setShareButtonLabel] = useState();

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);

  useEffect(() => {
    const storedValue = window.sessionStorage.getItem("showShareModal");
    if (storedValue) {
      setShowShareModal(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("showShareModal", JSON.stringify(showShareModal));
  }, [showShareModal]);

  useEffect(() => {
    setItems([]);
    const fetchURL = "/.netlify/functions/get_list?uri=" + uri;
    if (uri === undefined) {
      setLoadingText("Loading...");
      setGameState("start");
      setShowShareModal(false);
      setListState("edit");
      setListTitle("Untitled List");
      return;
    }
    (async () => {
      try {
        setLoadingText("Loading...");
        let results = await fetch(fetchURL).then((response) => response.json());
        if (results !== "not_found" && results.type === "list") {
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

  // Updates the current list of items to compare with source shared unranked list
  // useEffect(() => {
  //   setCurrentItemsList([]);
  //   nextItemCurrentId.current = 0;
  //   let id = 0;

  //   items
  //     .sort((a, b) => a.id - b.id)
  //     .forEach((item) => {
  //       nextItemCurrentId.current++;
  //       setCurrentItemsList((prevItems) => [
  //         ...prevItems,
  //         {
  //           item: item.item,
  //           score: 0,
  //           id: id++,
  //         },
  //       ]);
  //     });
  //   if (JSON.stringify(sourceItemsList) !== JSON.stringify(currentItemsList)) {
  //     setSourceListChanged(true);
  //   }
  // }, [items]);

  // useEffect(() => {
  //   currentItemsList.length > 0 ? setCurrentItemsListEmpty(false) : setCurrentItemsListEmpty(true);
  // }, [currentItemsList]);

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
    }
  }, [items, sourceItemsList, uri]);

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((p) => p.id !== id));
  };

  const updatePairsList = (a) => {
    setPairs(a);
  };

  const copyLink = (e) => {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // setCopied(true);
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
    uri,
    navigate,
    sourceItemsList,
    showShareModal,
    setShowShareModal,
    listState,
    setListState,
    shareButtonLabel,
    setShareButtonLabel,
    currentItemsListEmpty,
    sourceListChanged,
    setSourceListChanged,
    preEditListCopy,
    setPreEditListCopy,
    setPreListTitleCopy,
    preListTitleCopy,
    setListTitle,
    listTitle,
  };

  function handleTitleInputChange(event) {
    setTitleInput(event.target.value);
  }

  const editedTitleSubmit = (e) => {
    e.preventDefault();
    setListTitle(titleInput);

    setEditingTitle(false);
  };

  const [editingTitle, setEditingTitle] = useState(false);

  const [titleInput, setTitleInput] = useState();

  useEffect(() => {
    setTitleInput(listTitle);
  }, [listTitle]);

  return (
    <div className="truthtally-container">
      {showShareModal && <div className="modal-overlay" />}
      <Controls {...props} />

      <div className="list-title">
        {editingTitle ? (
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

        {listState === "edit" && (
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
