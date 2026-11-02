import { ProductCard } from './ProductCard';
import { products, categories, getProductsByCategory, searchProducts } from '../../utils/products';
import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export function ProductGrid({ initialCategory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = selectedCategory === 'all' ? products : getProductsByCategory(selectedCategory);

    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    switch (sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...result].reverse();
      default:
        return result;
    }
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="search"
            placeholder="Search supplements..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem' }}>
              <Filter size={18} />
              <span>{selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</span>
              <ChevronDown size={16} />
            </button>
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 200,
              zIndex: 100,
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '0.625rem 2rem 0.625rem 1rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b6b7a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <Search size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Try adjusting your search or filter criteria
          </p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}