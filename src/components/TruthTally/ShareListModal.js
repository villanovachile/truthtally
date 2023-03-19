import React, { useState, useRef, useEffect } from "react";

const ShareListModal = ({
  sourceListChanged,
  sourceTitleChanged,
  currentItemsList,
  currentItemsListEmpty,
  sourceItemsList,
  setSourceItemsList,
  uri,
  navigate,
  items,
  disableModalState,
  setShowShareModal,
  showShareModal,
  listTitle,
  sourceListType,
  setSourceListType,
  gameState,
  sourceRankedListChanged,
}) => {
  const listTags = useRef();
  const nextItemId = useRef(0);
  const [copied, setCopied] = useState(false);

  console.log(sourceTitleChanged);

  const hideModal = () => {
    document.body.style.overflow = "unset";
    setShowShareModal(false);
    // window.sessionStorage.setItem("showShareModal", JSON.stringify(false));
  };

  const [formData, setFormData] = useState({
    listTitle: "",
    listTags: "",
    isUnlisted: false,
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  const shareList = (e) => {
    e.preventDefault();
    if (gameState === "start") {
      (async () => {
        const tempList = await items.map((item) => ({ ...item, score: 0 }));
        const tags = formData.listTags
          .replace(/^[,\s]+|[,\s]+$/g, "")
          .replace(/\s*,\s*/g, ",")
          .split(",");
        const title = listTitle;
        const type = "list";
        const unlisted = formData.isUnlisted;
        const newList = { items: tempList, unlisted: unlisted, title: title, tags: tags, type: type };
        let results = await fetch("/.netlify/functions/add_list", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newList),
        });
        const response = await results.json();
        if (response !== undefined) {
          navigate("/list/" + response);
          hideModal();
        }
      })();
      return;
    }

    //game is finished, but unranked list was never saved or is new
    if (gameState === "finished" && sourceListType === "new") {
      // save unranked list and generate URI
      (async () => {
        const tempList = await items.sort((a, b) => a.id - b.id).map((item) => ({ ...item, score: 0 }));
        const tags = formData.listTags
          .replace(/^[,\s]+|[,\s]+$/g, "")
          .replace(/\s*,\s*/g, ",")
          .split(",");
        const title = listTitle;
        const type = "unranked";
        const unlisted = formData.isUnlisted;
        const newList = { items: tempList, unlisted: unlisted, title: title, tags: tags, type: type };
        let results = await fetch("/.netlify/functions/add_list", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newList),
        });
        const unrankedURI = await results.json();
        if (unrankedURI !== undefined) {
          console.log(unrankedURI);
          // if URI is returned, save ranked list, and associate URI with saved ranked list
          let id = 1;
          const tempRankedList = await items.sort((a, b) => b.score - a.score).map((item) => ({ ...item, id: id++ }));
          const tags = formData.listTags
            .replace(/^[,\s]+|[,\s]+$/g, "")
            .replace(/\s*,\s*/g, ",")
            .split(",");
          const title = listTitle;
          const type = "ranked";
          const unlisted = formData.isUnlisted;
          const sourceListURI = unrankedURI;
          const newList = { items: tempRankedList, unlisted: unlisted, title: title, tags: tags, type: type, source_uri: sourceListURI };
          let results = await fetch("/.netlify/functions/add_list", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newList),
          });

          const response = await results.json();
          if (response !== undefined) {
            console.log(response);
            navigate("/list/" + response);
            hideModal();
          }
        }
      })();
      return;
    }

    //game is finished, and source is saved unranked list
    if (gameState === "finished" && sourceListType === "unranked") {
      // save unranked list and generate URI
      (async () => {
        // if URI is returned, save ranked list, and associate URI with saved ranked list
        let id = 1;
        const tempRankedList = await items.sort((a, b) => b.score - a.score).map((item) => ({ ...item, id: id++ }));
        const tags = formData.listTags
          .replace(/^[,\s]+|[,\s]+$/g, "")
          .replace(/\s*,\s*/g, ",")
          .split(",");
        const title = listTitle;
        const type = "ranked";
        const unlisted = formData.isUnlisted;
        const newList = { items: tempRankedList, unlisted: unlisted, title: title, tags: tags, type: type, source_uri: uri };
        let results = await fetch("/.netlify/functions/add_list", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newList),
        });
        const response = await results.json();
        if (response !== undefined) {
          console.log(response);
          navigate("/list/" + response);
          hideModal();
        }
      })();
      return;
    }
  };

  const copyLink = (e) => {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  document.body.style.overflow = "hidden";

  return (
    <>
      {/* Display modal for unsaved unranked list */}
      {(sourceListChanged || sourceTitleChanged || uri === undefined) && gameState === "start" && (
        <div className="share-modal">
          <form onSubmit={(e) => shareList(e)}>
            {/* <label htmlFor="input">Title (required):</label> */}

            {/* <input type="text" id="input" name="listTitle" placeholder="i.e., Beatles Albums" onChange={handleChange} value={formData.listTitle} required /> */}
            <label htmlFor="input">Tags (separate with commas)(unranked):</label>
            <input type="text" id="input" name="listTags" placeholder="(optional)" onChange={handleChange} value={formData.listTags} />
            <span>
              <input type="checkbox" id="input" checked={formData.isUnlisted} onChange={handleChange} name="isUnlisted" />
              <label htmlFor="isUnlisted">Unlisted</label>
            </span>
            <div className="share-modal-buttons">
              <button type="submit">Get Link</button>
              <button type="button" onClick={() => hideModal()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* display modal for saved unranked lists */}
      {!sourceListChanged && !sourceTitleChanged && uri !== undefined && gameState === "start" && (
        <div className="share-modal">
          <form>
            <input type="text" id="input" name="input" value={window.location.href} readOnly />
            <div className="share-modal-buttons">
              <button onClick={copyLink}>{!copied ? "Copy link" : "Copied!"}</button>
              <button type="button" onClick={() => hideModal()}>
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display modal for unsaved ranked list or saved ranked list with modified title */}
      {gameState === "finished" && (sourceListType === "new" || sourceListType === "unranked" || sourceTitleChanged || (sourceListType === "ranked" && sourceRankedListChanged === true)) && (
        <div className="share-modal">
          <form onSubmit={(e) => shareList(e)}>
            {/* <label htmlFor="input">Title (required):</label> */}

            {/* <input type="text" id="input" name="listTitle" placeholder="i.e., Beatles Albums" onChange={handleChange} value={formData.listTitle} required /> */}
            <label htmlFor="input">Tags (separate with commas) (ranked):</label>
            <input type="text" id="input" name="listTags" placeholder="(optional)" onChange={handleChange} value={formData.listTags} />
            <span>
              <input type="checkbox" id="input" checked={formData.isUnlisted} onChange={handleChange} name="isUnlisted" />
              <label htmlFor="isUnlisted">Unlisted</label>
            </span>
            <div className="share-modal-buttons">
              <button type="submit">Get Link</button>
              <button type="button" onClick={() => hideModal()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* display modal for saved ranked lists */}
      {uri !== undefined && sourceListType === "ranked" && !sourceTitleChanged && gameState === "finished" && sourceRankedListChanged === false && (
        <div className="share-modal">
          <form>
            <input type="text" id="input" name="input" value={window.location.href} readOnly />
            <div className="share-modal-buttons">
              <button onClick={copyLink}>{!copied ? "Copy link" : "Copied!"}</button>
              <button type="button" onClick={() => hideModal()}>
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
  // }
};

export default ShareListModal;
