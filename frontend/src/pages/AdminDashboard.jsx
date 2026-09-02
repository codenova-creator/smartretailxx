import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Package, 
  Layers, 
  Activity, 
  RefreshCw, 
  Check, 
  Trash2,
  Boxes,
  Database,
  Truck,
  Edit,
  RotateCcw
} from 'lucide-react';
import productApi from '../api/productApi';
import inventoryApi from '../api/inventoryApi';
import orderApi from '../api/orderApi';
import systemApi from '../api/systemApi';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [meshStatus, setMeshStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Gaming',
    imageUrl: '',
    stock: 25
  });

  // Stock update state
  const [stockUpdateId, setStockUpdateId] = useState('');
  const [newStockQty, setNewStockQty] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, health, allOrders] = await Promise.all([
        productApi.getProducts(),
        systemApi.checkMeshHealth(),
        orderApi.getAllOrders()
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setMeshStatus(health);
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    try {
      await productApi.createProduct({
        name: newProd.name,
        description: newProd.description,
        price: Number(newProd.price),
        category: newProd.category,
        imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        stock: Number(newProd.stock) || 25
      });

      setStatusMessage({ text: `Product "${newProd.name}" successfully added to Product Service!`, type: 'success' });
      setNewProd({ name: '', description: '', price: '', category: 'Gaming', imageUrl: '', stock: 25 });
      loadData();
    } catch (err) {
      setStatusMessage({ text: err.friendlyMessage || 'Failed to create product.', type: 'error' });
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) return;
    try {
      await productApi.deleteProduct(id);
      setStatusMessage({ text: `Product #${id} removed successfully.`, type: 'success' });
      loadData();
    } catch (err) {
      setStatusMessage({ text: 'Failed to delete product', type: 'error' });
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!stockUpdateId || newStockQty === '') return;

    try {
      await inventoryApi.updateStock(stockUpdateId, newStockQty);
      setStatusMessage({ text: `Stock for Product #${stockUpdateId} updated to ${newStockQty} in Inventory Service!`, type: 'success' });
      setStockUpdateId('');
      setNewStockQty('');
      loadData();
    } catch (err) {
      setStatusMessage({ text: err.friendlyMessage || 'Failed to update stock.', type: 'error' });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setStatusMessage({ text: `Order #${orderId} status updated to "${newStatus}"!`, type: 'success' });
      loadData();
    } catch (err) {
      setStatusMessage({ text: 'Failed to update order status.', type: 'error' });
    }
  };

  const handleResetDatabase = () => {
    if (window.confirm('Reset catalog, stock, and orders back to default seed data?')) {
      systemApi.resetDatabase();
      setStatusMessage({ text: 'Database reset to default seed data.', type: 'success' });
      loadData();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">
              <ShieldCheck size={28} style={{ color: 'var(--accent-primary)' }} />
              Admin & Operations Portal
            </h1>
            <p className="section-subtitle">
              Manage product catalog items, warehouse inventory, and live orders
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleResetDatabase} className="btn btn-secondary btn-sm" title="Reset seed products & orders">
              <RotateCcw size={14} /> Reset Data
            </button>
            <button onClick={loadData} disabled={loading} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {statusMessage && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
            color: statusMessage.type === 'success' ? '#6ee7b7' : '#fda4af',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <Check size={18} /> {statusMessage.text}
          </div>
        )}

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Plus size={16} /> Catalog Management
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Boxes size={16} /> Stock Control
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Truck size={16} /> Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`btn ${activeTab === 'health' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Activity size={16} /> Microservices Health
          </button>
        </div>

        {/* Tab 1: Catalog Management */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <div className="card-elevated">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
                Add New Product to Catalog
              </h3>

              <form onSubmit={handleCreateProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ASUS ROG Strix Gaming Laptop"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="999.99"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="form-select"
                    >
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
                  <textarea
                    rows={3}
                    placeholder="Provide detailed description of product specifications..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProd.imageUrl}
                    onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Warehouse Stock</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Plus size={16} /> Publish to Product Service
                </button>
              </form>
            </div>

            {/* Existing Products Snapshot */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
                Active Catalog Items ({products.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
                {products.map((p) => (
                  <div key={p.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <img 
                        src={p.imageUrl} 
                        alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'; }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: #{p.id} • ${Number(p.price).toFixed(2)} • Stock: {p.stock}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="btn btn-secondary btn-icon"
                      style={{ color: 'var(--accent-rose)', flexShrink: 0 }}
                      title="Remove product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stock Control */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <div className="card-elevated">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
                Update Live Stock Level
              </h3>

              <form onSubmit={handleUpdateStock}>
                <div className="form-group">
                  <label className="form-label">Select Product</label>
                  <select
                    value={stockUpdateId}
                    onChange={(e) => {
                      setStockUpdateId(e.target.value);
                      const prod = products.find(p => String(p.id) === e.target.value);
                      if (prod) setNewStockQty(prod.stock);
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.id} - {p.name} (Current: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">New Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 50"
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Check size={16} /> Update Inventory Service
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
                Inventory Levels Overview
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
                {products.map((p) => (
                  <div key={p.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {p.category}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${p.stock <= 0 ? 'badge-danger' : p.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {p.stock} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
              Platform Customer Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Package size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
                <h3>No orders found</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((ord) => (
                  <div key={ord.id} style={{
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: '#38bdf8' }}>#{ord.id}</span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{ord.customerName}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({ord.customerEmail})</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                          Placed on {new Date(ord.createdAt).toLocaleString()} • Total: <strong>${Number(ord.totalAmount).toFixed(2)}</strong>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="form-select"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {(ord.items || []).map((it, i) => (
                        <span key={i} style={{ marginRight: '1rem' }}>
                          • {it.productName} (x{it.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Microservices Health */}
        {activeTab === 'health' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {meshStatus.map((svc, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{svc.name}</h4>
                    <span className="badge badge-success">Online</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>{svc.role}</p>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>HTTP: <strong style={{ color: '#38bdf8' }}>{svc.httpCode} OK</strong></span>
                    <span>Latency: <strong style={{ color: '#34d399' }}>{svc.latencyMs}ms</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
