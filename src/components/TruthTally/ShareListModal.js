import React, { useState, useEffect } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'react-tooltip/dist/react-tooltip.css';
import { Store } from 'react-notifications-component';

const ShareListModal = ({
  sourceListChanged,
  sourceTitleChanged,
  currentItemsList,
  sourceItemsList,
  setSourceItemsList,
  uri,
  navigate,
  items,
  setItems,
  disableModalState,
  setShowShareModal,
  showShareModal,
  listTitle,
  sourceListType,
  setSourceListType,
  gameState,
  sourceRankedListChanged,
  sourceListURI,
  setSourceListURI,
  updateDraggableListItems,
  draggableListItems,
  isRankingSharedList,
  setIsRankingSharedList,
  listAuthor,
  sourceListTags,
  setSourceListTags
}) => {
  const [copied, setCopied] = useState(false);

  const hideModal = () => {
    document.body.style.overflow = 'unset';
    setShowShareModal(false);
    window.sessionStorage.setItem('showShareModal', JSON.stringify(false));
  };

  const [formData, setFormData] = useState({
    listAuthor: '',
    listTags: '',
    isUnlisted: false
  });

  function handleChange(event) {
    sourceListTags && setSourceListTags([]);
    const { name, value, type, checked } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  }

  useEffect(() => {
    sourceListTags &&
      setFormData((prevFormData) => ({
        ...prevFormData,
        listTags: sourceListTags.map(String).join(', ')
      }));
  }, []);

  const shareList = (e) => {
    e.preventDefault();

    const tags = formData.listTags
      .replace(/^[,\s]+|[,\s]+$/g, '')
      .replace(/\s*,\s*/g, ',')
      .split(',')
      .filter((tag) => tag !== '')
      .reduce((uniqueTags, tag) => {
        if (!uniqueTags.includes(tag)) {
          uniqueTags.push(tag);
        }
        return uniqueTags;
      }, []);

    if (tags.length > 6) {
      Store.addNotification({
        title: 'Too many tags',
        message: 'You cannot enter more than 6 tags',
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
      return;
    }

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (/\s/.test(tag)) {
        Store.addNotification({
          title: 'Invalid tag',
          message: `Tag '${tag}' contains spaces. Tags cannot contain spaces.`,
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
        return;
      }
      if (tag.length > 20) {
        Store.addNotification({
          title: 'Invalid tag',
          message: `Tag '${tag}' is too long. Tags can only contain up to 20 characters.`,
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
        return;
      }
      if (tag.length < 3) {
        Store.addNotification({
          title: 'Invalid tag',
          message: `Tag '${tag}' is too short. Tags must contain at least 3 characters.`,
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
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(tag)) {
        Store.addNotification({
          title: 'Invalid tag',
          message: `Tag '${tag}' contains special characters. Tags can only contain letters and numbers.`,
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
        return;
      }
    }
    if (gameState === 'start') {
      (async () => {
        const tempList = await draggableListItems.map((item, index) => ({ ...item, id: index + 1, score: 0 }));

        const title = listTitle;
        const type = 'unranked';
        const unlisted = formData.isUnlisted;
        const newList = { items: tempList, unlisted: unlisted, title: title, tags: tags, type: type };
        let results = await fetch('/.netlify/functions/add_list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newList)
        });
        const response = await results.json();
        if (response !== undefined) {
          navigate('/list/' + response);
        }
      })();
      return;
    }

    //game is finished, but unranked list was never saved, is new, or is a modified shared list
    if (
      gameState === 'finished' &&
      (sourceListType === 'new' || sourceListChanged || (sourceTitleChanged && sourceListType === 'unranked'))
    ) {
      // save unranked list and generate URI
      console.log('Saving changed list');
      (async () => {
        const tempList = await draggableListItems.map((item, index) => ({ ...item, id: index + 1, score: 0 }));
        // const tags = formData.listTags
        //   .replace(/^[,\s]+|[,\s]+$/g, '')
        //   .replace(/\s*,\s*/g, ',')
        //   .split(',');
        const title = listTitle;
        const author = formData.listAuthor;
        const type = 'unranked';
        const unlisted = formData.isUnlisted;
        const newList = { items: tempList, unlisted: unlisted, title: title, tags: tags, type: type, author: author };
        let results = await fetch('/.netlify/functions/add_list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newList)
        });
        const unrankedURI = await results.json();
        if (unrankedURI !== undefined) {
          // if URI is returned, save ranked list, and associate URI with saved ranked list
          let id = 1;
          const tempRankedList = await items.sort((a, b) => b.score - a.score).map((item) => ({ ...item, id: id++ }));
          // const tags = formData.listTags
          //   .replace(/^[,\s]+|[,\s]+$/g, '')
          //   .replace(/\s*,\s*/g, ',')
          //   .split(',');
          const title = listTitle;
          const type = 'ranked';
          const author = formData.listAuthor;
          const unlisted = formData.isUnlisted;
          const sourceListURI = unrankedURI;
          const newList = {
            items: tempRankedList,
            unlisted: unlisted,
            title: title,
            tags: tags,
            type: type,
            source_uri: sourceListURI,
            author: author
          };
          let results = await fetch('/.netlify/functions/add_list', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newList)
          });

          const response = await results.json();
          if (response !== undefined) {
            navigate('/list/' + response);
          }
        }
      })();
      return;
    }

    //game is finished, and source is saved unranked list, or source list type is ranked and title has been modified
    if (
      (gameState === 'finished' && sourceListType === 'unranked' && !sourceListChanged) ||
      isRankingSharedList ||
      ((sourceRankedListChanged === true || sourceTitleChanged) && sourceListType === 'ranked')
    ) {
      // save unranked list and generate URI
      (async () => {
        let id = 1;
        let source_uri;
        const tempRankedList = await items.sort((a, b) => b.score - a.score).map((item) => ({ ...item, id: id++ }));
        const tags = formData.listTags
          .replace(/^[,\s]+|[,\s]+$/g, '')
          .replace(/\s*,\s*/g, ',')
          .split(',');
        const title = listTitle;
        const type = 'ranked';

        let author;
        formData.listAuthor.replace(/\s+/g, '') !== '' ? (author = formData.listAuthor) : (author = null);

        const unlisted = formData.isUnlisted;

        sourceListType === 'ranked' ? (source_uri = sourceListURI) : (source_uri = uri);

        const newList = {
          items: tempRankedList,
          unlisted: unlisted,
          title: title,
          tags: tags,
          type: type,
          source_uri: source_uri,
          author: author
        };
        let results = await fetch('/.netlify/functions/add_list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newList)
        });
        const response = await results.json();
        if (response !== undefined) {
          navigate('/list/' + response);
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

  document.body.style.overflow = 'hidden';

  const shareUnchangedList = () => {
    const unchangedRankedList =
      uri !== undefined &&
      sourceListType === 'ranked' &&
      !sourceTitleChanged &&
      gameState === 'finished' &&
      sourceRankedListChanged === false;

    const unchangedUnrankedList =
      !sourceListChanged && !sourceTitleChanged && uri !== undefined && gameState === 'start';

    const displayCopyLink = () => {
      return (
        <div className="share-modal">
          <form>
            <input type="text" id="input" name="input" value={window.location.href} readOnly />
            <div className="share-modal-buttons">
              <button onClick={copyLink}>{!copied ? 'Copy link' : 'Copied!'}</button>
              <button type="button" onClick={() => hideModal()}>
                Close
              </button>
            </div>
          </form>
        </div>
      );
    };

    const displayMobileShare = () => {
      hideModal();
      navigator
        .share({
          title: listAuthor ? 'Ranked by ' + listAuthor : 'Ranked',
          url: window.location.href
        })
        .then()
        .catch((error) => console.log('Error sharing:', error));
    };

    if ((unchangedRankedList || unchangedUnrankedList) && !isRankingSharedList) {
      if (!navigator.share) {
        return displayCopyLink();
      } else {
        displayMobileShare();
      }
    }

    // If the conditions are not met, return null
    return null;
  };

  const shareChangedList = () => {
    const gameStartNewShare = (sourceListChanged || sourceTitleChanged || uri === undefined) && gameState === 'start';
    const gameCompletedNewShare =
      gameState === 'finished' &&
      (sourceListType === 'new' ||
        sourceListType === 'unranked' ||
        sourceTitleChanged ||
        isRankingSharedList ||
        (sourceListType === 'ranked' && sourceRankedListChanged === true));

    if (gameStartNewShare || gameCompletedNewShare) {
      return (
        <div className="share-modal">
          <form onSubmit={(e) => shareList(e)}>
            {gameState === 'finished' && (
              <>
                <span style={{ marginRight: 'auto', paddingLeft: '20px' }}>
                  <label htmlFor="input">Your name:</label>
                  <FontAwesomeIcon
                    className="info-icon"
                    data-tooltip-id="authorTooltip"
                    data-tooltip-place="top"
                    icon={faInfoCircle}
                    data-tooltip-content="Name: Enter your name or a nickname to display as the person who ranked the list when sharing ranked lists with others."
                  />
                  <ReactTooltip id="authorTooltip" effect="solid" multiline={true} className="tooltip" />
                </span>
                <input
                  type="text"
                  id="input"
                  maxLength="30"
                  name="listAuthor"
                  placeholder="(optional)"
                  onChange={handleChange}
                  value={formData.listAuthor}
                />
              </>
            )}
            <span style={{ marginRight: 'auto', paddingLeft: '20px' }}>
              <label htmlFor="input">Tags:</label>
              <FontAwesomeIcon
                className="info-icon"
                data-tooltip-id="tagsTooltip"
                data-tooltip-place="top"
                icon={faInfoCircle}
                data-tooltip-content="Tags: Enter keywords separated by commas to improve searchability and help others discover your list."
              />
              <ReactTooltip id="tagsTooltip" effect="solid" multiline={true} className="tooltip" />
            </span>
            <input
              type="text"
              id="input"
              name="listTags"
              placeholder={'(Optional)'}
              onChange={handleChange}
              value={formData.listTags}
            />

            <span>
              <input
                type="checkbox"
                id="isUnlisted"
                checked={formData.isUnlisted}
                onChange={handleChange}
                name="isUnlisted"
              />
              <label htmlFor="isUnlisted">Unlisted</label>
              <FontAwesomeIcon
                className="info-icon"
                data-tooltip-id="unlistedTooltip"
                data-tooltip-place="top"
                icon={faInfoCircle}
                data-tooltip-content=" Unlisted: Your list won't appear on the public shared lists page, but can still be shared with others
        using a unique link."
              />
              <ReactTooltip id="unlistedTooltip" effect="solid" multiline={true} className="tooltip" />
            </span>
            <div className="share-modal-buttons">
              <button type="submit">Get Link</button>
              <button type="button" onClick={() => hideModal()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

  return (
    <>
      {shareChangedList()}
      {shareUnchangedList()}
    </>
  );
};

export default ShareListModal;
