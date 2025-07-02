import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

const Loading = ({ message, size = 'medium' }) => {
  return (
    <div className={`loading-container loading-${size}`} role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Loading;