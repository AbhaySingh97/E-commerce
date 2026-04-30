import React from 'react';

const EmptyState = ({ eyebrow = 'Nothing here yet', title, description, action }) => {
  return (
    <section className="empty-state-card">
      <span className="page-state-badge">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
};

export default EmptyState;
