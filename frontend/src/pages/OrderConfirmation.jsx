import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Zap, 
  ArrowRight, 
  ShoppingBag, 
  Layers,
  Clock,
  ShieldCheck,
  Activity
} from 'lucide-react';
import orderApi from '../api/orderApi';
import Loading from '../components/Loading';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      orderApi.getOrderById(id)
        .then(data => setOrder(data))
        .catch(err => console.warn('Could not fetch order details', err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <Loading message="Fetching confirmation details from Order Service..." />
        </div>
      </div>
    );
  }

  const items = order?.items || [];
  const total = Number(order?.totalAmount) || items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Success Banner */}
        <div className="card" style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 23, 38, 0.7) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.25rem' }}>
            Thank you! Your order has been recorded in the SmartRetailX Order Microservice database.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.95rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>#{order?.id || id}</strong>
            <span className="badge badge-warning">
              {order?.status || 'Pending'}
            </span>
          </div>
        </div>

        {/* Microservices Asynchronous EventFlow Highlight */}
        <div className="card" style={{
          marginBottom: '2rem',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid var(--border-glow)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Zap size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Cloud-Native EventMesh Broadcast Triggered
            </h3>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            When this order was created, the <strong>OrderService</strong> published an <code>OrderCreated</code> event to 
            <strong> AWS EventBridge & SQS</strong>.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.8rem'
          }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>1. Inventory Service</div>
              <div style={{ color: 'var(--text-dim)', marginTop: '2px' }}>Consumed event & automatically deducted live warehouse stock.</div>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>2. Notification Service</div>
              <div style={{ color: 'var(--text-dim)', marginTop: '2px' }}>Consumed event & queued customer email dispatch alert.</div>
            </div>
          </div>
        </div>

        {/* Itemized Order Details */}
        <div className="card-elevated" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Itemized Receipt
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>
                    {item.productName || `Product #${item.productId}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quantity: {item.quantity} × ${(Number(item.unitPrice) || 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>
                  ${((Number(item.unitPrice) || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total Paid</span>
            <span style={{ color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary btn-lg">
            <Layers size={18} /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary btn-lg">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
