import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { ShoppingCart, Star, Tag, Minus, Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      variant: product.flavors.length > 1 ? product.flavors[0] : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article className="card product-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--color-bg-hover)' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
          loading="lazy"
        />
        {discount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'var(--color-error)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            -{discount}%
          </span>
        )}
        {product.tags.includes('bestseller') && (
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'var(--color-warning)',
            color: 'var(--color-primary)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            Bestseller
          </span>
        )}
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
          }}>
            Out of Stock
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>{product.brand}</span>
          <span className="badge badge-primary" style={{ fontSize: '0.625rem' }}>{product.servings} servings</span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', lineHeight: 1.3 }}>
          {product.name}
        </h3>

        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-warning)' }}>
            <Star size={14} fill="currentColor" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{product.rating}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        {product.flavors.length > 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Flavor</label>
            <select
              className="input-field"
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            >
              {product.flavors.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-ghost"
              style={{ width: 36, height: 36, padding: 0 }}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 500 }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-ghost"
              style={{ width: 36, height: 36, padding: 0 }}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1 }}
          >
            {added ? (
              <>
                <ShoppingCart size={18} />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}