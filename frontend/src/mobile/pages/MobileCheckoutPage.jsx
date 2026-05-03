import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon, triggerHaptic } from '../components/MobileUI';
import { useCart } from '../../context/CartContext';
import { authAPI, orderAPI, paymentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MobileCheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await authAPI.getAddresses();
        setAddresses(res.data);
        const def = res.data.find(a => a.isDefault) || res.data[0];
        if (def) setSelectedAddressId(def._id);
      } catch (err) {
        console.error('Failed to load addresses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handlePlaceOrder = async () => {
    const address = addresses.find(a => a._id === selectedAddressId);
    if (!address) {
      toast.error('Please select a shipping address');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderRes = await orderAPI.createOrder({
        shippingAddress: address,
        billingAddress: address,
        paymentMethod
      });

      const order = orderRes.data;

      if (paymentMethod === 'razorpay') {
        const payRes = await paymentAPI.initiate({ orderId: order._id });
        const loaded = await loadRazorpayScript();
        
        if (!loaded) {
          toast.error('Payment gateway failed to load');
          return;
        }

        const options = {
          key: payRes.data.key_id,
          amount: payRes.data.amount,
          currency: payRes.data.currency,
          order_id: payRes.data.orderId,
          name: 'Caryqel',
          description: `Order #${order.orderNumber}`,
          handler: async (response) => {
            await paymentAPI.verify(response);
            await clearCart();
            toast.success('Order confirmed');
            navigate(`/orders/${order._id}`);
          },
          prefill: {
            name: address.fullName,
            contact: address.phone
          },
          theme: { color: '#a855f7' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await clearCart();
        toast.success('Order placed successfully');
        navigate(`/orders/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order failed');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="mobile-page flex items-center justify-center py-20 text-white/20 bg-[#080808]">Preparing ritual...</div>;

  return (
    <div className="mobile-page pb-32 bg-[#080808]">
      <TopAppBar title="Secure Checkout" showBack={true} />
      
      <main className="mobile-content px-6 pt-8">
        {/* Progress */}
        <div className="flex gap-4 mb-10">
          <div className="flex-1 h-1 rounded-full bg-primary"></div>
          <div className="flex-1 h-1 rounded-full bg-primary"></div>
          <div className="flex-1 h-1 rounded-full bg-white/10"></div>
        </div>

        {/* Address Selection */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title-serif" style={{ fontSize: '22px', marginBottom: 0 }}>Shipping</h2>
            <button onClick={() => navigate('/profile/addresses')} className="text-primary text-[10px] font-bold uppercase tracking-widest">Manage</button>
          </div>
          
          <div className="space-y-4">
            {addresses.map(addr => (
              <div 
                key={addr._id} 
                onClick={() => setSelectedAddressId(addr._id)}
                className={`p-6 rounded-[24px] border transition-all duration-300 ${selectedAddressId === addr._id ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#111]'}`}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{addr.type || 'Home'}</span>
                  {selectedAddressId === addr._id && <Icon name="check_circle" style={{ color: 'var(--primary)', fontSize: '20px' }} />}
                </div>
                <p className="text-white/40 text-sm">{addr.street}, {addr.city}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Order Review (Mini) */}
        <section className="mb-12">
          <h2 className="section-title-serif" style={{ fontSize: '22px', marginBottom: '24px' }}>Review Order</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {cart.items.map((item) => (
              <div key={item.product._id} className="min-w-[100px]">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#111] mb-2">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest truncate">{item.product.name}</p>
                <p className="text-white text-[10px] font-bold">Qty: {item.quantity}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-12">
          <h2 className="section-title-serif" style={{ fontSize: '22px', marginBottom: '24px' }}>Payment</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { triggerHaptic('light'); setPaymentMethod('cod'); }}
              className={`p-6 rounded-[24px] border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#111]'}`}
            >
              <Icon name="payments" style={{ color: paymentMethod === 'cod' ? '#fff' : 'rgba(255,255,255,0.2)' }} />
              <span className={`text-[11px] font-bold uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-white' : 'text-white/20'}`}>COD</span>
            </button>
            <button 
              onClick={() => { triggerHaptic('light'); setPaymentMethod('razorpay'); }}
              className={`p-6 rounded-[24px] border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : 'border-white/5 bg-[#111]'}`}
            >
              <Icon name="credit_card" style={{ color: paymentMethod === 'razorpay' ? '#fff' : 'rgba(255,255,255,0.2)' }} />
              <span className={`text-[11px] font-bold uppercase tracking-widest ${paymentMethod === 'razorpay' ? 'text-white' : 'text-white/20'}`}>Razorpay</span>
            </button>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 mb-12 opacity-30">
          <Icon name="lock" style={{ fontSize: '14px' }} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Secure Encrypted Transaction</span>
        </div>

        {/* Total Summary */}
        <section className="p-8 rounded-[32px] bg-[#111] border border-white/5 mb-10">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Amount</span>
              <span className="text-white">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-sm">Shipping</span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Free</span>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-white text-2xl font-serif">Total</span>
            <span className="text-white text-2xl font-serif">₹{cartTotal.toLocaleString()}</span>
          </div>
        </section>

        <button 
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full h-16 bg-white text-black rounded-[24px] font-bold uppercase tracking-widest text-[13px] shadow-2xl flex items-center justify-center gap-3"
        >
          {placingOrder ? 'Processing...' : 'Place Order'}
        </button>
      </main>
    </div>
  );
};

export default MobileCheckoutPage;
