import React from 'react';

const ResultItem = (props) => {
  const { item, id } = props;
  let rankedItem = `${id}. ${item}`;
  return <div className="ranked-item">{rankedItem}</div>;
};
export default ResultItem;
