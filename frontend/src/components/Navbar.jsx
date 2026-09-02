import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Layers, 
  Package, 
  Home as HomeIcon, 
  ShieldCheck,
  ChevronDown,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const handleQuickDemoAdmin = async () => {
    try {
      await login('admin@smartretailx.com', 'Admin@123');
      setUserDropdownOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickDemoCustomer = async () => {
    try {
      await login('jane@example.com', 'secret123');
      setUserDropdownOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
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
            <span>
              Smart<span className="gradient-text">RetailX</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              <HomeIcon size={16} />
              Home
            </NavLink>

            <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Package size={16} />
              Products
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={16} />
                My Orders
              </NavLink>
            )}

            <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
              System Status
            </NavLink>

            <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Cpu size={16} />
              API Docs
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ShieldCheck size={16} />
                Admin Portal
              </NavLink>
            )}
          </nav>

          {/* Actions (Cart & Auth) */}
          <div className="nav-actions">
            {/* Shopping Cart Button */}
            <Link to="/cart" className="btn btn-secondary btn-icon cart-btn-wrapper" title="Shopping Cart">
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.9rem', gap: '0.5rem' }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.88rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '240px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {user?.email}
                      </div>
                      <span className="badge badge-cyan" style={{ marginTop: '0.4rem', fontSize: '0.65rem' }}>
                        Role: {user?.role}
                      </span>
                    </div>

                    {/* Quick Demo Switcher */}
                    <div style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                        Quick Demo Switcher
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={handleQuickDemoCustomer}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          Customer
                        </button>
                        <button
                          onClick={handleQuickDemoAdmin}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#a5b4fc' }}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <Link 
                      to="/profile" 
                      className="nav-link" 
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.5rem 0.75rem' }}
                    >
                      <User size={15} />
                      My Profile
                    </Link>

                    <Link 
                      to="/orders" 
                      className="nav-link" 
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.5rem 0.75rem' }}
                    >
                      <Layers size={15} />
                      Order History
                    </Link>

                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="nav-link" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ padding: '0.5rem 0.75rem', color: '#a5b4fc' }}
                      >
                        <ShieldCheck size={15} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout}
                      className="nav-link" 
                      style={{ 
                        padding: '0.5rem 0.75rem', 
                        color: 'var(--accent-rose)', 
                        width: '100%', 
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="btn btn-secondary btn-icon" 
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 99
          }}>
            <button
              onClick={() => {
                setVivaModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.5rem', color: '#a5b4fc' }}
            >
              <Zap size={16} /> Open Viva & Architecture Inspector
            </button>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <HomeIcon size={18} /> Home
            </Link>
            <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Package size={18} /> Products Catalog
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Layers size={18} /> My Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <ShieldCheck size={18} /> Admin Portal
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
