import React from 'react';

const SectionHeader = ({ eyebrow, title, description, align = 'left', action }) => {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <div>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
};

export default SectionHeader;
