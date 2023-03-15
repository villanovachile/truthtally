import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ItemsList from "./ItemsList";
import Stage from "./Stage";
import Controls from "./Controls";
import Results from "./Results";
import LoadingSpinner from "./LoadingSpinner";
import ShareListModal from "./ShareListModal";

function TruthTally() {
  let { uri } = useParams();

  let navigate = useNavigate();

  const history = useLocation();

  const [items, setItems] = useState([]);

  const [sourceItemsList, setSourceItemsList] = useState([]);

  const [showShareModal, setShowShareModal] = useState(false);

  const [gameState, setGameState] = useState("preload");

  const [gameCompleted, setGameCompleted] = useState(false);

  const [loadingText, setLoadingText] = useState("");

  const [pairs, setPairs] = useState([]);

  const currentIndex = useRef(0);

  const nextItemId = useRef(0);

  useEffect(() => {
    setItems([]);
    const fetchURL = "/.netlify/functions/get_list?uri=" + uri;
    if (uri === undefined) {
      setLoadingText("Loading...");
      setGameState("start");
      return;
    }
    (async () => {
      try {
        setLoadingText("Loading...");
        let results = await fetch(fetchURL).then((response) => response.json());

        if (results !== "not_found" && results.type === "list") {
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
    uri,
    navigate,
    sourceItemsList,
    showShareModal,
    setShowShareModal,
  };

  return (
    <div className="truthtally-container">
      {showShareModal && <div className="modal-overlay" />}
      <Controls {...props} />

      <LoadingSpinner {...props} />

      <Stage {...props} />

      <Results {...props} />

      <ItemsList {...props} />

      {showShareModal && <ShareListModal {...props} />}
    </div>
  );
}

export default TruthTally;
