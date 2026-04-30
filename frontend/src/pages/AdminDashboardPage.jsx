import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/common/PageState';
import { summarizeTrackedEvents, trackEvent } from '../lib/analytics';
import { formatCurrency, formatDate, formatOrderStatus } from '../lib/formatters';
import { analyticsAPI, orderAPI, productAPI } from '../services/api';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded'];

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesPeriod, setSalesPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [stockDrafts, setStockDrafts] = useState({});
  const [productSearch, setProductSearch] = useState('');
  const [appliedProductSearch, setAppliedProductSearch] = useState('');

  const trackedSummary = useMemo(() => summarizeTrackedEvents(), []);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardResponse, salesResponse, topProductsResponse, ordersResponse, productsResponse] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getSalesAnalytics({ period: salesPeriod }),
        analyticsAPI.getTopProducts(),
        orderAPI.getAdminOrders(),
        productAPI.getAdminProducts({ search: appliedProductSearch || undefined }),
      ]);

      setDashboardStats(dashboardResponse.data);
      setSales(salesResponse.data || []);
      setTopProducts(topProductsResponse.data || []);
      setOrders(ordersResponse.data.orders || []);
      setProducts(productsResponse.data.products || []);
      setStockDrafts(Object.fromEntries((productsResponse.data.products || []).map((product) => [product._id, product.stock])));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [appliedProductSearch, salesPeriod]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const updateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status, note: `Status updated to ${status}` });
      trackEvent('admin_order_status_update', { orderId, status });
      toast.success('Order status updated');
      loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update order status');
    }
  };

  const saveStock = async (productId) => {
    try {
      await productAPI.updateStock(productId, Number(stockDrafts[productId] || 0));
      trackEvent('admin_stock_update', { productId, stock: Number(stockDrafts[productId] || 0) });
      toast.success('Stock updated');
      loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update stock');
    }
  };

  if (loading && !dashboardStats) {
    return <PageLoader title="Loading admin dashboard" message="Collecting commerce, catalog, and analytics data." />;
  }

  return (
    <div className="page admin-dashboard admin-dashboard-page">
      <div className="page-hero compact">
        <span className="page-state-badge">Admin</span>
        <h1>Commerce operations dashboard</h1>
        <p>Monitor sales, update order state, maintain stock, and watch frontend conversion signals in one workspace.</p>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card"><span>Paid orders</span><strong>{dashboardStats?.totalOrders || 0}</strong></div>
        <div className="dashboard-stat-card"><span>Revenue</span><strong>{formatCurrency(dashboardStats?.totalRevenue || 0)}</strong></div>
        <div className="dashboard-stat-card"><span>Customers</span><strong>{dashboardStats?.totalUsers || 0}</strong></div>
        <div className="dashboard-stat-card"><span>Products</span><strong>{dashboardStats?.totalProducts || 0}</strong></div>
      </div>

      <div className="admin-overview-grid">
        <section className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Sales trend</p>
              <h2>Recent revenue snapshots</h2>
            </div>
            <select value={salesPeriod} onChange={(event) => setSalesPeriod(event.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <div className="stack-list">
            {sales.map((entry) => (
              <div key={entry._id} className="analytics-row">
                <span>{entry._id}</span>
                <strong>{formatCurrency(entry.revenue)}</strong>
                <span>{entry.orders} orders</span>
              </div>
            ))}
            {!sales.length && <p className="muted-copy">No paid sales found for this period.</p>}
          </div>
        </section>

        <section className="surface-card">
          <p className="section-eyebrow">Frontend signals</p>
          <h2>Tracked customer actions</h2>
          <div className="stack-list">
            {Object.entries(trackedSummary).map(([name, count]) => (
              <div key={name} className="analytics-row">
                <span>{name.replaceAll('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
            {!Object.keys(trackedSummary).length && <p className="muted-copy">No local interaction events tracked yet.</p>}
          </div>
        </section>
      </div>

      <section className="surface-card">
        <p className="section-eyebrow">Top products</p>
        <h2>Paid-order leaders</h2>
        <div className="stack-list">
          {topProducts.map((item) => (
            <div key={item._id} className="analytics-row">
              <span>{item.name}</span>
              <strong>{item.totalSold} sold</strong>
              <span>{formatCurrency(item.totalRevenue)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-tabs">
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
      </div>

      {activeTab === 'orders' ? (
        <section className="surface-card">
          <div className="admin-table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Placed</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatOrderStatus(order.status)}</td>
                    <td>
                      <select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{formatOrderStatus(status)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Inventory</p>
              <h2>Catalog operations</h2>
            </div>
            <div className="admin-search-bar">
              <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search products or brands" />
              <button type="button" className="btn-secondary" onClick={() => setAppliedProductSearch(productSearch)}>Search</button>
            </div>
          </div>
          <div className="admin-table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <input
                        type="number"
                        value={stockDrafts[product._id] ?? product.stock}
                        min="0"
                        onChange={(event) => setStockDrafts((current) => ({ ...current, [product._id]: event.target.value }))}
                      />
                    </td>
                    <td>{product.status}</td>
                    <td>
                      <button type="button" className="btn-secondary" onClick={() => saveStock(product._id)}>Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboardPage;
