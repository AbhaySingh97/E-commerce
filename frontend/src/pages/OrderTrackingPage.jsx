import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState, PageLoader } from '../components/common/PageState';
import { formatCurrency, formatDate, formatOrderStatus } from '../lib/formatters';
import { orderAPI } from '../services/api';

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    orderAPI.getOrder(id)
      .then((response) => setOrder(response.data))
      .catch((requestError) => setError(requestError.response?.data?.error || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <PageLoader title="Loading order tracking" message="Pulling the latest delivery and payment details." />;
  }

  if (error || !order) {
    return <ErrorState title="Order not found" message={error || 'This order could not be loaded.'} />;
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="page order-tracking-page">
      <div className="page-hero compact">
        <span className="page-state-badge">Order #{order.orderNumber}</span>
        <h1>{formatOrderStatus(order.status)}</h1>
        <p>Total {formatCurrency(order.totalAmount)} · Ordered {formatDate(order.createdAt)}</p>
      </div>

      <div className="surface-card tracking-card">
        {order.status !== 'cancelled' ? (
          <div className="tracking-timeline">
            {STATUS_ORDER.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div key={status} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-dot"></div>
                  <span>{formatOrderStatus(status)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tracking-timeline cancelled">
            <div className="timeline-item cancelled">
              <div className="timeline-dot"></div>
              <span>Order cancelled</span>
            </div>
          </div>
        )}

        <div className="order-items">
          <h3>Items</h3>
          {order.items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="tracking-item">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>{formatCurrency(item.price)} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {order.shippingAddress && (
          <div className="shipping-address">
            <h3>Shipping address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
