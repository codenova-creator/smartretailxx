import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, shipping, grandTotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--text-dim)'
            }}>
              <ShoppingCart size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Your shopping cart is empty
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingBag size={18} />
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="section-title">
              <ShoppingCart size={28} style={{ color: 'var(--accent-primary)' }} />
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h1>
            <p className="section-subtitle">
              Review your items before proceeding to secure checkout
            </p>
          </div>

          <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-rose)' }}>
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map(({ product, quantity }) => {
              const unitPrice = Number(product.price) || 0;
              const lineTotal = unitPrice * quantity;

              return (
                <div 
                  key={product.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#0e1524',
                    flexShrink: 0
                  }}>
                    <img 
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flexGrow: 1, minWidth: '180px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '0.35rem' }}>
                      {product.category || 'Product'}
                    </span>
                    <Link to={`/products/${product.id}`} style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      ${unitPrice.toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{ background: 'none', border: 'none', padding: '0.4rem 0.6rem', color: 'var(--text-main)', cursor: 'pointer' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ padding: '0 0.6rem', fontWeight: 700, fontSize: '0.9rem', minWidth: '24px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{ background: 'none', border: 'none', padding: '0.4rem 0.6rem', color: 'var(--text-main)', cursor: 'pointer' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div style={{ minWidth: '80px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="btn btn-secondary btn-icon"
                    style={{ width: '34px', height: '34px', color: 'var(--accent-rose)' }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}

            <div style={{ marginTop: '1rem' }}>
              <Link to="/products" className="btn btn-secondary btn-sm">
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="card-elevated" style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Tax (8%)</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="badge badge-success">FREE</span>
                  ) : (
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${shipping.toFixed(2)}</span>
                  )}
                </span>
              </div>

              {subtotal < 150 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 Add ${(150 - subtotal).toFixed(2)} more for <strong>FREE Shipping</strong>!
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                marginTop: '0.5rem'
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              🔒 Guaranteed Safe Checkout & Instant Microservices Sync
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
