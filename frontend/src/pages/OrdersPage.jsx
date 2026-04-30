import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';
import { ErrorState, PageLoader } from '../components/common/PageState';
import { orderAPI } from '../services/api';
import { trackEvent } from '../lib/analytics';
import { formatCurrency, formatDate, formatOrderStatus } from '../lib/formatters';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    return orders.reduce((summary, order) => {
      summary.total += order.totalAmount || 0;
      if (order.status === 'delivered') summary.delivered += 1;
      if (order.status === 'pending') summary.pending += 1;
      return summary;
    }, { total: 0, delivered: 0, pending: 0 });
  }, [orders]);

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      trackEvent('order_cancel', { orderId });
      toast.success('Order cancelled');
      loadOrders();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to cancel order');
    }
  };

  const handleReturn = async (orderId) => {
    try {
      await orderAPI.requestReturn(orderId, { reason: 'Requested from customer account' });
      trackEvent('order_return_request', { orderId });
      toast.success('Return requested');
      loadOrders();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to request return');
    }
  };

  if (loading) {
    return <PageLoader title="Loading your orders" message="Gathering your latest purchases and delivery states." />;
  }

  if (error) {
    return <ErrorState title="Unable to load orders" message={error} action={<button type="button" className="btn-primary" onClick={loadOrders}>Retry</button>} />;
  }

  if (!orders.length) {
    return (
      <div className="page orders-page">
        <EmptyState
          eyebrow="No orders yet"
          title="You have not placed an order yet"
          description="When you place your first order, it will appear here with tracking, payment, and status updates."
          action={<Link to="/products" className="btn-primary">Explore products</Link>}
        />
      </div>
    );
  }

  return (
    <div className="page orders-page">
      <div className="page-hero compact">
        <span className="page-state-badge">Orders</span>
        <h1>Your purchase timeline</h1>
        <p>Track each order, monitor delivery, and act on eligible returns or cancellations without leaving your account.</p>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="dashboard-stat-card">
          <span>Delivered</span>
          <strong>{stats.delivered}</strong>
        </div>
        <div className="dashboard-stat-card">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="dashboard-stat-card">
          <span>Total spend</span>
          <strong>{formatCurrency(stats.total)}</strong>
        </div>
      </div>

      <div className="stack-list">
        {orders.map((order) => (
          <article key={order._id} className="surface-card order-card-v2">
            <div className="order-card-header">
              <div>
                <p className="order-code">Order #{order.orderNumber}</p>
                <h2>{formatOrderStatus(order.status)}</h2>
                <p>Placed {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-card-total">
                <strong>{formatCurrency(order.totalAmount)}</strong>
                <span>Payment: {formatOrderStatus(order.paymentStatus)}</span>
              </div>
            </div>

            <div className="order-item-summary">
              {order.items?.slice(0, 3).map((item) => (
                <div key={`${order._id}-${item.name}`} className="order-mini-item">
                  <img src={item.image || 'https://via.placeholder.com/72'} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="row-actions">
              <Link to={`/orders/${order._id}`} className="btn-secondary">Track order</Link>
              {['pending', 'confirmed'].includes(order.status) && (
                <button type="button" className="btn-secondary" onClick={() => handleCancel(order._id)}>Cancel order</button>
              )}
              {order.status === 'delivered' && (
                <button type="button" className="btn-secondary" onClick={() => handleReturn(order._id)}>Request return</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
