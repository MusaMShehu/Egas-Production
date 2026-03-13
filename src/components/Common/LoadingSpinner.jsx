import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = true, text = 'Loading...' }) => {
  const spinner = (
    <div className="spinner-container">
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="full-page-spinner">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;