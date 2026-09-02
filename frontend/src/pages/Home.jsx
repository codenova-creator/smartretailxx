import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Package, 
  ShieldCheck, 
  Zap, 
  Truck,
  Star,
  Cloud, 
  Layers, 
  Activity,
  ShoppingBag,
  Cpu
} from 'lucide-react';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';
import Loading, { ProductSkeleton } from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts();
      setFeaturedProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load products for homepage:', err);
      setError('Unable to load featured products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Computers & Laptops', icon: '💻', count: '12 Items', path: '/products?category=Computers' },
    { name: 'Smartphones & Watches', icon: '📱', count: '8 Items', path: '/products?category=Electronics' },
    { name: 'Audio & Headsets', icon: '🎧', count: '6 Items', path: '/products?category=Audio' },
    { name: 'Gaming Gear & Rigs', icon: '🎮', count: '15 Items', path: '/products?category=Gaming' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        padding: '5rem 0 4rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-full)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              <Zap size={14} /> Official Tech & Gaming Hardware Destination
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em'
            }}>
              The Next-Generation <span className="gradient-text">E-Commerce Experience</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem'
            }}>
              Discover high-performance tech gadgets, next-gen gaming hardware, pro audio gear, 
              and accessories delivered directly to your doorstep with full warranty.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                Explore Products
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-lg">
                <Truck size={18} />
                Track Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>10,000+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Happy Tech Customers</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Genuine Brand Warranty</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>1-3 Days</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Islandwide Express Delivery</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>4.9 / 5</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Verified Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title" style={{ justifyContent: 'center' }}>
              Explore Categories
            </h2>
            <p className="section-subtitle">
              Browse top equipment and curated products from our real catalog
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/products?category=${cat.name}`}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  width: '52px',
                  height: '52px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {cat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '2rem 0 5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 className="section-title">
                <Package size={26} style={{ color: 'var(--accent-primary)' }} />
                Featured Products
              </h2>
              <p className="section-subtitle">
                Live catalog items retrieved directly from the Product Microservice
              </p>
            </div>

            <Link to="/products" className="btn btn-secondary btn-sm">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage 
              title="Product Service Error" 
              message={error} 
              onRetry={fetchProducts} 
            />
          ) : featuredProducts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Package size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
              <h3>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                The Product Microservice database is currently empty.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Microservice Architecture Feature Highlights */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '5rem 0'
      }}>
        <div className="container">
          <div style={{ maxWidth: '650px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
            <h2 className="section-title" style={{ justifyContent: 'center' }}>
              Built with Enterprise Cloud Standards
            </h2>
            <p className="section-subtitle">
              Engineered for horizontal scalability, decoupling, and high availability on AWS
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Decoupled Microservices</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                6 independently deployable microservices (User, Product, Order, Inventory, Payment, Notification) running with dedicated SQLite/RDS databases.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Cloud size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>AWS ECS & ALB</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Unified routing through an Application Load Balancer path-based listener mesh, distributing requests smoothly to healthy container instances.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Event-Driven Mesh</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Asynchronous event publishing to AWS EventBridge & SQS upon order creation, triggering instant inventory reductions and notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
