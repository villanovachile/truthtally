import React from 'react';

const ResultItem = ({ item, id }) => {
  let rankedItem = `${id}. ${item}`;
  return <div className="ranked-item">{rankedItem}</div>;
};
export default ResultItem;
