import React from 'react';
import PropTypes from 'prop-types';
import './Card.styles.css';

const Card = ({ title, children, className = '', ...props }) => {
  const cardClass = `custom-card ${className}`;

  return (
    <div className={cardClass} {...props}>
      {title && <div className="custom-card-header">{title}</div>}
      <div className="custom-card-body">{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
