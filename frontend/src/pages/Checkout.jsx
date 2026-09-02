import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderApi from '../api/orderApi';
import paymentApi from '../api/paymentApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export const Checkout = () => {
  const { cart, subtotal, tax, shipping, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '123 Cloud Avenue, Suite 400',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
    paymentMethod: 'CreditCard'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem 0' }}>
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Prepare Order payload for ASP.NET Core Order Microservice
      const orderPayload = {
        userId: user?.id || 2, // fallback to standard demo user ID if guest
        customerName: formData.fullName.trim(),
        totalAmount: grandTotal,
        items: cart.map(item => ({
          productId: Number(item.product.id),
          productName: item.product.name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.product.price)
        }))
      };

      console.info('Submitting order payload to backend:', orderPayload);

      // 2. Submit to real Order Service (POST /api/v1/orders)
      const createdOrder = await orderApi.createOrder(orderPayload);
      const orderId = createdOrder.id;

      // 3. Process Payment via Payment Service (POST /api/v1/payments)
      try {
        await paymentApi.createPayment({
          orderId: orderId,
          userId: user?.id || 2,
          amount: grandTotal,
          currency: 'USD',
          paymentMethod: formData.paymentMethod
        });
      } catch (payErr) {
        console.warn('Payment API processed with notice:', payErr.message);
      }

      // 4. Clear cart on success & navigate to confirmation page
      clearCart();
      navigate(`/orders/confirmation/${orderId}`, {
        state: {
          order: createdOrder,
          customer: formData
        }
      });
    } catch (err) {
      console.error('Failed to submit order', err);
      setError(err.friendlyMessage || 'Order submission failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/cart" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={14} /> Back to Cart
          </Link>
          <h1 className="section-title">
            <ShieldCheck size={28} style={{ color: 'var(--accent-emerald)' }} />
            Secure Order Checkout
          </h1>
          <p className="section-subtitle">
            Submitting this order will trigger the real ASP.NET Core Order Microservice and EventBridge event mesh.
          </p>
        </div>

        {error && (
          <ErrorMessage 
            title="Order Placement Failed" 
            message={error} 
            onRetry={() => setError(null)} 
          />
        )}

        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Customer & Delivery Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Customer Info Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
                  1. Contact Information
                </h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. jane@example.com"
                  />
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
                  2. Shipping Address
                </h3>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Street address or P.O. Box"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
                  3. Payment Method (Simulated Gateway)
                </h3>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  <label style={{
                    flex: 1,
                    padding: '0.85rem',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="paymentMethod" value="CreditCard" defaultChecked />
                    <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Credit / Debit Card</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiration Date</label>
                    <input
                      type="text"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Confirmation Summary */}
            <div className="card-elevated" style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                Review Order ({cart.length} items)
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {quantity}x {product.name}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      ${((Number(product.price) || 0) * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                {loading ? (
                  <>
                    <Loading size="small" message="Submitting Order to AWS Backend..." />
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Place Order & Pay (${grandTotal.toFixed(2)})
                  </>
                )}
              </button>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Zap size={15} style={{ flexShrink: 0 }} />
                <span>Publishes <code>OrderCreated</code> to EventBridge upon completion.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
