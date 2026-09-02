import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'}`}>
        {isSuccess && <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />}
        {isError && <AlertCircle size={20} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />}
        {!isSuccess && !isError && <Info size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />}

        <div style={{ flexGrow: 1, fontSize: '0.9rem', color: '#ffffff' }}>
          {toastMessage.message}
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
