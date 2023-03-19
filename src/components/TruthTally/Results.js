import React from "react";
import ResultItem from "./ResultItem";

const Results = ({ listTitle, gameState, items }) => {
  if (gameState === "finished") {
    let key = 1;
    let id = 1;
    return (
      <div className="results-container">
        <div className="ranked-list-title">
          <h2>{listTitle} Ranked</h2>
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
