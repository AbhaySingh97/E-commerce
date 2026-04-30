import React from 'react';

const StatPill = ({ value, label }) => {
  return (
    <div className="stat-pill">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
};

export default StatPill;
