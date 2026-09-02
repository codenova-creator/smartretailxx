import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Package, RefreshCw, X } from 'lucide-react';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const currentCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'name'
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = ['All', 'Gaming', 'Computers', 'Audio', 'Electronics', 'Accessories'];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentCategory && currentCategory !== 'All') {
        params.category = currentCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const data = await productApi.getProducts(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products', err);
      setError(err.friendlyMessage || 'Failed to retrieve products from the catalog service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      nextParams.set('search', searchQuery.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
    fetchProducts();
  };

  const handleCategoryChange = (cat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('default');
    setInStockOnly(false);
    setSearchParams({});
  };

  // Client-side sorting & stock filter
  let displayedProducts = [...products];

  if (inStockOnly) {
    displayedProducts = displayedProducts.filter(p => (p.stock === undefined || p.stock > 0));
  }

  if (sortBy === 'price-low') {
    displayedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price-high') {
    displayedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === 'name') {
    displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="section-title">
                <Package size={28} style={{ color: 'var(--accent-primary)' }} />
                Product Catalog
              </h1>
              <p className="section-subtitle">
                Explore available inventory powered by the ASP.NET Core Product Microservice
              </p>
            </div>

            <button 
              onClick={fetchProducts} 
              disabled={loading}
              className="btn btn-secondary btn-sm"
              title="Refresh Catalog from Backend"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexGrow: 1, maxWidth: '420px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', padding: '0 0.75rem' }}
              >
                <Search size={16} />
              </button>
            </form>

            {/* Sort & Stock Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} style={{ color: 'var(--text-dim)' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                In Stock Only
              </label>

              {(searchQuery || currentCategory !== 'All' || sortBy !== 'default' || inStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--accent-rose)' }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingTop: '1rem',
            marginTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {categories.map((cat) => {
              const active = currentCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{displayedProducts.length}</strong> products
            {currentCategory !== 'All' && <span> in <strong>{currentCategory}</strong></span>}
          </span>
        </div>

        {/* Grid or States */}
        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage 
            title="Unable to Load Products" 
            message={error} 
            onRetry={fetchProducts} 
          />
        ) : displayedProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching products</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No products found matching your search or category filter.
            </p>
            <button onClick={clearFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
