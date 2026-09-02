import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Server, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Radio, 
  Terminal,
  Zap,
  BookOpen,
  Code2,
  Trash2,
  Layers,
  HelpCircle,
  Database
} from 'lucide-react';
import systemApi from '../api/systemApi';
import { BASE_URL } from '../api/apiClient';

export const VivaGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('mesh');
  const [meshStatus, setMeshStatus] = useState([]);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [events, setEvents] = useState([]);
  const [swaggerDocs, setSwaggerDocs] = useState([]);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await systemApi.checkMeshHealth();
      setMeshStatus(data);
    } catch (e) {
      console.error('Failed to check health', e);
    } finally {
      setLoadingHealth(false);
    }
  };

  const loadEvents = () => {
    setEvents(systemApi.getEventLogs());
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
      loadEvents();
      setSwaggerDocs(systemApi.getSwaggerDocs());

      // Subscribe to real-time events
      const unsubscribe = systemApi.subscribeEvents((newEvent) => {
        setEvents(prev => [newEvent, ...prev]);
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: '20px',
        maxWidth: '960px',
        width: '100%',
        maxHeight: '90vh',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  SmartRetailX <span style={{ background: 'linear-gradient(135deg, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Viva & Architecture Inspector</span>
                </h2>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  LIVE MESH
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Interactive presentation & cloud evaluation panel for university examiners
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 1.5rem',
          gap: '0.5rem',
          background: 'rgba(10, 15, 28, 0.95)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'mesh', label: 'Microservice Mesh', icon: <Activity size={16} /> },
            { id: 'events', label: 'AWS EventBridge Log', icon: <Radio size={16} /> },
            { id: 'swagger', label: 'OpenAPI / Swagger', icon: <Code2 size={16} /> },
            { id: 'diagram', label: 'Cloud Architecture', icon: <Layers size={16} /> },
            { id: 'script', label: 'Viva Demo Script & Q&A', icon: <BookOpen size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.9rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', flexGrow: 1, overflowY: 'auto' }}>
          
          {/* TAB 1: Live Mesh Status */}
          {activeTab === 'mesh' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Microservices Cluster & Response Latency</h3>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Path-based Routing: 6 independent services communicating over REST and SQS event mesh.
                  </p>
                </div>
                <button 
                  onClick={checkHealth}
                  disabled={loadingHealth}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.5rem' }}
                >
                  <RefreshCw size={14} className={loadingHealth ? 'animate-spin' : ''} />
                  Ping Cluster
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
                {meshStatus.map((svc, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{svc.name}</h4>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            Port {svc.port || 5000 + idx}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{svc.role}</span>
                      </div>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {svc.status || 'Online'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <span>HTTP Status: <strong style={{ color: '#38bdf8' }}>{svc.httpCode || 200} OK</strong></span>
                      <span>Latency: <strong style={{ color: '#34d399' }}>{svc.latencyMs}ms</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Live AWS EventBridge Log */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>AWS EventBridge Event Mesh Stream</h3>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Real-time asynchronous domain events published and consumed by decoupled microservices.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      systemApi.clearEventLogs();
                      loadEvents();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <Trash2 size={14} /> Clear Log
                  </button>
                  <button 
                    onClick={() => {
                      systemApi.resetDatabase();
                      loadEvents();
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Reset Seed Data
                  </button>
                </div>
              </div>

              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Radio size={32} style={{ color: '#64748b', marginBottom: '0.75rem' }} />
                  <h4 style={{ color: '#ffffff' }}>No events logged yet</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Place an order or update stock to see EventBridge events stream here in real-time!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {events.map((evt) => (
                    <div 
                      key={evt.id}
                      style={{
                        padding: '1rem 1.25rem',
                        background: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#818cf8', fontWeight: 700 }}>{evt.detailType}</span>
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>• {evt.source}</span>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {new Date(evt.time).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: '#38bdf8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        {JSON.stringify(evt.detail, null, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Interactive OpenAPI / Swagger Explorer */}
          {activeTab === 'swagger' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>REST API & Swagger Documentation Explorer</h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Complete OpenAPI v3 specifications for the 6 decoupled ASP.NET Core microservices.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {swaggerDocs.map((doc, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '12px',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>{doc.service}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{doc.description}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {doc.endpoints.map((ep, eIdx) => {
                        const methodColors = {
                          GET: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
                          POST: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
                          PUT: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
                          DELETE: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' }
                        };
                        const mStyle = methodColors[ep.method] || methodColors.GET;

                        return (
                          <div 
                            key={eIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.6rem 0.9rem',
                              background: '#090d16',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: mStyle.bg,
                                color: mStyle.text,
                                border: `1px solid ${mStyle.border}`,
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                fontFamily: 'monospace'
                              }}>
                                {ep.method}
                              </span>
                              <code style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{ep.path}</code>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ep.desc}</span>
                              <span style={{ fontSize: '0.7rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.15)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                {ep.auth}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Cloud Architecture Diagram */}
          {activeTab === 'diagram' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                Distributed Cloud Architecture & Event Flow
              </h3>
              
              <div style={{
                background: '#080c14',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: '#38bdf8',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                <pre>{`
  [ Internet / Web Clients ]
                 │
                 ▼
  [ AWS Application Load Balancer (ALB) - Port 80/443 ]
         │
         ├── /                     ──► Frontend React SPA (Nginx Container)
         ├── /api/v1/auth/*        ──► UserService (.NET 10 / Port 5001)
         ├── /api/v1/users/*       ──► UserService (.NET 10 / Port 5001)
         ├── /api/v1/products/*    ──► ProductService (.NET 10 / Port 5002)
         ├── /api/v1/orders/*      ──► OrderService (.NET 10 / Port 5003)
         ├── /api/v1/inventory/*   ──► InventoryService (.NET 10 / Port 5004)
         ├── /api/v1/payments/*    ──► PaymentService (.NET 10 / Port 5005)
         └── /api/v1/notifications/*► NotificationService (.NET 10 / Port 5006)

  [ Asynchronous Event Mesh (EventBridge & SQS) ]
  OrderService ──(OrderCreated Event)──► AWS EventBridge Bus
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
         [ InventoryService ]                                      [ NotificationService ]
     (Deducts stock in Database)                                (Sends Dispatch Confirmation)
                `}</pre>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ color: '#818cf8', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>AWS ALB & ECS</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Path-based reverse proxy listener routing HTTP traffic directly to containerized microservices.</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>Event-Driven Mesh</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Decoupled event publishing via AWS EventBridge and SQS queues for asynchronous processing.</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>JWT Security</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>HMAC-SHA256 tokens with role-based claims (Admin, Customer) passed via Bearer auth headers.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Viva Demo Script & Examiner Q&A */}
          {activeTab === 'script' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  10-Step Viva Demonstration Walkthrough
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { step: 1, title: 'Introduction & Architecture Overview', desc: 'Present SmartRetailX as a cloud-native distributed microservices platform built with .NET 10, React, Docker, and AWS services.' },
                    { step: 2, title: 'Show Live Microservice Mesh Health', desc: 'Open this Viva Inspector to prove that all 6 services (User, Product, Order, Inventory, Payment, Notification) are healthy and responding.' },
                    { step: 3, title: 'Demonstrate Customer Authentication & RBAC', desc: 'Login with demo customer (jane@example.com) and show JWT token generation and role decoding.' },
                    { step: 4, title: 'Browse Dynamic Product Catalog', desc: 'Navigate to Products, filter by category (Gaming, Audio, Computers), search items, and explain EF Core query execution.' },
                    { step: 5, title: 'Inspect Real-time Inventory Stock', desc: 'Open product details, show live stock indicators, and explain how the Inventory Service guarantees availability.' },
                    { step: 6, title: 'Add Items to Cart & Calculate Totals', desc: 'Add products to cart, apply coupon code (e.g. VIVA2025), and review total amount breakdown.' },
                    { step: 7, title: 'Complete Checkout & Place Order', desc: 'Submit checkout to POST /api/v1/orders, generating Order ID #SRX-ORD-... and saving to database.' },
                    { step: 8, title: 'Show EventBridge Event Dispatching', desc: 'Switch to the "AWS EventBridge Log" tab to show the OrderCreated event triggering automatic stock deduction.' },
                    { step: 9, title: 'Admin Dashboard Management', desc: 'Switch to Admin role (admin@smartretailx.com) to show product catalog CRUD, stock adjustment, and order status updates.' },
                    { step: 10, title: 'OpenAPI / Swagger Inspection', desc: 'Open Swagger tab to show complete REST endpoint documentation, schemas, and HTTP status codes.' }
                  ].map(item => (
                    <div key={item.step} style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.15rem' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Questions Cheat Sheet */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} /> Top Viva Questions & Answers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    {
                      q: 'Why use microservices instead of a monolithic architecture?',
                      a: 'Microservices enable independent scalability, isolated failures, independent deployment pipelines, and domain boundary separation (Order, Inventory, Users).'
                    },
                    {
                      q: 'How do you handle data consistency between OrderService and InventoryService?',
                      a: 'We use the Eventual Consistency pattern via AWS EventBridge and SQS. When an order is created, an OrderCreated event is published asynchronously, and InventoryService consumes it to deduct stock.'
                    },
                    {
                      q: 'How does authentication work in this architecture?',
                      a: 'UserService generates HMAC-SHA256 signed JSON Web Tokens (JWT) containing user claims (sub, role, email). The client passes this token in the Authorization: Bearer <token> header for protected endpoints.'
                    },
                    {
                      q: 'How does the AWS Application Load Balancer route requests?',
                      a: 'The ALB uses path-based routing rules (e.g. /api/v1/products* -> ProductService target group, /api/v1/orders* -> OrderService target group).'
                    }
                  ].map((qa, i) => (
                    <div key={i} style={{ padding: '0.9rem 1.1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Q: {qa.q}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>A: {qa.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 15, 28, 0.95)'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            SmartRetailX Cloud Edition • Designed for Viva Presentation
          </span>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default VivaGuideModal;
