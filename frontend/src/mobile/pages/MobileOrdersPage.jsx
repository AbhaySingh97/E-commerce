import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiClock } from 'react-icons/fi';
import { MobileHeader } from '../components/MobileUI';

const MobileOrdersPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const orders = [
    { id: 'ORD-12345', date: '24 May, 2026', status: 'In Transit', total: 12499, items: 2, image: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&q=80&w=200' },
    { id: 'ORD-12344', date: '18 May, 2026', status: 'Delivered', total: 5999, items: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200' },
    { id: 'ORD-12340', date: '10 May, 2026', status: 'Delivered', total: 2499, items: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="mobile-page">
      <MobileHeader title="My Orders" />
      
      <div className="mobile-page-content">
        <div className="order-filters">
          {['All', 'Ongoing', 'Delivered', 'Cancelled'].map((f) => (
            <button 
              key={f} 
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" onClick={() => navigate(`/order-tracking/${order.id}`)}>
              <div className="order-card-header">
                <div className="id-group">
                  <FiPackage className="id-icon" />
                  <span className="order-id">{order.id}</span>
                </div>
                <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-card-body">
                <div className="order-thumb">
                  <img src={order.image} alt="Order item" />
                </div>
                <div className="order-summary">
                  <p className="order-date">{order.date}</p>
                  <p className="order-meta">{order.items} items • <span className="order-price">₹{order.total.toLocaleString()}</span></p>
                </div>
                <FiChevronRight className="arrow-icon" />
              </div>

              <div className="order-card-footer">
                <button className="btn-track">
                  <FiClock size={16} /> Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .order-filters {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          margin: 0 -20px 24px;
          padding: 0 20px;
        }
        .order-filters::-webkit-scrollbar { display: none; }
        .filter-chip {
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          color: var(--mobile-text-dim);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .filter-chip.active {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .order-card {
          background: var(--mobile-surface);
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
          padding: 16px;
          transition: transform 0.2s ease;
        }
        .order-card:active {
          transform: scale(0.98);
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--mobile-border);
        }
        .id-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .id-icon {
          color: var(--mobile-accent);
        }
        .order-id {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .status-badge.in-transit { background: rgba(139, 92, 246, 0.1); color: var(--mobile-accent); }
        .status-badge.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .order-card-body {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .order-thumb {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: #111;
          overflow: hidden;
        }
        .order-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .order-summary {
          flex: 1;
        }
        .order-date {
          font-size: 0.85rem;
          color: var(--mobile-text-dim);
          margin: 0 0 4px;
        }
        .order-meta {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
        }
        .order-price {
          color: #fff;
        }
        .arrow-icon {
          color: var(--mobile-text-dim);
        }
        .order-card-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--mobile-border);
        }
        .btn-track {
          width: 100%;
          background: transparent;
          color: #fff;
          border: 1px solid var(--mobile-border);
          padding: 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      `}} />
    </div>
  );
};

export default MobileOrdersPage;
