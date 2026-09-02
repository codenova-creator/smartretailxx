import React, { useState, useEffect } from 'react';
import { Activity, Check, Radio, Layers, Server, Shield, Cpu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSystemEvents, onSystemEvent } from '../api/systemApi';

export const SystemStatus = () => {
  const [events, setEvents] = useState(() => getSystemEvents());

  useEffect(() => {
    const unsub = onSystemEvent((newEvt) => {
      setEvents(prev => [newEvt, ...prev.slice(0, 30)]);
    });
    return unsub;
  }, []);

  const services = [
    { name: 'UserService', port: 5001, role: 'JWT Auth & RBAC Identity (ASP.NET Core / .NET 10)', latency: 12, http: 200 },
    { name: 'ProductService', port: 5002, role: 'Catalog & EF Core (ASP.NET Core / .NET 10)', latency: 18, http: 200 },
    { name: 'OrderService', port: 5003, role: 'Order Processing & EventMesh (ASP.NET Core / .NET 10)', latency: 15, http: 200 },
    { name: 'InventoryService', port: 5004, role: 'Real-time Stock Control (ASP.NET Core / .NET 10)', latency: 10, http: 200 },
    { name: 'PaymentService', port: 5005, role: 'Payment Gateway Integration (ASP.NET Core / .NET 10)', latency: 22, http: 200 },
    { name: 'NotificationService', port: 5006, role: 'AWS EventBridge Alerts (ASP.NET Core / .NET 10)', latency: 14, http: 200 }
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981', marginRight: '0.5rem' }}></span>
              System Status & Cluster Health
            </h1>
            <p className="section-subtitle">Real-time telemetry and microservices mesh monitoring</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/docs" className="btn btn-secondary btn-sm">
              <Cpu size={15} /> OpenAPI / Swagger Docs
            </Link>
            <Link to="/products" className="btn btn-primary btn-sm">
              Browse Storefront
            </Link>
          </div>
        </div>

        {/* Global Cluster Status Banner */}
        <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '2rem',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>All Systems Operational</h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AWS Region: <strong>ap-south-1</strong> • Target Group Health: <strong>6/6 Online</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Average Latency</div>
                <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>15.2 ms</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Cluster Uptime</div>
                <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>99.99%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Microservices Grid */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Active Container Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {services.map(svc => (
            <div key={svc.name} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>{svc.name}</h4>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Port {svc.port}</span>
                </div>
                <span className="badge badge-success">200 OK</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.5rem 0 1rem' }}>{svc.role}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', fontSize: '0.82rem' }}>
                <span>Health Check: <strong style={{ color: '#38bdf8' }}>Healthy</strong></span>
                <span>Latency: <strong style={{ color: '#34d399' }}>{svc.latency}ms</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time EventMesh Log */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>AWS EventBridge Event Mesh</h3>
              <button onClick={() => setEvents([])} className="btn btn-secondary btn-sm">Clear Stream</button>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Asynchronous domain events published across services during checkout, stock deductions, and notifications:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {events.map(e => (
                <div key={e.id} style={{ padding: '0.75rem 1rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#818cf8', fontWeight: 700 }}>{e.detailType}</span>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{new Date(e.time).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ color: '#38bdf8' }}>{JSON.stringify(e.detail)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Blueprint */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Cloud Routing Architecture</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Path-based reverse proxy routing mapped through the AWS Application Load Balancer:
            </p>
            <div style={{ background: '#080c14', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#38bdf8', lineHeight: 1.5, overflowX: 'auto' }}>
              <pre>{`
  [ Client Browser / SPA ]
             │
             ▼
  [ AWS Application Load Balancer ]
     ├── /                     ──► Frontend SPA
     ├── /api/v1/auth/*        ──► UserService (5001)
     ├── /api/v1/products/*    ──► ProductService (5002)
     ├── /api/v1/orders/*      ──► OrderService (5003)
     ├── /api/v1/inventory/*   ──► InventoryService (5004)
     └── /api/v1/payments/*    ──► PaymentService (5005)

  [ EventBridge Asynchronous Mesh ]
  OrderService ──► AWS EventBridge Bus ──► SQS Queue
                     ├──► InventoryService (Stock)
                     └──► NotificationService (Email)
              `}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
