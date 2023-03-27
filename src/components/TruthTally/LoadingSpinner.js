import React, { useState, useEffect } from 'react';

const LoadingSpinner = (props) => {
  const { gameState, setGameState, loadingText, rankingCompleted } = props;
  const [showSpinner, setShowSpinner] = useState(false);

  const showLoadingScreen = gameState === 'loading';
  const preload = gameState === 'preload';

  useEffect(() => {
    if (showLoadingScreen) {
      setShowSpinner(true);

      const timer = setTimeout(() => {
        setShowSpinner(false);
        !rankingCompleted ? setGameState('inProgress') : setGameState('finished');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState, setGameState, rankingCompleted]);

  if (showLoadingScreen || preload) {
    return (
      <div className="loading-container">
        {showSpinner && <div className="spinner"></div>}
        <div className="loading-text">{loadingText}</div>
      </div>
    );
  }
};

export default LoadingSpinner;
