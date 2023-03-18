import React, { useState, useRef, useEffect } from "react";

const ShareListModal = ({
  sourceListChanged,
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
}) => {
  const listTags = useRef();
  const nextItemId = useRef(0);
  const [copied, setCopied] = useState(false);

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

    (async () => {
      const tempList = await items.map((item) => ({ ...item, score: 0 }));
      const tags = formData.listTags
        .replace(/^[,\s]+|[,\s]+$/g, "")
        .replace(/\s*,\s*/g, ",")
        .split(",");
      const title = formData.listTitle;
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
      }
    })();
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
      {!currentItemsListEmpty && JSON.stringify(sourceItemsList) !== JSON.stringify(currentItemsList) && (
        <div className="share-modal">
          <form onSubmit={(e) => shareList(e)}>
            <label htmlFor="input">Title (required):</label>

            {/* <input type="text" id="input" name="input" placeholder="i.e., Beatles Albums" ref={listTitle} required /> */}
            <input type="text" id="input" name="listTitle" placeholder="i.e., Beatles Albums" onChange={handleChange} value={formData.listTitle} required />
            <label htmlFor="input">Tags (separate with commas):</label>
            <input type="text" id="input" name="input" placeholder="(optional)" ref={listTags} />
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

      {!currentItemsListEmpty && JSON.stringify(sourceItemsList) === JSON.stringify(currentItemsList) && (
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
