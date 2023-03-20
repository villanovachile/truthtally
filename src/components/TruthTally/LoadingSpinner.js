import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ gameState, setGameState, loadingText, gameCompleted }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (gameState === 'loading') {
      setShowSpinner(true);

      const timer = setTimeout(() => {
        setShowSpinner(false);
        gameCompleted === false ? setGameState('inProgress') : setGameState('finished');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState, setGameState, gameCompleted]);

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
