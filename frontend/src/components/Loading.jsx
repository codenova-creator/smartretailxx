import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Loading...', fullScreen = false, size = 'default' }) => {
  const iconSize = size === 'small' ? 20 : size === 'large' ? 44 : 32;

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: fullScreen ? '0' : '3rem 1.5rem',
      gap: '1rem',
      textAlign: 'center'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Loader2 
          size={iconSize} 
          className="animate-spin" 
          style={{ color: 'var(--accent-primary)' }} 
        />
      </div>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: size === 'small' ? '0.85rem' : '0.95rem',
        fontWeight: 500
      }}>
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export const ProductSkeleton = () => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        width: '100%',
        paddingTop: '65%',
        background: 'linear-gradient(90deg, #101726 25%, #162035 50%, #101726 75%)',
        backgroundSize: '200% 100%',
        animation: 'pulseGlow 1.5s infinite'
      }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ width: '40%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '0.75rem' }} />
        <div style={{ width: '85%', height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '0.5rem' }} />
        <div style={{ width: '60%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '35%', height: '24px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
          <div style={{ width: '40px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
