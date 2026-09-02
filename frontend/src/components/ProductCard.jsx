import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Default curated image mapping based on category or name fallback
const DEFAULT_IMAGES = {
  gaming: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
  computers: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
  electronics: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  furniture: 'https://images.unsplash.com/photo-1580481077114-1e09dfa98f12?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = Number(product.price) || 0;
  const stock = product.stock !== undefined ? product.stock : 50;
  const isOutOfStock = stock <= 0;

  // Resolve image source
  const getProductImage = () => {
    if (product.imageUrl && !imgError) {
      return product.imageUrl;
    }
    const cat = (product.category || '').toLowerCase();
    return DEFAULT_IMAGES[cat] || DEFAULT_IMAGES.default;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img 
          src={getProductImage()} 
          alt={product.name} 
          className="product-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-badge-float">
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : stock < 10 ? (
            <span className="badge badge-warning">Only {stock} Left</span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category || 'General'}</span>

        <Link to={`/products/${product.id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <p className="product-desc" title={product.description}>
          {product.description || 'Premium retail product built for performance and quality.'}
        </p>

        <div className="product-footer">
          <div className="product-price">
            ${price.toFixed(2)}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link 
              to={`/products/${product.id}`}
              className="btn btn-secondary btn-icon"
              title="View Product Details"
              style={{ width: '36px', height: '36px' }}
            >
              <Eye size={16} />
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn btn-icon ${added ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '36px', height: '36px' }}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}
            >
              {added ? (
                <Check size={16} style={{ color: 'var(--accent-emerald)' }} />
              ) : (
                <ShoppingCart size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
