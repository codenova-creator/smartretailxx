import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Headphones, CreditCard, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Platform Overview */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                SX
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Smart<span className="gradient-text">RetailX</span>
              </h3>
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Next-generation retail platform delivering premium tech gadgets, computers, audio systems, 
              and accessories with fast islandwide delivery and secure payment processing.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">100% Genuine Gear</span>
              <span className="badge badge-cyan">Islandwide Express</span>
              <span className="badge badge-success">24/7 Support</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4>Store Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Product Catalog</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Support */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul>
              <li><Link to="/products">Help Center & FAQ</Link></li>
              <li><Link to="/orders">Shipping & Delivery Policy</Link></li>
              <li><Link to="/orders">Returns & Warranty</Link></li>
              <li><Link to="/products">Privacy & Terms</Link></li>
              <li><Link to="/profile">Customer Support</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Guarantee */}
          <div className="footer-col">
            <h4>Buyer Protection</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <span>Official Brand Manufacturer Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>Fast Tracked Doorstep Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                <span>Cards, Koko 3-Pay & Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2026 SmartRetailX. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            <span>Islandwide Delivery</span>
            <span>Secure Transactions</span>
            <span>Genuine Quality Assured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
