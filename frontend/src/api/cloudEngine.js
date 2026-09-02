/**
 * SmartRetailX Cloud Engine (In-Browser Microservices & Event Mesh Simulator)
 * 
 * Provides a 100% resilient, zero-failure simulation of all 6 ASP.NET Core microservices
 * (UserService, ProductService, OrderService, InventoryService, PaymentService, NotificationService)
 * and AWS EventBridge / SQS asynchronous event messaging.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'srx_db_products',
  USERS: 'srx_db_users',
  ORDERS: 'srx_db_orders',
  INVENTORY: 'srx_db_inventory',
  EVENTS: 'srx_db_eventbridge_log',
  SIMULATION_MODE: 'srx_simulation_mode'
};

// Initial Seed Products
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
    specs: {
      'Screen Size': '32-inch 4K QD-OLED',
      'Refresh Rate': '240 Hz',
      'Response Time': '0.03 ms GTG',
      'Connectivity': 'DisplayPort 1.4, HDMI 2.1, USB-C 90W PD'
    }
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
    specs: {
      'Driver Unit': '30mm Carbon Fiber',
      'Battery Life': '30 Hours (ANC On)',
      'Weight': '250g Ultra-lightweight',
      'Audio Codecs': 'LDAC, AAC, SBC'
    }
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
    specs: {
      'Processor': 'Apple M3 Max (14-core CPU / 30-core GPU)',
      'Memory': '36GB Unified Memory',
      'Storage': '1TB NVMe SSD',
      'Display': '16.2" Liquid Retina XDR (120Hz ProMotion)'
    }
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
    specs: {
      'GPU': 'Advanced RDNA 3 with AI Upscaling',
      'Storage': '2TB Custom High-Speed SSD',
      'Output': '4K 120Hz / 8K Support, HDR',
      'Audio': 'Tempest 3D AudioTech'
    }
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
    specs: {
      'Switch Type': 'GL Tactile Low-Profile',
      'Connection': 'LIGHTSPEED 1ms Wireless & Bluetooth',
      'RGB': 'LIGHTSYNC Per-Key RGB',
      'Battery': '30 Hours continuous gaming'
    }
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
    specs: {
      'Case': '49mm Aerospace-Grade Titanium',
      'Display': 'Always-On Retina (3000 nits)',
      'Water Resistance': '100m Water Resistant / EN13319',
      'Battery Life': 'Up to 36 hours (72h Low Power)'
    }
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
    specs: {
      'Capacity': '20,000 mAh / 72Wh',
      'Max Output': '200W (100W per USB-C port)',
      'Display': 'Smart Digital Status Screen',
      'Recharge Speed': '100W Fast Recharge in 1 hr 15 min'
    }
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
    specs: {
      'Weight': '63g Ultra-lightweight',
      'Sensor': 'Focus Pro 30K Optical Sensor (30,000 DPI)',
      'Switches': 'Optical Mouse Switches Gen-3 (90M Clicks)',
      'Polling Rate': 'Up to 4000Hz Wireless Ready'
    }
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
    specs: {
      'Display': '6.8" Dynamic AMOLED 2X 120Hz (2600 nits)',
      'Camera': '200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP UW',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Battery': '5000 mAh with 45W Fast Charging'
    }
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
    specs: {
      'Audio Drivers': 'Premium High Fidelity 40mm Drivers',
      'Battery System': 'Dual Hot-Swappable 44-Hour Battery System',
      'ANC': '4-mic hybrid active noise cancellation',
      'Compatibility': 'PC, PS5, Switch, Mobile via 2.4GHz + BT'
    }
  }
];

// Initial Seed Users (Matching .NET UserService seed accounts)
const SEED_USERS = [
  {
    id: 1,
    name: 'SmartRetailX Admin',
    email: 'admin@smartretailx.com',
    password: 'Admin@123',
    role: 'Admin',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
    role: 'Customer',
    createdAt: '2025-01-10T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'alice123',
    role: 'Customer',
    createdAt: '2025-01-15T14:20:00.000Z'
  }
];

// Initial Seed Orders
const SEED_ORDERS = [
  {
    id: 1001,
    orderNumber: 'SRX-ORD-1001',
    userId: 2,
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    shippingAddress: {
      street: '456 Innovation Blvd, Suite 200',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    items: [
      {
        productId: 2,
        productName: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        quantity: 1,
        unitPrice: 399.99
      },
      {
        productId: 7,
        productName: 'Anker Prime 20,000mAh Power Bank (200W Output)',
        quantity: 1,
        unitPrice: 129.99
      }
    ],
    totalAmount: 529.98,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionRef: 'txn_aws_82910a7',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    timeline: [
      { status: 'Order Placed', time: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Order submitted to OrderService' },
      { status: 'Event Published', time: new Date(Date.now() - 86400000 * 3 + 1200).toISOString(), note: 'AWS EventBridge OrderCreated published' },
      { status: 'Stock Deducted', time: new Date(Date.now() - 86400000 * 3 + 2500).toISOString(), note: 'InventoryService reduced stock via SQS' },
      { status: 'Processing', time: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Warehouse picking and packing' },
      { status: 'Shipped', time: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Dispatched via Express Courier' },
      { status: 'Delivered', time: new Date(Date.now() - 86400000 * 0.5).toISOString(), note: 'Package signed and delivered' }
    ]
  },
  {
    id: 1002,
    orderNumber: 'SRX-ORD-1002',
    userId: 2,
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    shippingAddress: {
      street: '456 Innovation Blvd, Suite 200',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    items: [
      {
        productId: 4,
        productName: 'PlayStation 5 Pro Console (2TB SSD)',
        quantity: 1,
        unitPrice: 699.99
      }
    ],
    totalAmount: 699.99,
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    transactionRef: 'txn_aws_93812f1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timeline: [
      { status: 'Order Placed', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Order submitted to OrderService' },
      { status: 'Event Published', time: new Date(Date.now() - 3600000 * 4 + 1100).toISOString(), note: 'AWS EventBridge OrderCreated published' },
      { status: 'Stock Deducted', time: new Date(Date.now() - 3600000 * 4 + 2300).toISOString(), note: 'InventoryService reduced stock via SQS' },
      { status: 'Processing', time: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Loadout verification complete. Packing gear.' }
    ]
  }
];

class CloudEngine {
  constructor() {
    this.initDatabase();
    this.listeners = [];
  }

  // Helper to read from LocalStorage
  getStore(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
    return defaultValue;
  }

  // Helper to save to LocalStorage
  setStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.setStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setStore(STORAGE_KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.setStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      const initialEvents = [
        {
          id: 'evt_init_001',
          source: 'aws.smartretailx.orderservice',
          detailType: 'OrderCreated',
          time: new Date(Date.now() - 3600000).toISOString(),
          detail: { orderId: 1002, userId: 2, total: 699.99, itemsCount: 1 },
          status: 'SUCCESS'
        },
        {
          id: 'evt_init_002',
          source: 'aws.smartretailx.inventoryservice',
          detailType: 'StockReduced',
          time: new Date(Date.now() - 3598000).toISOString(),
          detail: { productId: 4, quantity: 1, newStock: 15 },
          status: 'SUCCESS'
        },
        {
          id: 'evt_init_003',
          source: 'aws.smartretailx.notificationservice',
          detailType: 'DispatchEmailSent',
          time: new Date(Date.now() - 3596000).toISOString(),
          detail: { recipient: 'jane@example.com', subject: 'Order #SRX-ORD-1002 Confirmed' },
          status: 'SUCCESS'
        }
      ];
      this.setStore(STORAGE_KEYS.EVENTS, initialEvents);
    }
  }

  // Publish Event to simulated AWS EventBridge
  publishEvent(detailType, detail, source = 'aws.smartretailx.orderservice') {
    const events = this.getStore(STORAGE_KEYS.EVENTS, []);
    const event = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11),
      source,
      detailType,
      time: new Date().toISOString(),
      detail,
      status: 'SUCCESS'
    };
    events.unshift(event);
    // Keep max 50 events in log
    if (events.length > 50) events.pop();
    this.setStore(STORAGE_KEYS.EVENTS, events);
    
    // Trigger any active UI event stream listeners
    this.listeners.forEach(cb => cb(event));
    return event;
  }

  subscribeEvents(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  getEventLogs() {
    return this.getStore(STORAGE_KEYS.EVENTS, []);
  }

  clearEventLogs() {
    this.setStore(STORAGE_KEYS.EVENTS, []);
  }

  // ==========================================
  // 1. PRODUCT SERVICE SIMULATOR
  // ==========================================
  async getProducts(params = {}) {
    await this.delay(40);
    let products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);

    if (params.category && params.category !== 'All' && params.category !== '') {
      const catLower = params.category.toLowerCase();
      products = products.filter(p => p.category.toLowerCase().includes(catLower));
    }

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return products;
  }

  async getProductById(id) {
    await this.delay(30);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const product = products.find(p => String(p.id) === String(id));
    if (!product) {
      const err = new Error(`Product with ID ${id} not found.`);
      err.response = { status: 404, data: { message: `Product ${id} not found.` } };
      throw err;
    }
    return product;
  }

  async createProduct(productData) {
    await this.delay(60);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price) || 0,
      category: productData.category || 'Electronics',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      stock: parseInt(productData.stock) || 10,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: !!productData.isFeatured,
      specs: productData.specs || { 'Standard': 'Official Retail Packaging' }
    };
    products.unshift(newProduct);
    this.setStore(STORAGE_KEYS.PRODUCTS, products);

    this.publishEvent('ProductCreated', { productId: newId, name: newProduct.name, price: newProduct.price }, 'aws.smartretailx.productservice');
    return newProduct;
  }

  async updateProduct(id, productData) {
    await this.delay(50);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      const err = new Error(`Product with ID ${id} not found.`);
      err.response = { status: 404, data: { message: `Product ${id} not found.` } };
      throw err;
    }
    products[index] = { ...products[index], ...productData };
    this.setStore(STORAGE_KEYS.PRODUCTS, products);

    this.publishEvent('ProductUpdated', { productId: id, changes: Object.keys(productData) }, 'aws.smartretailx.productservice');
    return products[index];
  }

  async deleteProduct(id) {
    await this.delay(40);
    let products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    products = products.filter(p => String(p.id) !== String(id));
    this.setStore(STORAGE_KEYS.PRODUCTS, products);

    this.publishEvent('ProductDeleted', { productId: id }, 'aws.smartretailx.productservice');
    return { success: true, message: `Product ${id} deleted successfully.` };
  }

  // ==========================================
  // 2. USER & AUTH SERVICE SIMULATOR
  // ==========================================
  async login(email, password) {
    await this.delay(60);
    const users = this.getStore(STORAGE_KEYS.USERS, SEED_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user || user.password !== password) {
      const err = new Error('Invalid email or password.');
      err.response = { status: 401, data: { message: 'Invalid credentials. Please verify your email and password.' } };
      throw err;
    }

    // Generate simulated HMAC-SHA256 JWT
    const tokenHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const tokenPayload = btoa(JSON.stringify({
      sub: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
      jti: 'jwt_' + Math.random().toString(36).substring(2),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7
    }));
    const fakeToken = `${tokenHeader}.${tokenPayload}.simulated_hmac_sig_${Date.now()}`;

    this.publishEvent('UserAuthenticated', { userId: user.id, email: user.email, role: user.role }, 'aws.smartretailx.userservice');

    return {
      token: fakeToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async register({ name, email, role = 'Customer', password = 'Default@123' }) {
    await this.delay(70);
    const users = this.getStore(STORAGE_KEYS.USERS, SEED_USERS);
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      const err = new Error('A user with this email already exists.');
      err.response = { status: 400, data: { message: 'Email address is already registered in the system.' } };
      throw err;
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      role: role || 'Customer',
      password,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setStore(STORAGE_KEYS.USERS, users);

    this.publishEvent('UserRegistered', { userId: newId, email: cleanEmail, role: newUser.role }, 'aws.smartretailx.userservice');

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      message: 'Account registered successfully.'
    };
  }

  async getCurrentUser(token) {
    await this.delay(30);
    if (!token) {
      const err = new Error('Unauthorized');
      err.response = { status: 401, data: { message: 'Missing Authorization Bearer token.' } };
      throw err;
    }

    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        const users = this.getStore(STORAGE_KEYS.USERS, SEED_USERS);
        const user = users.find(u => String(u.id) === String(payload.sub));
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse JWT payload', e);
    }

    // Default fallback to Jane Doe customer
    return {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'Customer'
    };
  }

  async getAllUsers() {
    await this.delay(40);
    const users = this.getStore(STORAGE_KEYS.USERS, SEED_USERS);
    return users.map(({ password, ...u }) => u);
  }

  // ==========================================
  // 3. INVENTORY SERVICE SIMULATOR
  // ==========================================
  async getInventory(productId) {
    await this.delay(25);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const product = products.find(p => String(p.id) === String(productId));
    const stock = product ? product.stock : 0;
    return {
      productId: Number(productId),
      stock: stock,
      inStock: stock > 0,
      updatedAt: new Date().toISOString()
    };
  }

  async checkStock(productId, quantity = 1) {
    await this.delay(20);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const product = products.find(p => String(p.id) === String(productId));
    const currentStock = product ? product.stock : 0;
    return {
      productId: Number(productId),
      requested: Number(quantity),
      available: currentStock,
      isAvailable: currentStock >= Number(quantity)
    };
  }

  async updateStock(productId, stock) {
    await this.delay(35);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const index = products.findIndex(p => String(p.id) === String(productId));
    if (index !== -1) {
      products[index].stock = Math.max(0, parseInt(stock) || 0);
      this.setStore(STORAGE_KEYS.PRODUCTS, products);

      this.publishEvent('StockUpdated', { productId: Number(productId), newStock: products[index].stock }, 'aws.smartretailx.inventoryservice');
      return { productId: Number(productId), stock: products[index].stock };
    }
    return { productId: Number(productId), stock: 0 };
  }

  async reduceStock(productId, quantity) {
    await this.delay(30);
    const products = this.getStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const index = products.findIndex(p => String(p.id) === String(productId));
    if (index !== -1) {
      const newStock = Math.max(0, (products[index].stock || 0) - Number(quantity));
      products[index].stock = newStock;
      this.setStore(STORAGE_KEYS.PRODUCTS, products);

      this.publishEvent('StockReduced', { productId: Number(productId), reducedBy: Number(quantity), remainingStock: newStock }, 'aws.smartretailx.inventoryservice');
      return { productId: Number(productId), stock: newStock, status: 'StockReducedSuccess' };
    }
    return { productId: Number(productId), stock: 0, status: 'NotFound' };
  }

  // ==========================================
  // 4. ORDER SERVICE SIMULATOR
  // ==========================================
  async createOrder(orderData) {
    await this.delay(80);
    const orders = this.getStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001;
    const orderNumber = `SRX-ORD-${newId}`;

    const items = (orderData.items || []).map(item => ({
      productId: Number(item.productId || item.id),
      productName: item.productName || item.name || 'Catalog Item',
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.unitPrice || item.price || 0)
    }));

    const totalAmount = orderData.totalAmount || items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const newOrder = {
      id: newId,
      orderNumber,
      userId: Number(orderData.userId || 2),
      customerName: orderData.customerName || 'Jane Doe',
      customerEmail: orderData.customerEmail || 'jane@example.com',
      shippingAddress: orderData.shippingAddress || {
        street: '456 Innovation Blvd',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA'
      },
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      transactionRef: 'txn_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'Order Placed', time: new Date().toISOString(), note: 'Order created via OrderService' },
        { status: 'EventBridge Published', time: new Date(Date.now() + 400).toISOString(), note: 'Event OrderCreated dispatched to AWS SQS' },
        { status: 'Stock Verified', time: new Date(Date.now() + 800).toISOString(), note: 'InventoryService automatically deducted stock' }
      ]
    };

    orders.unshift(newOrder);
    this.setStore(STORAGE_KEYS.ORDERS, orders);

    // 1. Publish EventBridge Asynchronous Event
    this.publishEvent('OrderCreated', {
      orderId: newId,
      orderNumber,
      userId: newOrder.userId,
      totalAmount: newOrder.totalAmount,
      itemsCount: items.length
    }, 'aws.smartretailx.orderservice');

    // 2. Simulate Async EventMesh Stock Reduction for each item
    for (const item of items) {
      await this.reduceStock(item.productId, item.quantity);
    }

    // 3. Simulate Async Notification Service Dispatch
    setTimeout(() => {
      this.publishEvent('DispatchEmailNotification', {
        recipient: newOrder.customerEmail,
        orderId: newId,
        subject: `Your SmartRetailX Order ${orderNumber} is Confirmed!`
      }, 'aws.smartretailx.notificationservice');
    }, 500);

    return newOrder;
  }

  async getOrderById(id) {
    await this.delay(35);
    const orders = this.getStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    const order = orders.find(o => String(o.id) === String(id) || o.orderNumber === String(id));
    if (!order) {
      const err = new Error(`Order with ID ${id} not found.`);
      err.response = { status: 404, data: { message: `Order ${id} not found.` } };
      throw err;
    }
    return order;
  }

  async getUserOrders(userId) {
    await this.delay(45);
    const orders = this.getStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    if (!userId) return orders;
    return orders.filter(o => String(o.userId) === String(userId));
  }

  async getAllOrders() {
    await this.delay(50);
    return this.getStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  }

  async updateOrderStatus(id, status) {
    await this.delay(40);
    const orders = this.getStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    const index = orders.findIndex(o => String(o.id) === String(id));
    if (index === -1) {
      const err = new Error(`Order ${id} not found.`);
      err.response = { status: 404, data: { message: `Order ${id} not found.` } };
      throw err;
    }

    orders[index].status = status;
    if (!orders[index].timeline) orders[index].timeline = [];
    orders[index].timeline.push({
      status: `Status Updated: ${status}`,
      time: new Date().toISOString(),
      note: `Updated by admin via OrderService API`
    });

    this.setStore(STORAGE_KEYS.ORDERS, orders);

    this.publishEvent('OrderStatusChanged', {
      orderId: Number(id),
      newStatus: status
    }, 'aws.smartretailx.orderservice');

    return orders[index];
  }

  // ==========================================
  // 5. PAYMENT SERVICE SIMULATOR
  // ==========================================
  async createPayment({ orderId, userId, amount, currency = 'USD', paymentMethod = 'Card' }) {
    await this.delay(50);
    const txnRef = 'txn_' + Math.random().toString(36).substring(2, 12);
    
    this.publishEvent('PaymentCaptured', {
      orderId: Number(orderId),
      amount: Number(amount),
      currency,
      transactionRef: txnRef,
      status: 'Success'
    }, 'aws.smartretailx.paymentservice');

    return {
      id: Math.floor(Math.random() * 9000) + 1000,
      orderId: Number(orderId),
      userId: Number(userId),
      amount: Number(amount),
      currency,
      paymentMethod,
      status: 'Success',
      transactionRef: txnRef,
      paidAt: new Date().toISOString()
    };
  }

  // ==========================================
  // 6. SYSTEM HEALTH & LATENCY SIMULATOR
  // ==========================================
  async checkMeshHealth() {
    const services = [
      { name: 'User Service', endpoint: '/api/v1/auth/me', role: 'Authentication & JWT RBAC (.NET 10)', port: 5001 },
      { name: 'Product Service', endpoint: '/api/v1/products', role: 'Catalog & EF Core (.NET 10)', port: 5002 },
      { name: 'Order Service', endpoint: '/api/v1/orders', role: 'Order Processing & EventMesh (.NET 10)', port: 5003 },
      { name: 'Inventory Service', endpoint: '/api/v1/inventory/1', role: 'Real-time Stock Control (.NET 10)', port: 5004 },
      { name: 'Payment Service', endpoint: '/api/v1/payments', role: 'Payment Gateway Integration (.NET 10)', port: 5005 },
      { name: 'Notification Service', endpoint: '/api/v1/notifications', role: 'AWS EventBridge & SQS Alerts (.NET 10)', port: 5006 }
    ];

    return services.map(svc => {
      // Simulate healthy microservice response with low latency
      const latency = Math.floor(Math.random() * 22) + 8; // 8-30ms
      return {
        ...svc,
        status: 'Online',
        httpCode: 200,
        latencyMs: latency,
        health: 'Healthy (Ready)',
        engine: 'Simulated Microservice Mesh (100% Viva Ready)'
      };
    });
  }

  // Helper async delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reset database back to default initial seed
  resetToDefaults() {
    this.setStore(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    this.setStore(STORAGE_KEYS.USERS, SEED_USERS);
    this.setStore(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    this.initDatabase();
    return true;
  }
}

export const cloudEngine = new CloudEngine();
export default cloudEngine;
