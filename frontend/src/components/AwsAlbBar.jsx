import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, ShieldCheck, Copy, Check, ExternalLink, ChevronUp, ChevronDown, Zap, Server } from 'lucide-react';

const ALB_BASE_DOMAIN = 'smartretailx-alb-123532839.ap-south-1.elb.amazonaws.com';

export const AwsAlbBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const fullAlbUrl = `http://${ALB_BASE_DOMAIN}${location.pathname}${location.search}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullAlbUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (minimized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        right: '20px',
        zIndex: 1100,
        background: '#090d16',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        padding: '0.3rem 0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        color: '#a5b4fc'
      }}
      onClick={() => setMinimized(false)}
      title="Expand AWS ALB Address Ribbon"
      >
        <Globe size={13} style={{ color: '#38bdf8' }} />
        <span>AWS ALB: <strong>{location.pathname}</strong></span>
        <ChevronDown size={14} />
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #090e1a 0%, #0d1527 50%, #090e1a 100%)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.35)',
      padding: '0.4rem 1rem',
      fontSize: '0.8rem',
      position: 'relative',
      zIndex: 105,
      color: '#cbd5e1'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: 0
      }}>
        {/* Left: AWS Tag & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 153, 0, 0.15)',
            border: '1px solid rgba(255, 153, 0, 0.4)',
            color: '#fbbf24',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.04em'
          }}>
            <Server size={12} />
            <span>AWS ALB</span>
          </div>

          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Region: <strong>ap-south-1</strong></span>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>•</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#34d399',
            fontSize: '0.72rem',
            fontWeight: 600
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            ECS Target Group: 6/6 Healthy (14ms)
          </span>
        </div>

        {/* Center: Simulated AWS ALB Live URL Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#060911',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          padding: '0.2rem 0.75rem',
          maxWidth: '560px',
          flexGrow: 1,
          fontFamily: 'monospace',
          fontSize: '0.78rem'
        }}>
          <Globe size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            http://<strong style={{ color: '#f8fafc' }}>{ALB_BASE_DOMAIN}</strong><span style={{ color: '#38bdf8' }}>{location.pathname}</span>{location.search}
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              gap: '0.3rem',
              background: 'rgba(255,255,255,0.05)'
            }}
            title="Copy AWS ALB Gateway URL"
          >
            {copied ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
            {copied ? 'Copied ALB Link' : 'Copy ALB URL'}
          </button>

          <button
            onClick={() => setMinimized(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Minimize bar"
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwsAlbBar;
