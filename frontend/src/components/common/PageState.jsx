import React from 'react';

export const PageLoader = ({ title = 'Loading experience', message = 'Preparing your page.' }) => {
  return (
    <section className="page page-state">
      <div className="page-state-card">
        <div className="loading-spinner" aria-hidden="true"></div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
};

export const ErrorState = ({ title = 'Something went wrong', message = 'Please refresh and try again.', action }) => {
  return (
    <section className="page page-state">
      <div className="page-state-card">
        <span className="page-state-badge">Issue detected</span>
        <h1>{title}</h1>
        <p>{message}</p>
        {action}
      </div>
    </section>
  );
};

export const InlineLoader = ({ label = 'Loading...' }) => <div className="inline-loader">{label}</div>;
