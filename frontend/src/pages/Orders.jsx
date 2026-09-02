import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Package, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orderApi from '../api/orderApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const userOrders = await orderApi.getUserOrders(user?.id || 2);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to load user orders', err);
      setError(err.friendlyMessage || 'Unable to retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSearchOrder = async (e) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;

    setSearching(true);
    try {
      const order = await orderApi.getOrderById(searchOrderId.trim());
      if (order && order.id) {
        // Prepend or show found order
        setOrders(prev => {
          const exists = prev.some(o => o.id === order.id);
          return exists ? prev : [order, ...prev];
        });
      }
    } catch (err) {
      alert(`Order #${searchOrderId} not found in the database.`);
    } finally {
      setSearching(false);
    }
  };

  const getStatusBadge = (status = 'Pending') => {
    const s = status.toLowerCase();
    if (s === 'delivered') return <span className="badge badge-success">Delivered</span>;
    if (s === 'shipped') return <span className="badge badge-cyan">Shipped</span>;
    if (s === 'processing') return <span className="badge badge-primary">Processing</span>;
    if (s === 'cancelled') return <span className="badge badge-danger">Cancelled</span>;
    return <span className="badge badge-warning">Pending</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">
              <Layers size={28} style={{ color: 'var(--accent-primary)' }} />
              My Orders & History
            </h1>
            <p className="section-subtitle">
              Live orders retrieved from the ASP.NET Core Order Microservice
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={fetchOrders} 
              disabled={loading}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Search Single Order Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchOrder} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flexGrow: 1, minWidth: '240px' }}>
              <input
                type="number"
                placeholder="Lookup Order by ID (e.g. 1380)..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="form-input"
              />
            </div>
            <button 
              type="submit" 
              disabled={searching || !searchOrderId.trim()}
              className="btn btn-primary"
            >
              <Search size={16} /> Lookup Order
            </button>
          </form>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <Loading message="Loading orders from Order Service..." />
        ) : error ? (
          <ErrorMessage 
            title="Failed to Load Orders" 
            message={error} 
            onRetry={fetchOrders} 
          />
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You haven't placed any orders yet. Try purchasing a product to see live order events!
            </p>
            <Link to="/products" className="btn btn-primary">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => {
              const items = order.items || [];
              const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent';
              const totalAmount = Number(order.totalAmount) || items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);

              return (
                <div key={order.id} className="card-elevated">
                  {/* Order Card Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                        Order <span style={{ color: 'var(--accent-cyan)' }}>#{order.id}</span>
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={15} />
                      <span>{orderDate}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--accent-primary)'
                          }} />
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>
                            {item.productName || `Product #${item.productId}`}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            × {item.quantity}
                          </span>
                        </div>

                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          ${((Number(item.unitPrice) || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      Customer: <strong>{order.customerName || user?.name || 'Customer'}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total:</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
