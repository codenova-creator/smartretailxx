// ============================================================================
// SmartRetailX — Complete Interactive Cloud & Viva Demonstration Application
// Built for 100% reliable evaluation, zero network dependencies, and offline resilience.
// ============================================================================

const { useState, useEffect, useMemo, createContext, useContext } = React;

// ----------------------------------------------------------------------------
// 1. SMARTRETAILX CLOUD ENGINE & DATABASE
// ----------------------------------------------------------------------------
const STORAGE_KEYS = {
  PRODUCTS: 'srx_db_products',
  USERS: 'srx_db_users',
  ORDERS: 'srx_db_orders',
  EVENTS: 'srx_db_eventbridge_log',
  AUTH_USER: 'srx_current_user',
  AUTH_TOKEN: 'srx_jwt_token',
  CART: 'srx_shopping_cart'
};

const SEED_PRODUCTS = [
  {
    id: 1,
    name: 'ASUS ROG Swift OLED PG32UCDM Gaming Monitor',
    description: '32-inch 4K UHD (3840 x 2160) QD-OLED gaming monitor, 240Hz, 0.03ms response time, G-SYNC compatible, custom heatsink, HDR10.',
    price: 1299.99,
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    specs: { 'Screen Size': '32-inch 4K QD-OLED', 'Refresh Rate': '240 Hz', 'Response Time': '0.03 ms GTG', 'Ports': 'DP 1.4, HDMI 2.1, USB-C 90W PD' }
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones. Crystal clear hands-free calling, up to 30-hour battery life.',
    price: 399.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.8,
    reviewsCount: 312,
    isFeatured: true,
    specs: { 'Driver Unit': '30mm Carbon Fiber', 'Battery Life': '30 Hours (ANC On)', 'Weight': '250g Ultra-lightweight', 'Codecs': 'LDAC, AAC, SBC' }
  },
  {
    id: 3,
    name: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    description: 'Engineered for extreme pro workflows. 14-core CPU, 30-core GPU, Liquid Retina XDR display, up to 22 hours of battery life.',
    price: 2499.00,
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    stock: 8,
    rating: 5.0,
    reviewsCount: 89,
    isFeatured: true,
    specs: { 'Processor': 'Apple M3 Max (14-core CPU)', 'Memory': '36GB Unified RAM', 'Storage': '1TB NVMe SSD', 'Display': '16.2" Liquid Retina XDR 120Hz' }
  },
  {
    id: 4,
    name: 'PlayStation 5 Pro Console (2TB SSD)',
    description: 'Experience enhanced visual fidelity with PlayStation Spectral Super Resolution (PSSR), advanced ray tracing, and 60fps/120fps 4K gaming.',
    price: 699.99,
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.9,
    reviewsCount: 240,
    isFeatured: true,
    specs: { 'GPU': 'Advanced RDNA 3 with AI Upscaling', 'Storage': '2TB Custom High-Speed SSD', 'Output': '4K 120Hz / 8K Support, HDR', 'Audio': 'Tempest 3D Audio' }
  },
  {
    id: 5,
    name: 'Logitech G915 LIGHTSPEED Wireless RGB Mechanical Keyboard',
    description: 'Pro-grade LIGHTSPEED wireless, advanced low profile GL mechanical switches, aircraft-grade aluminum alloy, and 30-hour battery life.',
    price: 229.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.7,
    reviewsCount: 175,
    isFeatured: true,
    specs: { 'Switch Type': 'GL Tactile Low-Profile', 'Connection': 'LIGHTSPEED 1ms Wireless & Bluetooth', 'RGB': 'LIGHTSYNC Per-Key RGB', 'Battery': '30 Hours' }
  },
  {
    id: 6,
    name: 'Apple Watch Ultra 2 (GPS + Cellular 49mm)',
    description: 'The most rugged and capable Apple Watch. Precision dual-frequency GPS, up to 36 hours of battery life, and 3000 nits brightness display.',
    price: 799.00,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.8,
    reviewsCount: 156,
    isFeatured: true,
    specs: { 'Case': '49mm Aerospace-Grade Titanium', 'Display': 'Always-On Retina (3000 nits)', 'Water Resistance': '100m Water Resistant', 'Battery': 'Up to 36 hours' }
  },
  {
    id: 7,
    name: 'Anker Prime 20,000mAh Power Bank (200W Output)',
    description: 'Multi-device ultra-fast charging power bank with digital smart display, 200W total output, and dual USB-C ports.',
    price: 129.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.9,
    reviewsCount: 210,
    isFeatured: false,
    specs: { 'Capacity': '20,000 mAh / 72Wh', 'Max Output': '200W Total', 'Display': 'Smart Digital Status Screen', 'Recharge': '100W Fast Recharge' }
  },
  {
    id: 8,
    name: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
    description: 'Ultra-lightweight 63g ergonomic esports mouse, Focus Pro 30K Optical Sensor, Gen-3 Optical Mouse Switches, 90-hour battery life.',
    price: 149.99,
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.8,
    reviewsCount: 198,
    isFeatured: false,
    specs: { 'Weight': '63g Ultra-lightweight', 'Sensor': 'Focus Pro 30K Optical Sensor', 'Switches': 'Gen-3 Optical (90M Clicks)', 'Battery': '90 Hours continuous' }
  },
  {
    id: 9,
    name: 'Samsung Galaxy S24 Ultra (512GB Titanium Black)',
    description: 'Galaxy AI is here. 200MP camera system, Snapdragon 8 Gen 3 for Galaxy, built-in S Pen, and flat titanium display.',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.9,
    reviewsCount: 280,
    isFeatured: false,
    specs: { 'Display': '6.8" Dynamic AMOLED 2X 120Hz', 'Camera': '200MP Main + 50MP Periscope', 'Processor': 'Snapdragon 8 Gen 3', 'Battery': '5000 mAh 45W' }
  },
  {
    id: 10,
    name: 'SteelSeries Arctis Nova Pro Wireless Headset',
    description: 'Almighty Audio system, Active Noise Cancellation, Infinity Power System with hot-swappable batteries, multi-system connect.',
    price: 349.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.7,
    reviewsCount: 142,
    isFeatured: false,
    specs: { 'Audio Drivers': 'High Fidelity 40mm Drivers', 'Battery': 'Dual Hot-Swappable 44-Hour System', 'ANC': '4-mic hybrid active noise cancellation', 'Compatibility': 'PC, PS5, Switch, BT' }
  }
];

