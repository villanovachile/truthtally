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

  const [listTitle, setListTitle] = useState();

  const [sourceItemsList, setSourceItemsList] = useState([]);

  const [showShareModal, setShowShareModal] = useState(false);

  const [gameState, setGameState] = useState("preload");

  const [gameCompleted, setGameCompleted] = useState();

  const [loadingText, setLoadingText] = useState("");

  const [pairs, setPairs] = useState([]);

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
  };

  return (
    <div className="truthtally-container">
      {showShareModal && <div className="modal-overlay" />}
      <Controls {...props} />

      {listTitle && (
        <div className="list-title">
          <svg fill="#dedede" width={20} height={20} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#dedede" onClick={copyLink} className="svg-button">
            <path
              fill="#dedede"
              stroke="#dedede"
              d="m10.406 13.406 2.5-2.531c.219-.219.469-.5.719-.813.25-.281.531-.531.813-.75.531-.469 1.156-.875 1.938-.875.688 0 1.281.313 1.719.719s.688 1 .688 1.688c0 .281-.031.594-.125.813a6.43 6.43 0 0 1-.594 1c-.094.125-.188.25-.188.375 0 .094 0 .188.063.219.344.844.594 1.563.75 2.438.094.344.281.5.594.5.125 0 .25-.031.375-.125.25-.156.469-.406.688-.656.125-.125.219-.25.281-.313a5.981 5.981 0 0 0 1.781-4.25 6.02 6.02 0 0 0-1.781-4.281c-1.094-1.063-2.625-1.781-4.25-1.781s-3.188.656-4.281 1.813l-4.281 4.25c-1.125 1.156-1.75 2.656-1.75 4.25 0 .469.188 1.438.5 2.344.313.875.719 1.656 1.25 1.656.281 0 .875-.469 1.375-1s1-1.125 1-1.344c0-.156-.125-.344-.25-.625-.156-.281-.219-.625-.219-1.031 0-.625.25-1.25.688-1.688zm-.093 12 4.281-4.25c1.125-1.094 1.75-2.688 1.75-4.281 0-.469-.188-1.406-.5-2.313-.281-.875-.719-1.688-1.25-1.688-.219 0-.875.5-1.344 1.031-.531.531-1.031 1.094-1.031 1.313 0 .156.094.406.25.656.156.281.281.594.281 1a2.893 2.893 0 0 1-.719 1.75l-2.531 2.5c-.219.25-.469.5-.719.781L8 22.686c-.531.5-1.188.844-1.969.844a2.354 2.354 0 0 1-2.375-2.375c0-.313.063-.594.156-.813.188-.438.375-.75.594-1a.58.58 0 0 0 .125-.344c0-.063-.031-.125-.063-.25a9.969 9.969 0 0 1-.75-2.438c-.063-.156-.094-.281-.188-.344-.094-.125-.25-.156-.406-.156a.52.52 0 0 0-.344.125c-.25.156-.5.406-.719.656-.094.125-.219.219-.281.281a6.11 6.11 0 0 0-1.781 4.281c0 1.656.656 3.188 1.781 4.281a5.974 5.974 0 0 0 4.25 1.75c1.625 0 3.188-.625 4.281-1.781z"
            />
          </svg>
          {listTitle}
        </div>
      )}

      <LoadingSpinner {...props} />

      <Stage {...props} />

      <Results {...props} />

      <ItemsList {...props} />

      {showShareModal && <ShareListModal {...props} />}
    </div>
  );
}

export default TruthTally;
