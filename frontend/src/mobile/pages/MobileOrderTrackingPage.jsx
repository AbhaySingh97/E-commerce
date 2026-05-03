import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopAppBar, Icon, triggerHaptic } from '../components/MobileUI';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MobileOrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrder(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order', err);
        toast.error('Manifest not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status);
    return steps.map((step, idx) => ({
      name: step,
      completed: idx <= currentIdx,
      active: idx === currentIdx
    }));
  };

  if (loading) return <div className="mobile-page flex items-center justify-center py-20 text-white/20 bg-dark-0">Tracing path...</div>;
  if (!order) return <div className="mobile-page flex items-center justify-center py-20 text-white/20 bg-dark-0">Path lost</div>;

  const trackingSteps = getStatusStep(order.status);

  return (
    <div className="mobile-page pb-32 bg-dark-0">
      <TopAppBar title={`Ritual #${order.orderNumber || order._id.slice(-6)}`} showBack={true} />
      
      <main className="mobile-content px-6 pt-8">
        {/* Tracking Card */}
        <div className="p-8 rounded-[32px] bg-gradient-to-br from-primary/20 to-magenta/10 border border-white/10 mb-10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Status</span>
            <h2 className="text-white text-3xl font-serif">{order.status}</h2>
            <p className="text-white/40 text-xs mt-2">Updated on {new Date(order.updatedAt).toLocaleDateString()}</p>
          </div>
          <Icon name="local_shipping" style={{ fontSize: '48px', color: '#fff', opacity: 0.2 }} />
        </div>

        {/* Timeline */}
        <div className="space-y-0 mb-12">
          {trackingSteps.map((step, idx) => (
            <div key={step.name} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-primary text-white' : 'bg-dark-1 border border-white/5 text-white/20'}`}>
                  <Icon name={step.completed ? 'check' : 'radio_button_unchecked'} style={{ fontSize: '16px' }} />
                </div>
                {idx < trackingSteps.length - 1 && (
                  <div className={`w-[2px] h-12 ${step.completed ? 'bg-primary' : 'bg-white/5'}`}></div>
                )}
              </div>
              <div className="pt-1">
                <h3 className={`text-sm font-bold uppercase tracking-widest ${step.active ? 'text-white' : 'text-white/20'}`}>{step.name}</h3>
                {step.active && <p className="text-primary text-[10px] mt-1 font-bold">CURRENT STATUS</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <section className="mb-10">
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">Destination</h3>
          <div className="p-6 rounded-[24px] bg-dark-1 border border-white/5 flex gap-4">
            <Icon name="location_on" style={{ color: 'var(--primary)', fontSize: '20px' }} />
            <div>
              <p className="text-white font-medium mb-1">{order.shippingAddress.fullName}</p>
              <p className="text-white/40 text-sm leading-relaxed">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}<br/>
                {order.shippingAddress.state}, {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        </section>

        {/* Digital Twin Certificate */}
        <section className="mb-12">
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">Digital Proof</h3>
          <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white p-2 rounded-2xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Icon name="qr_code_2" style={{ color: '#fff', fontSize: '40px' }} />
                </div>
              </div>
              <h4 className="text-white font-serif text-lg mb-2">Certificate of Authenticity</h4>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-6">Asset ID: {order._id.toUpperCase()}</p>
              
              <button className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 px-6 py-3 rounded-full">
                Download PDF
              </button>
            </div>
          </div>
        </section>

        {/* Action */}
        <button 
          onClick={() => { triggerHaptic('medium'); navigate('/contact'); }}
          className="w-full h-16 border border-white/10 rounded-[24px] text-white font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Icon name="headset_mic" /> Support Concierge
        </button>
      </main>
    </div>
  );
};

export default MobileOrderTrackingPage;
