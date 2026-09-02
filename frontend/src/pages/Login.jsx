import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Email and password are required.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setAuthError(null);
    const res = await login(demoEmail, demoPassword);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card-elevated">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--grad-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
            }}>
              <LogIn size={26} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Sign in to access your SmartRetailX account & orders
            </p>
          </div>

          {authError && (
            <ErrorMessage 
              title="Authentication Failed" 
              message={authError} 
              onRetry={() => setAuthError(null)} 
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {loading ? 'Authenticating with Backend...' : 'Sign In'}
            </button>
          </form>

          {/* 1-Click Instant Demo Login for Viva Evaluators */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#a5b4fc', marginBottom: '0.75rem', fontWeight: 600 }}>
              <Zap size={14} style={{ color: '#38bdf8' }} /> 1-Click Viva Demo Login:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('jane@example.com', 'secret123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.45rem' }}
              >
                Jane (Customer)
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@smartretailx.com', 'Admin@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.45rem', color: '#a5b4fc' }}
              >
                Admin Account
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
