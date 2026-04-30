import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI, wishlistAPI, productAPI, searchAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiUser, FiHome, FiShoppingBag } from 'react-icons/fi';
import Magnet from './Magnet';
import TextType from './TextType';
import RippleGrid from './RippleGrid';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="product-image-container">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'} 
          alt={product.name} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'; }}
        />
      </div>
      <div className="product-details">
        <p className="brand">{product.brand}</p>
        <h3>{product.name}</h3>
        <div className="price">
          <span className="current">₹{product.price.toLocaleString()}</span>
        </div>
        <button onClick={handleAddToCart} className="add-btn">Add to Cart</button>
      </div>
    </motion.div>
  );
};

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProducts({ page, limit: 12, category });
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.pages);
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category]);

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;

  return (
    <div className="page products">
      <div className="section-header">
        <h1>All Products</h1>
        <div className="line"></div>
      </div>
      <div className="product-grid">
        {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      productAPI.getProduct(slug)
        .then(res => setProduct(res.data))
        .catch(() => toast.error('Product not found'))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;
  if (!product) return <div className="page"><h1>Product not found</h1></div>;

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="page product-detail">
      <div className="product-image">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'} 
          alt={product.name} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'; }}
        />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="brand">{product.brand}</p>
        <p>{product.description}</p>
        <div className="price">
          <span className="current">₹{product.price}</span>
          {product.originalPrice && (
            <span className="original">₹{product.originalPrice}</span>
          )}
        </div>
        <p>Stock: {product.stock}</p>
        <button onClick={handleAddToCart} disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <div className="page auth">
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button className="link-btn" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have account? Login' : 'No account? Register'}
      </button>
    </div>
  );
};

export const Cart = () => {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async () => {
    try {
      await applyCoupon(coupon);
      toast.success('Coupon applied!');
    } catch {
      toast.error('Invalid coupon');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page empty-state">
        <div className="empty-icon">🛒</div>
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page cart">
      <h1>Your LuxeCart</h1>
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.product?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80'} alt={item.name} />
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">₹{item.price.toLocaleString()} × {item.quantity}</p>
            </div>
            <div className="quantity">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <p className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
            <button className="remove-btn" onClick={() => removeItem(item._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="coupon">
        <input
          type="text"
          placeholder="Coupon code"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Apply</button>
      </div>
      <div className="cart-summary">
        <p><span>Subtotal</span> <span>₹{cart.totalAmount.toLocaleString()}</span></p>
        <p><span>Discount</span> <span>-₹{cart.discountAmount.toLocaleString()}</span></p>
        <p><span>Tax</span> <span>₹{cart.taxAmount.toLocaleString()}</span></p>
        <p><span>Shipping</span> <span>₹{cart.shippingAmount.toLocaleString()}</span></p>
        <h3><span>Total</span> <span>₹{cart.grandTotal.toLocaleString()}</span></h3>
        <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      orderAPI.getOrders().then(res => setOrders(res.data.orders || res.data));
    }
  }, [user]);

  return (
    <div className="page orders">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <p>Order #{order.orderNumber}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            <Link to={`/orders/${order._id}`} className="btn-small">Track Order</Link>
          </div>
        ))
      )}
    </div>
  );
};

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      wishlistAPI.getWishlist().then(res => setWishlist(res.data)).catch(() => setWishlist(null));
    }
  }, [user]);

  const handleMoveToCart = async (productId) => {
    try {
      await wishlistAPI.moveToCart(productId);
      toast.success('Moved to cart!');
      window.location.reload();
    } catch {
      toast.error('Failed to move to cart');
    }
  };

  if (!wishlist) return <div className="page"><div className="loading">Loading...</div></div>;

  return (
    <div className="page wishlist">
      <h1>My Wishlist</h1>
      {wishlist.items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save items you love to your wishlist and they'll appear here.</p>
          <Link to="/products" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlist.items.map((item) => (
            <div key={item._id} className="wishlist-item">
              <h3>{item.product?.name || 'Product'}</h3>
              <p>₹{item.product?.price || 0}</p>
              <button onClick={() => item.product?._id && handleMoveToCart(item.product._id)}>Move to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchAPI.search({ q: query })
        .then(res => setProducts(res.data.products || []))
        .catch(() => toast.error('Search failed'))
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
    }
  }, [query]);

  return (
    <div className="page search">
      <div className="section-header">
        <h1>Search Results for "{query}"</h1>
        <div className="line"></div>
      </div>
      {loading ? <p>Searching...</p> : (
        products.length === 0 ? <p>No products found matching your search.</p> : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )
      )}
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>LuxeCart</h2>
          <p>Defining the standard of premium e-commerce.</p>
        </div>
        <div className="footer-social-middle">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram size={24} /></a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter size={24} /></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook size={24} /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="Linkedin"><FiLinkedin size={24} /></a>
        </div>
        <div className="footer-links">
          <div>
            <h3>Support</h3>
            <Link to="/orders">Order Tracking</Link>
            <p>support@luxecart.com</p>
            <p>1-800-LUXE-000</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 LuxeCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' });
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await orderAPI.createOrder({
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: 'razorpay'
      });
      toast.success('Order placed!');
      clearCart();
      navigate('/orders');
    } catch {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="page checkout">
      <h1>Checkout</h1>
      <form>
        <input type="text" placeholder="Full Name" onChange={e => setAddress({...address, fullName: e.target.value})} required />
        <input type="text" placeholder="Phone" onChange={e => setAddress({...address, phone: e.target.value})} required />
        <input type="text" placeholder="Address" onChange={e => setAddress({...address, addressLine1: e.target.value})} required />
        <input type="text" placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} required />
        <input type="text" placeholder="State" onChange={e => setAddress({...address, state: e.target.value})} required />
        <input type="text" placeholder="Pincode" onChange={e => setAddress({...address, pincode: e.target.value})} required />
      </form>
      <button onClick={handleCheckout}>Place Order (₹{cart?.grandTotal})</button>
    </div>
  );
};