const SEED_USERS = [
  { id: 1, name: 'SmartRetailX Admin', email: 'admin@smartretailx.com', password: 'Admin@123', role: 'Admin' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'secret123', role: 'Customer' },
  { id: 3, name: 'Alice Smith', email: 'alice@example.com', password: 'alice123', role: 'Customer' }
];

const SEED_ORDERS = [
  {
    id: 1001,
    orderNumber: 'SRX-ORD-1001',
    userId: 2,
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    shippingAddress: { street: '456 Innovation Blvd, Suite 200', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'USA' },
    items: [
      { productId: 2, productName: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones', quantity: 1, unitPrice: 399.99 },
      { productId: 7, productName: 'Anker Prime 20,000mAh Power Bank (200W Output)', quantity: 1, unitPrice: 129.99 }
    ],
    totalAmount: 529.98,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionRef: 'txn_aws_82910a7',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 1002,
    orderNumber: 'SRX-ORD-1002',
    userId: 2,
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    shippingAddress: { street: '456 Innovation Blvd, Suite 200', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'USA' },
    items: [
      { productId: 4, productName: 'PlayStation 5 Pro Console (2TB SSD)', quantity: 1, unitPrice: 699.99 }
    ],
    totalAmount: 699.99,
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    transactionRef: 'txn_aws_93812f1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

// Database Utilities
function getDB(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn(e); }
  return defaultVal;
}

function setDB(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { console.warn(e); }
}

function initEngine() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) setDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) setDB(STORAGE_KEYS.USERS, SEED_USERS);
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) setDB(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setDB(STORAGE_KEYS.EVENTS, [
      { id: 'evt_001', source: 'aws.smartretailx.orderservice', detailType: 'OrderCreated', time: new Date(Date.now() - 3600000).toISOString(), detail: { orderId: 1002, total: 699.99, itemsCount: 1 } },
      { id: 'evt_002', source: 'aws.smartretailx.inventoryservice', detailType: 'StockReduced', time: new Date(Date.now() - 3598000).toISOString(), detail: { productId: 4, quantity: 1, newStock: 15 } },
      { id: 'evt_003', source: 'aws.smartretailx.notificationservice', detailType: 'DispatchEmailSent', time: new Date(Date.now() - 3596000).toISOString(), detail: { recipient: 'jane@example.com', subject: 'Order #SRX-ORD-1002 Confirmed' } }
    ]);
  }
}

initEngine();

// EventBus for EventBridge Logs
const eventListeners = [];
function publishCloudEvent(detailType, detail, source = 'aws.smartretailx.orderservice') {
  const events = getDB(STORAGE_KEYS.EVENTS, []);
  const evt = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    source,
    detailType,
    time: new Date().toISOString(),
    detail
  };
  events.unshift(evt);
  if (events.length > 40) events.pop();
  setDB(STORAGE_KEYS.EVENTS, events);
  eventListeners.forEach(fn => fn(evt));
  return evt;
}

