import React, { useState, useEffect } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'react-tooltip/dist/react-tooltip.css';
import { Store } from 'react-notifications-component';
import styles from '@/styles/TruthTally.module.css';
import { useRouter } from 'next/router';

const ShareListModal = ({
  sourceListChanged,
  sourceTitleChanged,
  uri,
  items,
  setShowShareModal,
  listTitle,
  sourceListType,
  gameState,
  sourceRankedListChanged,
  sourceListURI,
  draggableListItems,
  isRankingSharedList,
  listAuthor,
  sourceListTags,
  setSourceListTags
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const [showShareLoader, setShowShareLoader] = useState(false);
  const startGameStart = gameState === 'start';
  const finishedGameState = gameState === 'finished';
  const isSourceListUnranked = sourceListType === 'unranked';
  const isSourceListRanked = sourceListType === 'ranked';
  const isSourceListNew = sourceListType === 'new';

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
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== '')
      .reduce((uniqueTags, tag) => {
        if (!uniqueTags.includes(tag)) {
          uniqueTags.push(tag);
        }
        return uniqueTags;
      }, []);

    const author = formData.listAuthor;

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
      if (tag.length < 2) {
        Store.addNotification({
          title: 'Invalid tag',
          message: `Tag '${tag}' is too short. Tags must contain at least 2 characters.`,
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
    setShowShareLoader(true);

    // BEGINNING OF FETCH REQUESTS

    (async () => {
      try {
        const response = await fetch('/api/get_token');
        const data = await response.json();
        const token = data.token;
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        };

        if (startGameStart) {
          (async () => {
            const tempList = await draggableListItems.map((item, index) => ({
              ...item,
              id: index + 1,
              score: 0
            }));

            const title = listTitle;
            const type = 'unranked';
            const unlisted = formData.isUnlisted;
            const newList = {
              title: title,
              ...(author.replace(/\s+/g, '') !== '' && { author: author }),
              items: tempList,
              type: type,
              unlisted: unlisted,
              ...(tags.length > 0 && { tags: tags })
            };
            try {
              let results = await fetch('/api/add_list', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newList)
              });

              if (results.status >= 200 && results.status < 300) {
                const response = await results.json();
                router.push('/list/' + response);
              } else {
                const errorResponse = await results.json();
                throw new Error(errorResponse.errors);
              }
            } catch (error) {
              console.log('error caught:', error);
              setShowShareLoader(false);
              Store.addNotification({
                title: 'Error sharing list',
                message: `There was an error sharing the list. Please try again`,
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
            }
          })();

          return;
        }

        //game is finished, but unranked list was never saved, is new, or is a modified shared list
        if (
          finishedGameState &&
          (isSourceListNew || sourceListChanged || (sourceTitleChanged && isSourceListUnranked))
        ) {
          // save unranked list and generate URI

          (async () => {
            const tempList = await draggableListItems.map((item, index) => ({
              ...item,
              id: index + 1,
              score: 0
            }));
            const title = listTitle;
            const type = 'unranked';
            const unlisted = formData.isUnlisted;
            const newList = {
              title: title,
              ...(author.replace(/\s+/g, '') !== '' && { author: author }),
              items: tempList,
              type: type,
              unlisted: unlisted,
              ...(tags.length > 0 && { tags: tags })
            };
            try {
              let results = await fetch('/api/add_list', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newList)
              });

              if (results.status >= 200 && results.status < 300) {
                const unrankedURI = await results.json();

                // if URI is returned, save ranked list, and associate URI with saved ranked list
                let id = 1;
                const tempRankedList = await items
                  .sort((a, b) => b.score - a.score)
                  .map((item) => ({ ...item, id: id++ }));

                const title = listTitle;
                const type = 'ranked';
                const unlisted = formData.isUnlisted;
                const sourceListURI = unrankedURI;
                const newList = {
                  title: title,
                  ...(author.replace(/\s+/g, '') !== '' && { author: author }),
                  items: tempRankedList,
                  type: type,
                  unlisted: unlisted,
                  source_uri: sourceListURI,
                  ...(tags.length > 0 && { tags: tags })
                };

                try {
                  let results = await fetch('/api/add_list', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(newList)
                  });

                  if (results.status >= 200 && results.status < 300) {
                    const response = await results.json();
                    router.push('/list/' + response);
                  } else {
                    const errorResponse = await results.json();
                    throw new Error(errorResponse.errors);
                  }
                } catch (error) {
                  console.log('error caught:', error);
                  setShowShareLoader(false);
                  Store.addNotification({
                    title: 'Error sharing list',
                    message: `There was an error sharing the list. Please try again`,
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
                }
              } else {
                const errorResponse = await results.json();
                throw new Error(errorResponse.errors);
              }
            } catch (error) {
              console.log('error caught:', error);
              setShowShareLoader(false);
              Store.addNotification({
                title: 'Error sharing list',
                message: `There was an error sharing the list. Please try again`,
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
            }
          })();

          return;
        }

        //game is finished, and source is saved unranked list, or source list type is ranked and title has been modified
        if (
          (finishedGameState && isSourceListUnranked && !sourceListChanged) ||
          isRankingSharedList ||
          ((sourceRankedListChanged || sourceTitleChanged) && isSourceListRanked)
        ) {
          // save unranked list and generate URI
          (async () => {
            let id = 1;
            let source_uri;
            const tempRankedList = await items.sort((a, b) => b.score - a.score).map((item) => ({ ...item, id: id++ }));

            const title = listTitle;
            const type = 'ranked';

            const unlisted = formData.isUnlisted;

            isSourceListRanked ? (source_uri = sourceListURI) : (source_uri = uri);

            const newList = {
              title: title,
              ...(author.replace(/\s+/g, '') !== '' && { author: author }),
              items: tempRankedList,
              type: type,
              unlisted: unlisted,
              source_uri: source_uri,
              ...(tags.length > 0 && { tags: tags })
            };

            try {
              let results = await fetch('/api/add_list', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newList)
              });

              if (results.status >= 200 && results.status < 300) {
                const response = await results.json();
                router.push('/list/' + response);
              } else {
                const errorResponse = await results.json();
                throw new Error(errorResponse.errors);
              }
            } catch (error) {
              console.log('error caught:', error);
              Store.addNotification({
                title: 'Error sharing list',
                message: `There was an error sharing the list. Please try again`,
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
              setShowShareLoader(false);
            }
          })();

          return;
        }
      } catch (error) {
        setShowShareLoader(false);
        Store.addNotification({
          title: 'Error sharing list',
          message: `There was an error sharing the list. Please try again`,
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
        console.error('Error fetching token:', error);
      }
    })();
    // END OF FETCH REQUESTS
  };

  useEffect(() => {}, [showShareLoader]);

  const copyLink = (e) => {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  document.body.style.overflow = 'hidden';

  const shareUnchangedList = () => {
    const unchangedRankedList =
      uri !== undefined && isSourceListRanked && !sourceTitleChanged && finishedGameState && !sourceRankedListChanged;

    const unchangedUnrankedList = !sourceListChanged && !sourceTitleChanged && uri !== undefined && startGameStart;

    const displayCopyLink = () => {
      return (
        <div className={styles['share-modal']}>
          <form>
            <input type="text" id="input" name="input" value={window.location.href} readOnly />
            <div className={styles['share-modal-buttons']}>
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
    const gameStartNewShare = (sourceListChanged || sourceTitleChanged || uri === undefined) && startGameStart;
    const rankingCompletedNewShare =
      finishedGameState &&
      (isSourceListNew ||
        isSourceListUnranked ||
        sourceTitleChanged ||
        isRankingSharedList ||
        (isSourceListRanked && sourceRankedListChanged));

    if (gameStartNewShare || rankingCompletedNewShare) {
      return (
        <div className={styles['share-modal']}>
          {showShareLoader && (
            <div className={styles['share-modal-loading-spinner']}>
              <div className={styles['share-modal-spinner-circle']}></div>
            </div>
          )}
          <div>
            <form onSubmit={(e) => shareList(e)}>
              <span style={{ marginRight: 'auto', paddingLeft: '20px' }}>
                <label htmlFor="input">Your name:</label>
                <FontAwesomeIcon
                  className={styles['info-icon']}
                  style={{ fontSize: '1em' }}
                  data-tooltip-id="authorTooltip"
                  data-tooltip-place="top"
                  icon={faInfoCircle}
                  data-tooltip-content="Name: Enter your name or a nickname to display as the person who created or ranked the list when sharing unranked or ranked lists with others."
                />
                <ReactTooltip id="authorTooltip" effect="solid" multiline={true} className={styles['tooltip']} />
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

              <span style={{ marginRight: 'auto', paddingLeft: '20px' }}>
                <label htmlFor="input">Tags:</label>
                <FontAwesomeIcon
                  className={styles['info-icon']}
                  data-tooltip-id="tagsTooltip"
                  data-tooltip-place="top"
                  icon={faInfoCircle}
                  data-tooltip-content="Tags: Add up to 6 tags, using single words without spaces and up to 20 characters each, to improve searchability and aid others in discovering your list."
                />
                <ReactTooltip id="tagsTooltip" effect="solid" multiline={true} className={styles['tooltip']} />
              </span>
              <input
                type="text"
                id="input"
                name="listTags"
                placeholder={'(optional)'}
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
                  className={styles['info-icon']}
                  data-tooltip-id="unlistedTooltip"
                  data-tooltip-place="top"
                  icon={faInfoCircle}
                  data-tooltip-content=" Unlisted: Your list won't appear on the public shared lists page, but can still be shared with others
        using a unique link."
                />
                <ReactTooltip id="unlistedTooltip" effect="solid" multiline={true} className={styles['tooltip']} />
              </span>
              <div className={styles['share-modal-buttons']}>
                <button type="submit">Get Link</button>
                <button type="button" onClick={() => hideModal()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
