import React, { useState } from 'react';
import { Cpu, Server, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApiDocs = () => {
  const [selectedService, setSelectedService] = useState('all');

  const apiSpecs = [
    { service: 'UserService', method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate user credentials & issue signed JWT bearer token', auth: 'Public', status: '200 OK' },
    { service: 'UserService', method: 'POST', path: '/api/v1/auth/register', desc: 'Create new customer or administrator account with password hashing', auth: 'Public', status: '201 Created' },
    { service: 'UserService', method: 'GET', path: '/api/v1/users/me', desc: 'Retrieve authenticated user identity and role claims', auth: 'Bearer JWT', status: '200 OK' },
    { service: 'ProductService', method: 'GET', path: '/api/v1/products', desc: 'Fetch catalog products with category filtering & pagination', auth: 'Public', status: '200 OK' },
    { service: 'ProductService', method: 'GET', path: '/api/v1/products/{id}', desc: 'Retrieve individual product details and technical specifications', auth: 'Public', status: '200 OK' },
    { service: 'ProductService', method: 'POST', path: '/api/v1/products', desc: 'Publish new hardware product to catalog (Admin role required)', auth: 'Admin JWT', status: '201 Created' },
    { service: 'ProductService', method: 'DELETE', path: '/api/v1/products/{id}', desc: 'Remove hardware product from catalog', auth: 'Admin JWT', status: '204 No Content' },
    { service: 'OrderService', method: 'POST', path: '/api/v1/orders', desc: 'Place order and trigger asynchronous OrderCreated EventMesh', auth: 'Bearer JWT', status: '201 Created' },
    { service: 'OrderService', method: 'GET', path: '/api/v1/orders/user/{userId}', desc: 'Retrieve customer order history and dispatch timeline', auth: 'Bearer JWT', status: '200 OK' },
    { service: 'OrderService', method: 'PUT', path: '/api/v1/orders/{id}/status', desc: 'Update order fulfillment state (Confirmed/Shipped/Delivered)', auth: 'Admin JWT', status: '200 OK' },
    { service: 'InventoryService', method: 'GET', path: '/api/v1/inventory', desc: 'Get live warehouse stock levels for all catalog items', auth: 'Public', status: '200 OK' },
    { service: 'InventoryService', method: 'PUT', path: '/api/v1/inventory/{id}', desc: 'Directly modify warehouse stock quantity', auth: 'Admin JWT', status: '200 OK' },
    { service: 'PaymentService', method: 'POST', path: '/api/v1/payments', desc: 'Process payment authorization and generate transaction receipt', auth: 'Bearer JWT', status: '200 OK' },
    { service: 'NotificationService', method: 'POST', path: '/api/v1/notifications/send', desc: 'EventBridge consumer worker for customer confirmation emails', auth: 'Internal Bus', status: '200 OK' }
  ];

  const filteredSpecs = selectedService === 'all' ? apiSpecs : apiSpecs.filter(s => s.service.toLowerCase() === selectedService.toLowerCase());

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title"><Cpu size={24} style={{ marginRight: '0.5rem' }} /> OpenAPI 3.0 & REST API Reference</h1>
            <p className="section-subtitle">Official Swagger documentation for all 6 decoupled ASP.NET Core microservices</p>
          </div>

          <Link to="/status" className="btn btn-secondary btn-sm">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', marginRight: '4px' }}></span>
            Cluster Status Monitor
          </Link>
        </div>

        {/* Filter by Microservice */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['all', 'UserService', 'ProductService', 'OrderService', 'InventoryService', 'PaymentService', 'NotificationService'].map(svc => (
            <button
              key={svc}
              onClick={() => setSelectedService(svc)}
              className={`btn btn-sm ${selectedService === svc ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {svc === 'all' ? 'All Microservices' : svc}
            </button>
          ))}
        </div>

        {/* API Endpoints List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredSpecs.map((api, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${api.method === 'GET' ? 'badge-cyan' : api.method === 'POST' ? 'badge-success' : api.method === 'PUT' ? 'badge-warning' : 'badge-danger'}`} style={{ fontWeight: 800 }}>
                    {api.method}
                  </span>
                  <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{api.path}</code>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Auth: {api.auth}
                  </span>
                  <span className="badge badge-primary">{api.service}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{api.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