export const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getCategories()
      .then(res => setCategoriesList(res.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;

  return (
    <div className="page categories">
      <section className="hero" style={{ backgroundColor: '#000000' }}>
        <div className="hero-bg">
          <RippleGrid gridColor="#00d4ff" rippleIntensity={0.02} gridSize={25} gridThickness={15} mouseInteraction={true} mouseInteractionRadius={1.2} opacity={0.5} fadeDistance={0.8} />
        </div>
        <div className="hero-content">
          <Magnet padding={150} disabled={false} magnetStrength={30}>
            <h1>Shop by Category</h1>
          </Magnet>
          <TextType
            text="Explore our curated collections"
            speed={80}
            cursor={true}
            waitBeforeStart={500}
          />
        </div>
      </section>
      <div className="category-grid">
        {categoriesList.map(cat => (
          <Link key={cat._id} to={`/products?category=${cat.slug}`} className="category-card">
            <div className="category-image">
              {cat.image ? <img src={cat.image} alt={cat.name} /> : <div className="placeholder-img"></div>}
            </div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const About = () => {
  return (
    <div className="page about">
      <section className="hero">
        <h1>About LuxeCart</h1>
        <p>Redefining Premium E-Commerce</p>
      </section>
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>LuxeCart was founded with a singular vision: to create a seamless shopping experience that combines luxury aesthetics with intuitive functionality. We believe that shopping should be an experience, not just a transaction.</p>
        </div>
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>To curate the finest products from around the world and deliver them to your doorstep with unparalleled service. We handpick every item in our collection to ensure quality and style.</p>
        </div>
        <div className="about-section">
          <h2>Why Choose Us</h2>
          <ul>
            <li>Premium quality guaranteed</li>
            <li>Free shipping on orders above ₹999</li>
            <li>30-day hassle-free returns</li>
            <li>Secure payments with Razorpay</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>
      <div className="stats-section">
        <div className="stat">
          <h3>50K+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat">
          <h3>10K+</h3>
          <p>Products</p>
        </div>
        <div className="stat">
          <h3>100+</h3>
          <p>Brands</p>
        </div>
        <div className="stat">
          <h3>4.9★</h3>
          <p>Rating</p>
        </div>
      </div>
    </div>
  );
};

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact">
      <section className="hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-item">
            <h3>Email</h3>
            <p>support@luxecart.com</p>
          </div>
          <div className="contact-item">
            <h3>Phone</h3>
            <p>1-800-LUXE-000</p>
          </div>
          <div className="contact-item">
            <h3>Hours</h3>
            <p>Mon-Fri: 9AM - 6PM</p>
          </div>
          <div className="contact-item">
            <h3>Address</h3>
            <p>123 Luxury Lane<br />Mumbai, Maharashtra 400001</p>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="success-message">
              <h3>Thank you!</h3>
              <p>Your message has been sent. We'll respond within 24 hours.</p>
              <button type="button" onClick={() => setSubmitted(false)}>Send Another</button>
            </div>
          ) : (
            <>
              <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
              <textarea placeholder="Your Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              <button type="submit">Send Message</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page empty-state">
        <div className="empty-icon">👤</div>
        <h1>Login Required</h1>
        <p>Please login to view and manage your profile details.</p>
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="page profile">
      <motion.div 
        className="profile-header-premium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="avatar-wrapper">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="user-info-main">
          <h1>{user.name}</h1>
          <p className="user-email">{user.email}</p>
          <div className="user-badges">
            <span className="badge-premium">{user.role === 'admin' ? 'Administrator' : 'Premium Member'}</span>
            {user.isVerified && <span className="badge-verified">Verified</span>}
          </div>
        </div>
      </motion.div>

      <div className="profile-dashboard-grid">
        <div className="profile-nav-sidebar">
          <button 
            className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} 
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag /> My Orders
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'addresses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('addresses')}
          >
            <FiHome /> Addresses
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            <FiUser /> Account Settings
          </button>
        </div>

        <motion.div 
          className="profile-tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'orders' && (
            <div className="tab-pane">
              <h2>Recent Orders</h2>
              <p className="tab-subtitle">Manage and track your recent purchases</p>
              <div className="pane-action-card">
                <p>View your complete order history and track deliveries.</p>
                <button onClick={() => navigate('/orders')} className="btn-primary">View Full History</button>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="tab-pane">
              <h2>Saved Addresses</h2>
              <p className="tab-subtitle">Manage your delivery and billing locations</p>
              <div className="empty-pane-message">
                <FiHome size={40} />
                <p>No saved addresses yet.</p>
                <button className="btn-secondary">Add New Address</button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-pane">
              <h2>Account Settings</h2>
              <p className="tab-subtitle">Manage your personal information and security</p>
              <div className="settings-grid">
                <div className="settings-item">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="settings-item">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
                <div className="settings-item">
                  <label>Account Type</label>
                  <p className="capitalize">{user.role}</p>
                </div>
              </div>
              <button className="btn-secondary" style={{ marginTop: '2rem' }}>Edit Profile</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  returned: 'Returned',
  refunded: 'Refunded',
};

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderAPI.getOrder(id)
        .then(res => setOrder(res.data))
        .catch(() => toast.error('Failed to load order'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;
  if (!order) return <div className="page"><h1>Order not found</h1></div>;

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  // eslint-disable-next-line no-unused-vars
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="page order-tracking">
      <h1>Order #{order.orderNumber}</h1>
      <div className="tracking-card">
        <div className="tracking-status">
          <h2>Status: {STATUS_LABELS[order.status] || order.status}</h2>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {!isCancelled && (
          <div className="tracking-timeline">
            {STATUS_ORDER.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div key={status} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-dot"></div>
                  <span>{STATUS_LABELS[status]}</span>
                </div>
              );
            })}
          </div>
        )}

        {isCancelled && (
          <div className="tracking-timeline cancelled">
            <div className="timeline-item cancelled">
              <div className="timeline-dot"></div>
              <span>Order Cancelled</span>
            </div>
          </div>
        )}

        <div className="order-items">
          <h3>Items</h3>
          {order.items.map(item => (
            <div key={item._id} className="tracking-item">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {order.shippingAddress && (
          <div className="shipping-address">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const res = await orderAPI.getAdminOrders();
        setOrders(res.data.orders || res.data);
      } else {
        const res = await productAPI.getAdminProducts();
        setProducts(res.data.products || res.data);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate, loadData]);

  const updateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status, note: `Status updated to ${STATUS_LABELS[status] || status}` });
      toast.success('Order status updated');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await productAPI.updateStock(productId, newStock);
      toast.success('Stock updated');
      loadData();
    } catch {
      toast.error('Failed to update stock');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="page"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="page admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : activeTab === 'orders' ? (
        <div className="admin-orders">
          {orders.length === 0 ? <p>No orders found</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>{STATUS_LABELS[order.status] || order.status}</span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        {Object.keys(STATUS_LABELS).map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="admin-products">
          {products.length === 0 ? <p>No products found</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateStock(product._id, parseInt(e.target.value) || 0)}
                        className="stock-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <span className={`status-badge ${product.status}`}>{product.status}</span>
                    </td>
                    <td>
                      <Link to={`/products/${product.slug}`} className="btn-small">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
