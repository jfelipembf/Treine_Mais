import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import './CardList.css';

const CardList = ({
  title,
  items,
  renderItem,
  className = '',
  ...props
}) => {
  return (
    <Card title={title} className={`card-list ${className}`} {...props}>
      <div className="card-list-content">
        {items.map((item, index) => (
          <div key={index} className="card-list-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </Card>
  );
};

CardList.propTypes = {
  title: PropTypes.node,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CardList;
