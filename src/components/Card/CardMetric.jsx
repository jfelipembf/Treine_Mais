import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import './CardMetric.css';

const CardMetric = ({
  title,
  value,
  label,
  icon,
  type = 'default',
  className = '',
  ...props
}) => {
  return (
    <Card
      title={title}
      className={`card-metric ${type} ${className}`}
      {...props}
    >
      <div className="card-metric-content">
        {icon && <div className="card-metric-icon">{icon}</div>}
        <div className="card-metric-value">{value}</div>
        {label && <div className="card-metric-label">{label}</div>}
      </div>
    </Card>
  );
};

CardMetric.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node.isRequired,
  label: PropTypes.node,
  icon: PropTypes.node,
  type: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  className: PropTypes.string,
};

export default CardMetric;
