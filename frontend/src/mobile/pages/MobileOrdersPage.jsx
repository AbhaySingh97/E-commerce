import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon } from '../components/MobileUI';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MobileOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrders();
        setOrders(res.data.orders || res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        toast.error('Could not load your history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  return (
    <div className="mobile-page pb-32 bg-dark-0">
      <TopAppBar title="Order History" showBack={true} />
      
      <main className="mobile-content px-6 pt-8">
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all ${activeFilter === f ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/20">Retrieving archives...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order._id} 
                className="p-6 rounded-[24px] bg-dark-1 border border-white/5"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">#{order.orderNumber || order._id.slice(-8)}</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] overflow-hidden">
                    <img src={order.items?.[0]?.product?.images?.[0] || 'https://via.placeholder.com/100'} alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                    </p>
                    <p className="text-white/40 text-[12px]">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-serif text-lg">₹{order.totalAmount.toLocaleString()}</p>
                    <Icon name="chevron_right" style={{ color: 'rgba(255,255,255,0.1)', fontSize: '18px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Icon name="history" style={{ fontSize: '48px', opacity: 0.1, marginBottom: '24px' }} />
            <p className="card-label opacity-40">No records found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileOrdersPage;
