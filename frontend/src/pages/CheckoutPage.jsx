import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddressForm from '../components/account/AddressForm';
import { PageLoader } from '../components/common/PageState';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';
import { formatCurrency } from '../lib/formatters';
import { authAPI, orderAPI, paymentAPI } from '../services/api';

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

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [manualAddress, setManualAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    authAPI.getAddresses()
      .then((response) => {
        const list = response.data || [];
        setAddresses(list);
        const defaultAddress = list.find((address) => address.isDefault) || list[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else {
          setUseManualAddress(true);
        }
      })
      .catch(() => setUseManualAddress(true))
      .finally(() => setLoading(false));
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address._id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const resolveAddress = () => {
    return useManualAddress ? manualAddress : selectedAddress;
  };

  const verifyPaymentAndFinish = async (response, orderId) => {
    await paymentAPI.verify(response);
    await clearCart();
    toast.success('Payment verified and order confirmed');
    navigate(`/orders/${orderId}`);
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const address = resolveAddress();
    if (!address?.fullName || !address?.addressLine1 || !address?.city || !address?.state || !address?.pincode || !address?.phone) {
      toast.error('Provide a complete shipping address');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderResponse = await orderAPI.createOrder({
        shippingAddress: address,
        billingAddress: address,
        paymentMethod,
      });

      const order = orderResponse.data;
      trackEvent('order_create', { orderId: order._id, paymentMethod, total: order.totalAmount });

      if (saveAddress && useManualAddress) {
        authAPI.addAddress(address).catch(() => {});
      }

      if (paymentMethod === 'razorpay') {
        const paymentResponse = await paymentAPI.initiate({ orderId: order._id });
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded || !paymentResponse.data?.key_id || !window.Razorpay) {
          toast('Order placed. Complete payment once Razorpay is available from your account.');
          await clearCart();
          navigate(`/orders/${order._id}`);
          return;
        }

        const razorpay = new window.Razorpay({
          key: paymentResponse.data.key_id,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          order_id: paymentResponse.data.orderId,
          name: 'LuxeCart',
          description: `Order ${order.orderNumber}`,
          handler: async (response) => {
            try {
              await verifyPaymentAndFinish(response, order._id);
            } catch (verificationError) {
              toast.error(verificationError.response?.data?.error || 'Payment verification failed');
              navigate(`/orders/${order._id}`);
            }
          },
          modal: {
            ondismiss: async () => {
              await clearCart();
              navigate(`/orders/${order._id}`);
            },
          },
          prefill: {
            name: address.fullName,
            email: '',
            contact: address.phone,
          },
          theme: {
            color: '#6366f1',
          },
        });

        razorpay.open();
        await clearCart();
      } else {
        await clearCart();
        toast.success('Order placed');
        navigate(`/orders/${order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <PageLoader title="Preparing checkout" message="Loading saved addresses and payment options." />;
  }

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page checkout checkout-page">
      <div className="page-hero compact">
        <span className="page-state-badge">Checkout</span>
        <h1>Confirm delivery and payment</h1>
        <p>Use a saved address or enter a new one, then choose a payment path that matches the order.</p>
      </div>

      <div className="checkout-layout">
        <section className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Shipping</p>
              <h2>Delivery address</h2>
            </div>
          </div>

          {addresses.length > 0 && (
            <div className="stack-list">
              {addresses.map((address) => (
                <label key={address._id} className={`address-select-card ${selectedAddressId === address._id && !useManualAddress ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="address-selection"
                    checked={selectedAddressId === address._id && !useManualAddress}
                    onChange={() => {
                      setSelectedAddressId(address._id);
                      setUseManualAddress(false);
                    }}
                  />
                  <div>
                    <strong>{address.fullName}</strong>
                    <p>{address.addressLine1}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <label className="checkbox-row">
            <input type="checkbox" checked={useManualAddress} onChange={(event) => setUseManualAddress(event.target.checked)} />
            Enter a new address for this order
          </label>

          {useManualAddress && (
            <>
              <AddressForm
                initialValues={manualAddress}
                onChange={setManualAddress}
                onSubmit={(values) => setManualAddress(values)}
                submitLabel="Use this address"
                showActions={false}
              />
              <label className="checkbox-row">
                <input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} />
                Save this address to my profile
              </label>
            </>
          )}
        </section>

        <aside className="surface-card checkout-summary">
          <h2>Order summary</h2>
          {cart.items.map((item) => (
            <div key={item._id} className="summary-row">
              <span>{item.name} x {item.quantity}</span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-breakdown">
            <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(cart.totalAmount)}</strong></div>
            <div className="summary-row"><span>Discount</span><strong>-{formatCurrency(cart.discountAmount)}</strong></div>
            <div className="summary-row"><span>Tax</span><strong>{formatCurrency(cart.taxAmount)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>{formatCurrency(cart.shippingAmount)}</strong></div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatCurrency(cart.grandTotal)}</strong>
          </div>

          <div className="payment-methods">
            <label>
              <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on delivery
            </label>
            <label>
              <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
              Razorpay
            </label>
          </div>

          <button type="button" onClick={handlePlaceOrder} className="btn-primary checkout-submit" disabled={placingOrder}>
            {placingOrder ? 'Placing order...' : `Place order for ${formatCurrency(cart.grandTotal)}`}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
