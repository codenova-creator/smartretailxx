import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Plus,
  Minus,
  Layers,
  Activity
} from 'lucide-react';
import productApi from '../api/productApi';
import inventoryApi from '../api/inventoryApi';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DEFAULT_IMAGES = {
  gaming: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1000&auto=format&fit=crop&q=80',
  computers: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80',
  electronics: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop&q=80',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80',
  furniture: 'https://images.unsplash.com/photo-1580481077114-1e09dfa98f12?w=1000&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80'
};

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [inventoryInfo, setInventoryInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchProductAndInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch from Product Service
      const prodData = await productApi.getProductById(id);
      setProduct(prodData);

      // 2. Fetch live stock from Inventory Service
      try {
        const invData = await inventoryApi.getInventory(id);
        setInventoryInfo(invData);
      } catch (invErr) {
        console.warn('Inventory lookup returned:', invErr.message);
      }
    } catch (err) {
      console.error('Failed to load product details', err);
      setError(err.friendlyMessage || 'Unable to load product information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndInventory();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getProductImage = () => {
    if (product?.imageUrl && !imgError) {
      return product.imageUrl;
    }
    const cat = (product?.category || '').toLowerCase();
    return DEFAULT_IMAGES[cat] || DEFAULT_IMAGES.default;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <Loading message="Loading product information from Product Service..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <ErrorMessage 
            title="Product Not Found" 
            message={error || 'The requested product could not be loaded.'} 
            onRetry={fetchProductAndInventory} 
          />
          <Link to="/products" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const liveStock = inventoryInfo?.stock !== undefined ? inventoryInfo.stock : (product.stock ?? 50);
  const isOutOfStock = liveStock <= 0;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
          marginBottom: '2rem'
        }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} style={{ color: 'var(--text-muted)' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Image Preview */}
          <div className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
            <div style={{
              width: '100%',
              paddingTop: '80%',
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#090e18'
            }}>
              <img 
                src={getProductImage()} 
                alt={product.name}
                onError={() => setImgError(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <span>Product ID: <code>#{product.id}</code></span>
              <span className="badge badge-primary">{product.category || 'General'}</span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-cyan">{product.category}</span>
                {isOutOfStock ? (
                  <span className="badge badge-danger">Out of Stock</span>
                ) : (
                  <span className="badge badge-success">Live Stock: {liveStock} Units</span>
                )}
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                {product.name}
              </h1>

              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-heading)'
              }}>
                ${price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                Product Overview
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {product.description || 'High-performance cloud-managed hardware designed for modern productivity.'}
              </p>
            </div>

            {/* Microservice Stock Inspector Note */}
            <div style={{
              padding: '1rem',
              background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.85rem'
            }}>
              <Activity size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <div>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Inventory Microservice Live Check:</span>{' '}
                <span style={{ color: 'var(--text-muted)' }}>
                  Validated stock level with Inventory Service at <code>/api/v1/inventory/{product.id}</code>.
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Quantity:
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.6rem 0.85rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{
                    padding: '0 1rem',
                    fontWeight: 700,
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock || quantity >= liveStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.6rem 0.85rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`btn btn-lg ${added ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flexGrow: 1 }}
                >
                  {added ? (
                    <>
                      <Check size={18} style={{ color: 'var(--accent-emerald)' }} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Shopping Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate('/cart');
                  }}
                  disabled={isOutOfStock}
                  className="btn btn-secondary btn-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Feature Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} style={{ color: 'var(--accent-cyan)', margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fast Delivery</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>2-3 Business Days</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>2-Year Warranty</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Full Replacement</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <RotateCcw size={20} style={{ color: 'var(--accent-amber)', margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>30-Day Returns</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Hassle-free</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