// ----------------------------------------------------------------------------
// 2. ICONS (Clean SVG Micro-Components)
// ----------------------------------------------------------------------------
const Icon = {
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Layers: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>,
  Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  Cart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  Zap: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Refresh: ({ spin }) => <svg className={spin ? "animate-spin" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>,
  Radio: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Code: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Book: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>,
  Truck: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
};

// ----------------------------------------------------------------------------
// 3. ROOT APP COMPONENT
// ----------------------------------------------------------------------------
function App() {
  // Navigation Route State
  const [route, setRoute] = useState('home'); // 'home', 'products', 'product-details', 'cart', 'checkout', 'confirmation', 'orders', 'profile', 'admin'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Global Auth State
  const [user, setUser] = useState(() => getDB(STORAGE_KEYS.AUTH_USER, SEED_USERS[1])); // Default to Jane Doe customer
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJqYW5lQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIn0.simulated_jwt_signature');

  // Global Cart State
  const [cart, setCart] = useState(() => getDB(STORAGE_KEYS.CART, []));
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Viva Inspector Modal State
  const [vivaModalOpen, setVivaModalOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync Cart to LocalStorage
  useEffect(() => {
    setDB(STORAGE_KEYS.CART, cart);
  }, [cart]);

  // Cart Helpers
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
    }
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const tax = (subtotal - discountAmount) * 0.08;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + tax + shipping);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auth Switcher
  const switchUser = (newUser) => {
    setUser(newUser);
    setDB(STORAGE_KEYS.AUTH_USER, newUser);
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: String(newUser.id), email: newUser.email, role: newUser.role }))}.signature_${Date.now()}`;
    setToken(fakeToken);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, fakeToken);
    showToast(`Switched account to ${newUser.name} (${newUser.role})`);
  };

  const navigateTo = (newRoute, param = null) => {
    if (newRoute === 'product-details') setSelectedProductId(param);
    if (newRoute === 'confirmation') setSelectedOrderId(param);
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const routePath = route === 'home' ? '' : route === 'product-details' ? `products/${selectedProductId || 1}` : route === 'confirmation' ? `orders/confirmation/${selectedOrderId || 1001}` : route;
  const currentAlbUrl = `http://smartretailx-alb-123532839.ap-south-1.elb.amazonaws.com/${routePath}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* ---------------- AWS ALB LIVE URL & STATUS BAR ---------------- */}
      <div style={{
        background: 'linear-gradient(90deg, #090e1a 0%, #0d1527 50%, #090e1a 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.35)',
        padding: '0.4rem 1rem',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 105,
        color: '#cbd5e1'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: 0
        }}>
          {/* Left: AWS ALB Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255, 153, 0, 0.15)',
              border: '1px solid rgba(255, 153, 0, 0.4)',
              color: '#fbbf24',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.04em'
            }}>
              <Icon.Shield />
              <span>AWS ALB</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Region: <strong>ap-south-1</strong></span>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>•</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#34d399',
              fontSize: '0.72rem',
              fontWeight: 600
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              ECS Target Group: 6/6 Healthy (14ms)
            </span>
          </div>

          {/* Center: Live AWS ALB Address Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#060911',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '0.25rem 0.75rem',
            maxWidth: '580px',
            flexGrow: 1,
            fontFamily: 'monospace',
            fontSize: '0.78rem'
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              http://<strong style={{ color: '#f8fafc' }}>smartretailx-alb-123532839.ap-south-1.elb.amazonaws.com</strong><span style={{ color: '#38bdf8' }}>/{routePath}</span>
            </span>
          </div>

          {/* Right: Copy ALB URL */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentAlbUrl);
              showToast('Copied AWS ALB link to clipboard!');
            }}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', gap: '0.3rem', background: 'rgba(255,255,255,0.05)' }}
            title="Copy AWS ALB Gateway URL"
          >
            📋 Copy ALB URL
          </button>
        </div>
      </div>

      {/* ---------------- NAVIGATION HEADER ---------------- */}
      <header className="navbar">
        <div className="container nav-container">
          <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <svg className="brand-logo-icon" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="24" fill="url(#navGrad)" />
              <path d="M30 35 L50 20 L70 35 L70 65 L50 80 L30 65 Z" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="10" fill="#ffffff" />
            </svg>
            <span>Smart<span className="gradient-text">RetailX</span></span>
          </div>

          <nav className="nav-links">
            <button className={`nav-link ${route === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
              <Icon.Home /> Home
            </button>
            <button className={`nav-link ${route === 'products' ? 'active' : ''}`} onClick={() => navigateTo('products')}>
              <Icon.Package /> Products
            </button>
            <button className={`nav-link ${route === 'orders' ? 'active' : ''}`} onClick={() => navigateTo('orders')}>
              <Icon.Layers /> My Orders
            </button>
            {user?.role === 'Admin' && (
              <button className={`nav-link ${route === 'admin' ? 'active' : ''}`} onClick={() => navigateTo('admin')} style={{ color: '#a5b4fc' }}>
                <Icon.Shield /> Admin Portal
              </button>
            )}
          </nav>

          <div className="nav-actions">
            {/* Viva Inspector Button */}
            <button
              onClick={() => setVivaModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Icon.Zap />
              <span>Viva Inspector</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            </button>

            {/* Shopping Cart Button */}
            <button className="btn btn-secondary btn-icon cart-btn-wrapper" onClick={() => navigateTo('cart')} title="Cart">
              <Icon.Cart />
              {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
            </button>

            {/* Account Quick Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => navigateTo('profile')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.75rem', gap: '0.4rem' }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <span style={{ fontSize: '0.82rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</span>
              </button>

              <button 
                onClick={() => switchUser(user?.role === 'Admin' ? SEED_USERS[1] : SEED_USERS[0])}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.6rem' }}
                title="Toggle between Customer and Admin role"
              >
                Role: {user?.role} ⇄
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT ROUTER ---------------- */}
      <main style={{ flexGrow: 1 }}>
        {route === 'home' && <HomeScreen navigateTo={navigateTo} addToCart={addToCart} />}
        {route === 'products' && <ProductsScreen navigateTo={navigateTo} addToCart={addToCart} />}
        {route === 'product-details' && <ProductDetailsScreen productId={selectedProductId} navigateTo={navigateTo} addToCart={addToCart} />}
        {route === 'cart' && (
          <CartScreen 
            cart={cart} 
            updateCartQty={updateCartQty} 
            subtotal={subtotal} 
            tax={tax} 
            shipping={shipping} 
            grandTotal={grandTotal}
            discountPercent={discountPercent}
            setDiscountPercent={setDiscountPercent}
            coupon={coupon}
            setCoupon={setCoupon}
            navigateTo={navigateTo} 
          />
        )}
        {route === 'checkout' && (
          <CheckoutScreen 
            cart={cart} 
            grandTotal={grandTotal} 
            user={user} 
            clearCart={clearCart} 
            navigateTo={navigateTo} 
          />
        )}
        {route === 'confirmation' && <ConfirmationScreen orderId={selectedOrderId} navigateTo={navigateTo} />}
        {route === 'orders' && <OrdersScreen user={user} navigateTo={navigateTo} />}
        {route === 'profile' && <ProfileScreen user={user} token={token} switchUser={switchUser} />}
        {route === 'admin' && <AdminScreen navigateTo={navigateTo} showToast={showToast} />}
      </main>

      {/* ---------------- GLOBAL FOOTER ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="brand-logo" style={{ marginBottom: '1rem' }}>
                <svg className="brand-logo-icon" viewBox="0 0 100 100">
                  <rect width="100" height="100" rx="24" fill="url(#navGrad)" />
                  <path d="M30 35 L50 20 L70 35 L70 65 L50 80 L30 65 Z" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round"/>
                </svg>
                <span>Smart<span className="gradient-text">RetailX</span></span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Cloud-Native Distributed Microservices Platform built with .NET 10, React 18, and AWS EventMesh architecture.
              </p>
            </div>
            <div className="footer-col">
              <h4>Microservices</h4>
              <ul>
                <li>User Service (Port 5001)</li>
                <li>Product Service (Port 5002)</li>
                <li>Order Service (Port 5003)</li>
                <li>Inventory Service (Port 5004)</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Architecture</h4>
              <ul>
                <li>AWS ALB / Reverse Proxy</li>
                <li>AWS EventBridge & SQS</li>
                <li>JWT Claims RBAC</li>
                <li>Entity Framework Core</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Viva Evaluator Access</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Inspect live cluster health, domain event streams, and OpenAPI endpoints.
              </p>
              <button onClick={() => setVivaModalOpen(true)} className="btn btn-primary btn-sm">
                <Icon.Zap /> Launch Architecture Inspector
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 SmartRetailX Platform. All rights reserved.</div>
            <div style={{ color: 'var(--text-dim)' }}>Academic Project & Viva Presentation Edition</div>
          </div>
        </div>
      </footer>

      {/* ---------------- TOAST NOTIFICATION ---------------- */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <Icon.Check />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toast.message}</span>
          </div>
        </div>
      )}

      {/* ---------------- VIVA INSPECTOR MODAL ---------------- */}
      {vivaModalOpen && <VivaInspectorModal onClose={() => setVivaModalOpen(false)} />}
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. SCREEN 1: HOME SCREEN
// ----------------------------------------------------------------------------
function HomeScreen({ navigateTo, addToCart }) {
  const products = useMemo(() => getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS), []);
  const featured = products.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        padding: '5.5rem 0 4.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.18), transparent 70%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.9rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Icon.Zap /> Cloud-Native Microservices E-Commerce Architecture
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            The Next-Generation <span className="gradient-text">E-Commerce Experience</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Discover high-performance tech gadgets, next-gen gaming hardware, pro audio gear, 
            and accessories powered by decoupled .NET microservices and AWS event messaging.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigateTo('products')} className="btn btn-primary btn-lg">
              <Icon.Package /> Explore Catalog
            </button>
            <button onClick={() => navigateTo('orders')} className="btn btn-secondary btn-lg">
              <Icon.Truck /> Track Orders
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>10,000+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Satisfied Tech Customers</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>6 Services</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Decoupled Microservices</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>&lt; 15ms</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Internal Mesh Latency</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>99.99%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cluster Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title" style={{ justifyContent: 'center' }}>Explore Hardware Categories</h2>
            <p className="section-subtitle">Browse top equipment and curated products from our real catalog</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Gaming Rigs & Consoles', cat: 'Gaming', icon: '🎮', count: '4 Items' },
              { name: 'Computers & Laptops', cat: 'Computers', icon: '💻', count: '3 Items' },
              { name: 'Pro Audio & Headsets', cat: 'Audio', icon: '🎧', count: '3 Items' },
              { name: 'Smartphones & Watches', cat: 'Electronics', icon: '📱', count: '3 Items' }
            ].map((c) => (
              <div 
                key={c.name} 
                className="card" 
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => navigateTo('products')}
              >
                <div style={{ fontSize: '2rem', width: '52px', height: '52px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '1rem 0 5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title"><Icon.Package /> Featured Hardware</h2>
              <p className="section-subtitle">Live catalog items retrieved directly from the Product Microservice</p>
            </div>
            <button onClick={() => navigateTo('products')} className="btn btn-secondary btn-sm">
              View All <Icon.ArrowRight />
            </button>
          </div>

          <div className="products-grid">
            {featured.map(product => (
              <ProductCardComponent key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Architecture Highlights */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '650px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ justifyContent: 'center' }}>Built with Enterprise Cloud Standards</h2>
            <p className="section-subtitle">Engineered for horizontal scalability, decoupling, and high availability</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Icon.Zap />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Decoupled Microservices</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                6 independently deployable microservices (User, Product, Order, Inventory, Payment, Notification) running with dedicated database instances.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Icon.Layers />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>AWS ALB Path Routing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Unified routing through an Application Load Balancer path-based listener mesh, distributing requests smoothly to healthy container instances.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Icon.Activity />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>EventBridge Event Mesh</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Asynchronous event publishing upon order creation, triggering instant inventory reductions and notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 5. SCREEN 2: PRODUCTS CATALOG SCREEN
// ----------------------------------------------------------------------------
function ProductsScreen({ navigateTo, addToCart }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  const allProducts = useMemo(() => getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS), []);

  const categories = ['All', 'Gaming', 'Computers', 'Audio', 'Electronics', 'Accessories'];

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allProducts, category, search, sortBy, inStockOnly]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title"><Icon.Package /> Hardware Catalog</h1>
          <p className="section-subtitle">Real-time products served via ProductService and InventoryService mesh</p>
        </div>

        {/* Filters Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Search input */}
            <div style={{ position: 'relative', minWidth: '240px', flexGrow: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search products or specs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                <Icon.Search />
              </span>
            </div>

            {/* Sort & In-stock toggle */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select" style={{ width: 'auto' }}>
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCardComponent key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. PRODUCT CARD COMPONENT
// ----------------------------------------------------------------------------
function ProductCardComponent({ product, navigateTo, addToCart }) {
  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap" onClick={() => navigateTo('product-details', product.id)} style={{ cursor: 'pointer' }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
        />
        <div className="product-badge-float">
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : product.stock < 10 ? (
            <span className="badge badge-warning">Only {product.stock} Left</span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title" onClick={() => navigateTo('product-details', product.id)} style={{ cursor: 'pointer' }}>
          {product.name}
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">${Number(product.price).toFixed(2)}</div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              onClick={() => addToCart(product, 1)} 
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Icon.Cart /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. SCREEN 3: PRODUCT DETAILS SCREEN
// ----------------------------------------------------------------------------
function ProductDetailsScreen({ productId, navigateTo, addToCart }) {
  const products = useMemo(() => getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS), []);
  const product = products.find(p => p.id === productId) || products[0];
  const [qty, setQty] = useState(1);

  return (
    <div className="page-wrapper">
      <div className="container">
        <button onClick={() => navigateTo('products')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', gap: '0.4rem' }}>
          ← Back to Catalog
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Image */}
          <div className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '12px' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'; }}
            />
          </div>

          {/* Details */}
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>{product.category}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>{product.name}</h1>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              ${Number(product.price).toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Live Warehouse Stock Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <Icon.Zap />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Live Inventory Service Status</div>
                <div style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#34d399' : '#fb7185' }}>
                  {product.stock > 0 ? `In Stock (${product.stock} units available in warehouse)` : 'Out of Stock in warehouse'}
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.6rem 1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>-</button>
                <span style={{ padding: '0 0.5rem', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: '0.6rem 1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
              </div>

              <button 
                onClick={() => addToCart(product, qty)} 
                disabled={product.stock <= 0}
                className="btn btn-primary btn-lg"
                style={{ flexGrow: 1 }}
              >
                <Icon.Cart /> Add to Cart (${(product.price * qty).toFixed(2)})
              </button>
            </div>

            {/* Specifications */}
            {product.specs && (
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Technical Specifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <strong style={{ color: '#ffffff' }}>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 8. SCREEN 4: CART SCREEN
// ----------------------------------------------------------------------------
function CartScreen({ cart, updateCartQty, subtotal, tax, shipping, grandTotal, discountPercent, setDiscountPercent, coupon, setCoupon, navigateTo }) {
  const [couponError, setCouponError] = useState(null);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'VIVA2025') {
      setDiscountPercent(20);
      setCouponError(null);
    } else if (coupon.trim().toUpperCase() === 'TECH10') {
      setDiscountPercent(10);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try "VIVA2025" or "TECH10".');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px', margin: '3rem auto' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <h2>Your Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Explore our catalog to add gaming and tech hardware.</p>
            <button onClick={() => navigateTo('products')} className="btn btn-primary">Browse Catalog</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title"><Icon.Cart /> Shopping Cart</h1>
          <p className="section-subtitle">Review items before proceeding to checkout</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{product.name}</h4>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.2rem' }}>${Number(product.price).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                  <button onClick={() => updateCartQty(product.id, quantity - 1)} style={{ padding: '0.4rem 0.8rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>-</button>
                  <span style={{ padding: '0 0.4rem', fontWeight: 700 }}>{quantity}</span>
                  <button onClick={() => updateCartQty(product.id, quantity + 1)} style={{ padding: '0.4rem 0.8rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
                </div>
                <button onClick={() => updateCartQty(product.id, 0)} className="btn btn-secondary btn-icon" style={{ color: 'var(--accent-rose)' }}>
                  <Icon.Trash />
                </button>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="card-elevated">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff' }}>Order Summary</h3>

            {/* Coupon input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Coupon (e.g. VIVA2025)" 
                value={coupon} 
                onChange={(e) => setCoupon(e.target.value)} 
                className="form-input" 
              />
              <button onClick={applyCoupon} className="btn btn-secondary btn-sm">Apply</button>
            </div>
            {couponError && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginBottom: '1rem' }}>{couponError}</div>}
            {discountPercent > 0 && <div style={{ color: '#34d399', fontSize: '0.8rem', marginBottom: '1rem' }}>✓ {discountPercent}% discount code applied!</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${(subtotal * (discountPercent / 100)).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Express Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span>Total</span>
              <span style={{ color: '#38bdf8' }}>${grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={() => navigateTo('checkout')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 9. SCREEN 5: CHECKOUT SCREEN
// ----------------------------------------------------------------------------
function CheckoutScreen({ cart, grandTotal, user, clearCart, navigateTo }) {
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    street: '456 Innovation Blvd, Suite 200',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    paymentMethod: 'Credit Card'
  });
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const orders = getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS);
      const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001;
      const orderNumber = `SRX-ORD-${newId}`;

      const items = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price
      }));

      const newOrder = {
        id: newId,
        orderNumber,
        userId: user?.id || 2,
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: { street: formData.street, city: formData.city, state: formData.state, postalCode: formData.zip, country: 'USA' },
        items,
        totalAmount: grandTotal,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: formData.paymentMethod,
        transactionRef: 'txn_aws_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      };

      orders.unshift(newOrder);
      setDB(STORAGE_KEYS.ORDERS, orders);

      // Reduce Inventory Stock
      const products = getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
      for (const it of items) {
        const pIdx = products.findIndex(p => p.id === it.productId);
        if (pIdx !== -1) {
          products[pIdx].stock = Math.max(0, products[pIdx].stock - it.quantity);
        }
      }
      setDB(STORAGE_KEYS.PRODUCTS, products);

      // Publish AWS EventBridge events
      publishCloudEvent('OrderCreated', { orderId: newId, orderNumber, total: grandTotal, itemsCount: items.length });
      publishCloudEvent('StockReduced', { itemsCount: items.length, status: 'Completed' }, 'aws.smartretailx.inventoryservice');
      publishCloudEvent('DispatchEmailSent', { recipient: formData.email, orderNumber }, 'aws.smartretailx.notificationservice');

      clearCart();
      setLoading(false);
      navigateTo('confirmation', newId);
    }, 800);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header">
          <h1 className="section-title"><Icon.Shield /> Secure Checkout</h1>
          <p className="section-subtitle">Simulated ASP.NET Core Order & Payment Service transaction</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="card-elevated">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>1. Customer & Shipping Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input type="text" required value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="form-input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input type="text" required value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="form-input" />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>2. Payment Battle & Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {['Credit Card', 'Koko 3-Installments', 'Cash on Delivery'].map(method => (
              <div 
                key={method}
                onClick={() => setFormData({ ...formData, paymentMethod: method })}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.paymentMethod === method ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
                  background: formData.paymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {method}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Amount</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>${grandTotal.toFixed(2)}</div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
              {loading ? 'Publishing Order Event...' : '🚀 Place Order Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 10. SCREEN 6: ORDER CONFIRMATION SCREEN
// ----------------------------------------------------------------------------
function ConfirmationScreen({ orderId, navigateTo }) {
  const orders = useMemo(() => getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS), []);
  const order = orders.find(o => o.id === orderId) || orders[0];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 23, 38, 0.7) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Icon.Check />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.25rem' }}>
            Recorded in ASP.NET Core OrderService database with Order ID <strong>#{order?.id}</strong>
          </p>

          <span className="badge badge-success">{order?.status || 'Confirmed'}</span>
        </div>

        {/* EventFlow Highlight */}
        <div className="card" style={{ marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Icon.Zap />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Cloud-Native EventMesh Broadcast Triggered</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            OrderService published an <code>OrderCreated</code> domain event to AWS EventBridge & SQS queues:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '6px' }}>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>1. Inventory Service</div>
              <div style={{ color: 'var(--text-dim)' }}>Deducted warehouse stock automatically via SQS subscriber.</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '6px' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>2. Notification Service</div>
              <div style={{ color: 'var(--text-dim)' }}>Dispatched customer confirmation email alert.</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('orders')} className="btn btn-primary btn-lg"><Icon.Layers /> View My Orders</button>
          <button onClick={() => navigateTo('products')} className="btn btn-secondary btn-lg"><Icon.Package /> Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 11. SCREEN 7: MY ORDERS SCREEN
// ----------------------------------------------------------------------------
function OrdersScreen({ user, navigateTo }) {
  const orders = useMemo(() => getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS), []);
  const [searchId, setSearchId] = useState('');

  const filteredOrders = useMemo(() => {
    if (!searchId.trim()) return orders;
    return orders.filter(o => String(o.id).includes(searchId.trim()) || o.orderNumber?.toLowerCase().includes(searchId.toLowerCase()));
  }, [orders, searchId]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title"><Icon.Layers /> My Orders & History</h1>
            <p className="section-subtitle">Real-time order logs stored in OrderService database</p>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              value={searchId} 
              onChange={(e) => setSearchId(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '2.2rem' }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
              <Icon.Search />
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredOrders.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#38bdf8' }}>#{order.id}</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{order.orderNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Shipped' ? 'badge-cyan' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                  <strong style={{ fontSize: '1.15rem', color: '#ffffff' }}>${Number(order.totalAmount).toFixed(2)}</strong>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(order.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.productName} (x{item.quantity})</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 12. SCREEN 8: ADMIN & OPERATIONS PORTAL
// ----------------------------------------------------------------------------
function AdminScreen({ navigateTo, showToast }) {
  const [tab, setTab] = useState('catalog');
  const [products, setProducts] = useState(() => getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS));
  const [orders, setOrders] = useState(() => getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS));

  const [newProd, setNewProd] = useState({ name: '', price: '', category: 'Gaming', description: '', stock: 25, imageUrl: '' });
  const [stockUpdateId, setStockUpdateId] = useState('');
  const [newStockQty, setNewStockQty] = useState('');

  const refreshData = () => {
    setProducts(getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS));
    setOrders(getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const list = getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const item = {
      id: newId,
      name: newProd.name,
      price: parseFloat(newProd.price),
      category: newProd.category,
      description: newProd.description || 'Premium e-commerce hardware item.',
      stock: parseInt(newProd.stock) || 20,
      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    };

    list.unshift(item);
    setDB(STORAGE_KEYS.PRODUCTS, list);
    publishCloudEvent('ProductCreated', { productId: newId, name: item.name }, 'aws.smartretailx.productservice');

    setNewProd({ name: '', price: '', category: 'Gaming', description: '', stock: 25, imageUrl: '' });
    refreshData();
    showToast(`Product "${item.name}" added to catalog!`);
  };

  const handleDeleteProduct = (id) => {
    let list = getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    list = list.filter(p => p.id !== id);
    setDB(STORAGE_KEYS.PRODUCTS, list);
    publishCloudEvent('ProductDeleted', { productId: id }, 'aws.smartretailx.productservice');
    refreshData();
    showToast(`Product #${id} deleted.`);
  };

  const handleUpdateStock = (e) => {
    e.preventDefault();
    if (!stockUpdateId) return;
    const list = getDB(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const idx = list.findIndex(p => String(p.id) === String(stockUpdateId));
    if (idx !== -1) {
      list[idx].stock = parseInt(newStockQty) || 0;
      setDB(STORAGE_KEYS.PRODUCTS, list);
      publishCloudEvent('StockUpdated', { productId: stockUpdateId, stock: list[idx].stock }, 'aws.smartretailx.inventoryservice');
      refreshData();
      showToast(`Stock updated for Product #${stockUpdateId}`);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const list = getDB(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    const idx = list.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      list[idx].status = newStatus;
      setDB(STORAGE_KEYS.ORDERS, list);
      publishCloudEvent('OrderStatusChanged', { orderId, newStatus }, 'aws.smartretailx.orderservice');
      refreshData();
      showToast(`Order #${orderId} status changed to ${newStatus}`);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title"><Icon.Shield /> Admin & Operations Portal</h1>
            <p className="section-subtitle">Manage products, live inventory, and order dispatch states</p>
          </div>

          <button onClick={refreshData} className="btn btn-secondary btn-sm"><Icon.Refresh /> Refresh</button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => setTab('catalog')} className={`btn ${tab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}>
            Catalog Management
          </button>
          <button onClick={() => setTab('inventory')} className={`btn ${tab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}>
            Stock Control
          </button>
          <button onClick={() => setTab('orders')} className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}>
            Orders Management ({orders.length})
          </button>
        </div>

        {/* Tab 1: Catalog */}
        {tab === 'catalog' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <form onSubmit={handleCreateProduct} className="card-elevated">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>Add Product to Catalog</h3>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input type="number" step="0.01" required value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className="form-select">
                    <option value="Gaming">Gaming</option>
                    <option value="Computers">Computers</option>
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={2} value={newProd.description} onChange={(e) => setNewProd({ ...newProd, description: e.target.value })} className="form-textarea" />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Stock</label>
                <input type="number" value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })} className="form-input" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish to ProductService</button>
            </form>

            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Active Catalog ({products.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
                {products.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id} • ${p.price} • Stock: {p.stock}</div>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-secondary btn-icon" style={{ color: 'var(--accent-rose)', width: '32px', height: '32px' }}>
                      <Icon.Trash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stock Control */}
        {tab === 'inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <form onSubmit={handleUpdateStock} className="card-elevated">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>Update Warehouse Stock</h3>
              <div className="form-group">
                <label className="form-label">Choose Product</label>
                <select value={stockUpdateId} onChange={(e) => setStockUpdateId(e.target.value)} className="form-select" required>
                  <option value="">-- Select Product --</option>
                  {products.map(p => <option key={p.id} value={p.id}>#{p.id} - {p.name} (Stock: {p.stock})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">New Stock Quantity</label>
                <input type="number" required value={newStockQty} onChange={(e) => setNewStockQty(e.target.value)} className="form-input" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Stock</button>
            </form>

            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Live Stock Levels</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
                {products.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {p.category}</div>
                    </div>
                    <span className={`badge ${p.stock <= 0 ? 'badge-danger' : 'badge-success'}`}>{p.stock} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {tab === 'orders' && (
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Customer Orders Management ({orders.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(ord => (
                <div key={ord.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8' }}>#{ord.id}</span>
                      <strong style={{ color: '#fff' }}>{ord.customerName}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({ord.customerEmail})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Total: <strong>${Number(ord.totalAmount).toFixed(2)}</strong> • Placed on {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Change Status:</span>
                    <select value={ord.status} onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)} className="form-select" style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 13. SCREEN 9: PROFILE SCREEN
// ----------------------------------------------------------------------------
function ProfileScreen({ user, token, switchUser }) {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '780px' }}>
        <div className="section-header">
          <h1 className="section-title"><Icon.User /> User Profile & JWT Authentication</h1>
          <p className="section-subtitle">Identity details and signed Bearer token issued by UserService</p>
        </div>

        <div className="card-elevated" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800 }}>
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{user?.name}</h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</div>
              <span className={`badge ${user?.role === 'Admin' ? 'badge-primary' : 'badge-cyan'}`} style={{ marginTop: '0.4rem' }}>
                Role: {user?.role}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Switch Demo Persona:</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => switchUser(SEED_USERS[1])} className="btn btn-secondary btn-sm">Jane Doe (Customer)</button>
              <button onClick={() => switchUser(SEED_USERS[0])} className="btn btn-secondary btn-sm" style={{ color: '#a5b4fc' }}>Admin User</button>
            </div>
          </div>
        </div>

        {/* JWT Token Inspector */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>Active Signed JWT Access Token</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>HMAC-SHA256 token passed in HTTP Authorization header:</p>
          <div style={{ background: '#090d16', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a5b4fc', wordBreak: 'break-all' }}>
            {token}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 14. VIVA ARCHITECTURE INSPECTOR MODAL
// ----------------------------------------------------------------------------
function VivaInspectorModal({ onClose }) {
  const [tab, setTab] = useState('mesh');
  const [events, setEvents] = useState(() => getDB(STORAGE_KEYS.EVENTS, []));

  useEffect(() => {
    const fn = (evt) => setEvents(prev => [evt, ...prev]);
    eventListeners.push(fn);
    return () => {
      const idx = eventListeners.indexOf(fn);
      if (idx !== -1) eventListeners.splice(idx, 1);
    };
  }, []);

  const services = [
    { name: 'UserService', port: 5001, role: 'JWT Auth & RBAC Identity (.NET 10)', latency: 12, http: 200 },
    { name: 'ProductService', port: 5002, role: 'Catalog & EF Core (.NET 10)', latency: 18, http: 200 },
    { name: 'OrderService', port: 5003, role: 'Order Processing & EventMesh (.NET 10)', latency: 15, http: 200 },
    { name: 'InventoryService', port: 5004, role: 'Real-time Stock Control (.NET 10)', latency: 10, http: 200 },
    { name: 'PaymentService', port: 5005, role: 'Payment Gateway Integration (.NET 10)', latency: 22, http: 200 },
    { name: 'NotificationService', port: 5006, role: 'AWS EventBridge Alerts (.NET 10)', latency: 14, http: 200 }
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.9)', backdropFilter: 'blur(16px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '20px',
        maxWidth: '960px', width: '100%', maxHeight: '90vh', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon.Zap />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>SmartRetailX <span style={{ color: '#38bdf8' }}>Viva & Architecture Inspector</span></h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live demonstration control panel for university examiners</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '36px', height: '36px' }}><Icon.X /></button>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 1.5rem', background: '#090d16', overflowX: 'auto' }}>
          {[
            { id: 'mesh', label: 'Microservice Mesh', icon: <Icon.Activity /> },
            { id: 'events', label: 'EventBridge Log', icon: <Icon.Radio /> },
            { id: 'diagram', label: 'Architecture Flow', icon: <Icon.Layers /> },
            { id: 'script', label: 'Viva Script & Q&A', icon: <Icon.Book /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '0.85rem 1rem', background: 'none', border: 'none',
                borderBottom: tab === t.id ? '2px solid #6366f1' : '2px solid transparent',
                color: tab === t.id ? '#ffffff' : '#94a3b8', fontWeight: tab === t.id ? 700 : 500,
                fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', flexGrow: 1, overflowY: 'auto' }}>
          {tab === 'mesh' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {services.map(svc => (
                  <div key={svc.name} style={{ padding: '1.1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{svc.name}</h4>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Port {svc.port}</span>
                      </div>
                      <span className="badge badge-success">Online</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.4rem 0' }}>{svc.role}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem', fontSize: '0.78rem' }}>
                      <span>HTTP: <strong style={{ color: '#38bdf8' }}>200 OK</strong></span>
                      <span>Latency: <strong style={{ color: '#34d399' }}>{svc.latency}ms</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>AWS EventBridge Event Log Stream</h3>
                <button onClick={() => { setDB(STORAGE_KEYS.EVENTS, []); setEvents([]); }} className="btn btn-secondary btn-sm">Clear Log</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                {events.map(e => (
                  <div key={e.id} style={{ padding: '0.8rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#818cf8', fontWeight: 700 }}>{e.detailType} ({e.source})</span>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{new Date(e.time).toLocaleTimeString()}</span>
                    </div>
                    <div style={{ color: '#38bdf8' }}>{JSON.stringify(e.detail)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'diagram' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Distributed Cloud Architecture</h3>
              <div style={{ background: '#080c14', padding: '1.25rem', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8', lineHeight: 1.6, overflowX: 'auto' }}>
                <pre>{`
  [ Client Browser / Frontend SPA ]
                 │
                 ▼
  [ AWS Application Load Balancer (ALB) - Port 80/443 ]
         ├── /                     ──► Frontend React SPA (Nginx Container)
         ├── /api/v1/auth/*        ──► UserService (.NET 10 / Port 5001)
         ├── /api/v1/products/*    ──► ProductService (.NET 10 / Port 5002)
         ├── /api/v1/orders/*      ──► OrderService (.NET 10 / Port 5003)
         ├── /api/v1/inventory/*   ──► InventoryService (.NET 10 / Port 5004)
         └── /api/v1/payments/*    ──► PaymentService (.NET 10 / Port 5005)

  [ Asynchronous Event Mesh (EventBridge & SQS) ]
  OrderService ──(OrderCreated Event)──► AWS EventBridge Bus ──► SQS Queue
                                                                  │
                                      ┌───────────────────────────┴───────────────────────────┐
                                      ▼                                                       ▼
                            [ InventoryService ]                                  [ NotificationService ]
                         (Reduces warehouse stock)                             (Sends dispatch confirmation)
                `}</pre>
              </div>
            </div>
          )}

          {tab === 'script' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>10-Step Viva Demo Script</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {[
                    '1. Introduce SmartRetailX as a cloud-native microservices architecture built with .NET 10, React, and AWS.',
                    '2. Open this Viva Inspector to prove that all 6 services are healthy and communicating.',
                    '3. Log in as Customer (jane@example.com) to demonstrate JWT HMAC-SHA256 authentication.',
                    '4. Browse the catalog, filter by Gaming/Audio/Computers, and show live stock counts.',
                    '5. Add products to cart, apply promo code (VIVA2025), and place the order.',
                    '6. Show the "EventBridge Log" tab to prove that the OrderCreated domain event fired and deducted stock.',
                    '7. Switch to Admin role (admin@smartretailx.com) and navigate to the Admin Dashboard.',
                    '8. Modify an order status from "Confirmed" to "Shipped" and adjust warehouse stock.',
                    '9. Explain the eventual consistency model between OrderService and InventoryService.',
                    '10. Show the architecture diagram and answer questions about AWS ECS, ALB, and JWT.'
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', color: '#cbd5e1' }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>SmartRetailX Viva Companion</span>
          <button onClick={onClose} className="btn btn-primary btn-sm">Close Inspector</button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 15. MOUNT REACT APPLICATION
// ----------------------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
