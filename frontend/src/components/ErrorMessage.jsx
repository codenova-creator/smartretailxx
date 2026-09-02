import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry = null,
  variant = 'error'
}) => {
  const isWarning = variant === 'warning';
  const borderColor = isWarning ? 'var(--accent-amber)' : 'var(--accent-rose)';
  const bgColor = isWarning ? 'rgba(245, 158, 11, 0.08)' : 'rgba(244, 63, 94, 0.08)';

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      margin: '1.5rem 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    }}>
      <AlertCircle 
        size={24} 
        style={{ 
          color: borderColor,
          flexShrink: 0,
          marginTop: '2px'
        }} 
      />
      <div style={{ flexGrow: 1 }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: 700, 
          color: '#ffffff', 
          marginBottom: '0.35rem' 
        }}>
          {title}
        </h4>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.9rem', 
          lineHeight: 1.5 
        }}>
          {message || 'Unable to connect to the backend service. Please check your network connection.'}
        </p>

        {onRetry && (
          <button 
            onClick={onRetry}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.85rem' }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
