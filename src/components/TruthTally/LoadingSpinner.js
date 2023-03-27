import React, { useState, useEffect } from 'react';

const LoadingSpinner = (props) => {
  const { gameState, setGameState, loadingText, rankingCompleted } = props;
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (gameState === 'loading') {
      setShowSpinner(true);

      const timer = setTimeout(() => {
        setShowSpinner(false);
        rankingCompleted === false ? setGameState('inProgress') : setGameState('finished');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState, setGameState, rankingCompleted]);

  if (gameState === 'loading' || gameState === 'preload') {
    return (
      <div className="loading-container">
        {showSpinner && <div className="spinner"></div>}
        <div className="loading-text">{loadingText}</div>
      </div>
    );
  }
};

export default LoadingSpinner;
