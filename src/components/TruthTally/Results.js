import React from 'react';
import ResultItem from './ResultItem';

const Results = ({ listAuthor, listTitle, gameState, items }) => {
  if (gameState === 'finished') {
    let key = 1;
    let id = 1;

    return (
      <div className="results-container">
        <div className="ranked-list-title">
          <h2>{listTitle}</h2>
          <h3>{listAuthor ? 'Ranked by ' + listAuthor : 'Ranked'}</h3>
        </div>
        <div className="ranked-items">
          {items
            .sort((a, b) => b.score - a.score)
            .map((item) => (
              <ResultItem item={item.item} id={id++} key={key++} />
            ))}
        </div>
      </div>
    );
  }
};

export default Results;
