import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ type = 'text', className = '', ...props }) => {
  const inputClass = `custom-input ${className}`;
  
  return (
    <input
      type={type}
      className={inputClass}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
